'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircleIcon, XIcon, SendIcon } from 'lucide-react';
import Image from 'next/image';
import { useChat } from '@ai-sdk/react';
import { useRouter, usePathname } from 'next/navigation';

export default function FloatingAssistant({ role = 'customer' }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const chatContainerRef = useRef(null);
    const popupRef = useRef(null);

    // Hide on auth pages
    if (pathname && (pathname.includes('/login') || pathname.includes('/signup'))) {
        return null;
    }

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
        api: '/api/chat',
        body: { role },
        maxSteps: 3,
        onToolCall: ({ toolCall }) => {
            if (toolCall.toolName === 'navigateTo') {
                router.push(toolCall.args.route);
                return 'Navigated successfully.';
            }
            if (toolCall.toolName === 'searchProducts') {
                const query = toolCall.args.query || '';
                const searchParams = new URLSearchParams();
                if (query) searchParams.set('search', query);
                if (toolCall.args.color) searchParams.set('color', toolCall.args.color);
                if (toolCall.args.gsm) searchParams.set('gsm', toolCall.args.gsm);
                if (toolCall.args.maxPrice) searchParams.set('maxPrice', toolCall.args.maxPrice);

                router.push(`/shop?${searchParams.toString()}`);
                return 'Filtered the shop successfully.';
            }
        },
    });

    const toggleAssistant = () => setIsOpen(!isOpen);

    // Auto-scroll to bottom and manual tool parsing fallback
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        // Fallback for free OpenRouter models that output raw text instead of native tool calls
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && !isLoading) {
            if (lastMsg.content.includes('searchProducts')) {
                const searchParams = new URLSearchParams();

                const qMatch = lastMsg.content.match(/"query"\s*:\s*"([^"]+)"/);
                if (qMatch && qMatch[1]) searchParams.set('search', qMatch[1]);

                const cMatch = lastMsg.content.match(/"color"\s*:\s*"([^"]+)"/);
                if (cMatch && cMatch[1]) searchParams.set('color', cMatch[1]);

                const gMatch = lastMsg.content.match(/"gsm"\s*:\s*"([^"]+)"/);
                if (gMatch && gMatch[1]) searchParams.set('gsm', gMatch[1]);

                const pMatch = lastMsg.content.match(/"maxPrice"\s*:\s*(\d+)/);
                if (pMatch && pMatch[1]) searchParams.set('maxPrice', pMatch[1]);

                if (searchParams.toString()) {
                    router.push(`/shop?${searchParams.toString()}`);
                }
            } else if (lastMsg.content.includes('navigateTo')) {
                const match = lastMsg.content.match(/"route"\s*:\s*"([^"]+)"/);
                if (match && match[1]) {
                    router.push(match[1]);
                }
            }
        }
    }, [messages, isLoading, router]);

    return (
        <div ref={popupRef} className="fixed bottom-10 right-12 z-50 font-sans">
            {/* Assistant Button */}
            {!isOpen && (
                <button
                    onClick={toggleAssistant}
                    className="transition-all hover:scale-105 active:scale-95 flex items-center justify-center group relative drop-shadow-xl"
                >
                    <div className="relative w-16 h-16 group-hover:animate-pulse">
                        <Image src="/bot%20icon.png" alt="Assistant" fill className="object-contain" />
                    </div>
                    {/* Notification Message Icon */}
                    <div className="absolute top-0 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-[1px] rounded-2xl rounded-bl-none shadow-sm border border-transparent flex items-center justify-center animate-bounce">
                        Hi!
                    </div>
                </button>
            )}

            {/* Popup Container */}
            {isOpen && (
                <div className="bg-[#FDFBF7] w-80 sm:w-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE0D5] flex flex-col overflow-hidden transform transition-all duration-300 origin-bottom-right">

                    <div className="bg-[#2C241B] text-white p-4 flex justify-between items-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/denim_plaid_texture.png')" }}>
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-20" style={{ background: "radial-gradient(circle at 5px 0, transparent 5px, white 6px) repeat-x", backgroundSize: "10px 10px" }}></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative w-10 h-10 flex items-center justify-center drop-shadow-lg">
                                <div className="relative w-full h-full">
                                    <Image src="/bot%20icon.png" alt="Assistant Bot" fill className="object-contain scale-125" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-serif tracking-wide text-sm font-medium">Anantin Concierge</h3>
                                <p className="text-[10px] text-[#A89F8D] uppercase tracking-widest mt-0.5">Always here to help</p>
                            </div>
                        </div>
                        <button onClick={toggleAssistant} className="text-[#A89F8D] hover:text-white transition-colors relative z-10">
                            <XIcon size={18} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={chatContainerRef} className="h-80 p-4 overflow-y-auto no-scrollbar flex flex-col gap-4 bg-[url('/denim_plaid_texture.png')] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(253, 251, 247, 0.95), rgba(253, 251, 247, 0.95)), url('/denim_plaid_texture.png')" }}>
                        {/* Welcome Message */}
                        <div className="flex gap-2 w-5/6">
                            <div className="bg-white border border-[#EAE0D5] text-[#2C241B] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm leading-relaxed">
                                <p>Hello! Welcome to Anantin.</p>
                                <p className="mt-1">I'm your bespoke styling assistant. How can I help you find the perfect fabric today?</p>
                            </div>
                        </div>

                        {/* Render Messages */}
                        {messages.map((m) => {
                            // Strip raw AI reasoning artifacts like `thought <channel|>` or `<tool_call|>`
                            const cleanedContent = m.content
                                ? m.content
                                    .replace(/thought\s*<channel\|>[\s\S]*?(?:<\/channel\|>|$)/gi, '')
                                    .replace(/<channel\|>/gi, '')
                                    .replace(/<tool_call\|>[\s\S]*?(?:<\/tool_call\|>|$)/gi, '')
                                    .replace(/<tool_call>[\s\S]*?(?:<\/tool_call>|$)/gi, '')
                                    .replace(/<[^>]+>/g, '')
                                    .trim()
                                : '';

                            // Check for raw tool calls
                            const hasRawSearch = m.content?.includes('searchProducts');
                            const hasRawNavigate = m.content?.includes('navigateTo');

                            if (!cleanedContent && (!m.toolInvocations || m.toolInvocations.length === 0) && !hasRawSearch && !hasRawNavigate) {
                                return null;
                            }

                            // Check for restricted access message
                            const isRestricted = cleanedContent.includes('RESTRICTED ACCESS: PERMISSION DENIED');

                            return (
                                <div key={m.id} className={`flex gap-2 w-5/6 ${m.role === 'user' ? 'ml-auto justify-end' : ''}`}>
                                    <div className={`p-3 rounded-2xl text-xs shadow-sm leading-relaxed ${m.role === 'user'
                                            ? 'bg-[#2C241B] text-white rounded-tr-sm'
                                            : isRestricted
                                                ? 'bg-red-50 border border-red-200 text-red-600 rounded-tl-sm font-bold'
                                                : 'bg-white border border-[#EAE0D5] text-[#2C241B] rounded-tl-sm'
                                        }`}>
                                        {cleanedContent}
                                        {/* Handle tool invocations visually if needed */}
                                        {m.toolInvocations?.map(toolInvocation => (
                                            <div key={toolInvocation.toolCallId} className="text-[10px] italic text-[#A89F8D] mt-1 font-normal">
                                                {toolInvocation.toolName === 'navigateTo' && 'Navigating...'}
                                                {toolInvocation.toolName === 'searchProducts' && 'Filtering shop...'}
                                            </div>
                                        ))}
                                        {/* Handle raw tool invocations from free models */}
                                        {(!m.toolInvocations || m.toolInvocations.length === 0) && (
                                            <div className="text-[10px] italic text-[#A89F8D] mt-1 font-normal">
                                                {hasRawNavigate && 'Navigating...'}
                                                {hasRawSearch && 'Filtering shop...'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex gap-2 w-5/6">
                                <div className="bg-white border border-[#EAE0D5] text-[#A89F8D] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm animate-pulse">
                                    Concierge is typing...
                                </div>
                            </div>
                        )}

                        {/* Sample Suggestion Chips - Only show if no messages */}
                        {messages.length === 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => append({ role: 'user', content: 'Find Silk Fabrics' })}
                                    className="bg-white border border-[#D0C8B8] text-[#7A6B52] px-3 py-1.5 rounded-full text-[10px] font-medium hover:border-[#8b795a] hover:text-[#2C241B] transition-colors shadow-sm"
                                >
                                    Find Silk Fabrics
                                </button>
                                <button
                                    onClick={() => append({ role: 'user', content: 'Take me to my recent orders' })}
                                    className="bg-white border border-[#D0C8B8] text-[#7A6B52] px-3 py-1.5 rounded-full text-[10px] font-medium hover:border-[#8b795a] hover:text-[#2C241B] transition-colors shadow-sm"
                                >
                                    Track My Order
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#EAE0D5] flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            className="flex-1 bg-[#FDFBF7] border border-[#EAE0D5] rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#8b795a] text-[#2C241B] placeholder-[#A89F8D]"
                        />
                        <button
                            type="submit"
                            disabled={!input?.trim() || isLoading}
                            className="bg-[#2C241B] text-white p-2.5 rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:hover:bg-[#2C241B]"
                        >
                            <SendIcon size={16} />
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
}
