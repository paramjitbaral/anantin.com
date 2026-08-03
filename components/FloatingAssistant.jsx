'use client'
import React, { useState } from 'react';
import { MessageCircleIcon, XIcon, SendIcon } from 'lucide-react';
import Image from 'next/image';

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const toggleAssistant = () => setIsOpen(!isOpen);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Placeholder for sending message logic
            setMessage('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Assistant Button */}
            {!isOpen && (
                <button 
                    onClick={toggleAssistant} 
                    className="transition-all hover:scale-105 active:scale-95 flex items-center justify-center group relative"
                >
                    <div className="relative w-14 h-14 shadow-xl rounded-full group-hover:animate-pulse">
                        <Image src="/bot%20icon.png" alt="Assistant" fill className="object-contain" />
                    </div>
                    {/* Notification Dot */}
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#D4B26F] rounded-full border-2 border-[#FAF9F6]"></span>
                </button>
            )}

            {/* Popup Container */}
            {isOpen && (
                <div className="bg-[#FDFBF7] w-80 sm:w-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE0D5] flex flex-col overflow-hidden transform transition-all duration-300 origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-[#2C241B] text-white p-4 flex justify-between items-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/denim_plaid_texture.png')" }}>
                        <div className="absolute top-0 left-0 right-0 h-1 opacity-20" style={{ background: "radial-gradient(circle at 5px 0, transparent 5px, white 6px) repeat-x", backgroundSize: "10px 10px" }}></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <Image src="/bot%20icon.png" alt="Assistant Bot" fill className="object-contain" />
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
                    <div className="h-80 p-4 overflow-y-auto flex flex-col gap-4 bg-[url('/denim_plaid_texture.png')] bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(253, 251, 247, 0.95), rgba(253, 251, 247, 0.95)), url('/denim_plaid_texture.png')" }}>
                        {/* Welcome Message */}
                        <div className="flex gap-2 w-5/6">
                            <div className="bg-white border border-[#EAE0D5] text-[#2C241B] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm leading-relaxed">
                                <p>Hello! Welcome to Anantin.</p>
                                <p className="mt-1">I'm your bespoke styling assistant. How can I help you find the perfect fabric today?</p>
                            </div>
                        </div>
                        
                        {/* Sample Suggestion Chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            <button className="bg-white border border-[#D0C8B8] text-[#7A6B52] px-3 py-1.5 rounded-full text-[10px] font-medium hover:border-[#8b795a] hover:text-[#2C241B] transition-colors shadow-sm">
                                Find Silk Fabrics
                            </button>
                            <button className="bg-white border border-[#D0C8B8] text-[#7A6B52] px-3 py-1.5 rounded-full text-[10px] font-medium hover:border-[#8b795a] hover:text-[#2C241B] transition-colors shadow-sm">
                                Track My Order
                            </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EAE0D5] flex gap-2 items-center">
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-[#FDFBF7] border border-[#EAE0D5] rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#8b795a] text-[#2C241B] placeholder-[#A89F8D]"
                        />
                        <button 
                            type="submit" 
                            disabled={!message.trim()}
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
