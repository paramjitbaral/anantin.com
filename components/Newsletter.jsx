'use client'
import React, { useState, useEffect } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [isRegistered, setIsRegistered] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Drag Physics State
    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)
    const [pullDistance, setPullDistance] = useState(0)

    useEffect(() => setMounted(true), [])

    // Drag Logic
    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e) => {
            const currentY = e.clientY || (e.touches && e.touches[0].clientY)
            if (currentY) {
                const delta = currentY - startY
                if (delta > 0) {
                    setPullDistance(Math.min(delta * 0.5, 120)) // 0.5 is the resistance factor
                } else if (delta < 0) {
                    setPullDistance(Math.max(delta * 0.5, -40)) // allow slight push up
                }
            }
        }

        const handleUp = () => {
            setIsDragging(false)
            setPullDistance(0) // snaps back instantly if no transition, or smoothly if transition is on
        }

        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleUp)
        window.addEventListener('touchmove', handleMove)
        window.addEventListener('touchend', handleUp)

        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('touchmove', handleMove)
            window.removeEventListener('touchend', handleUp)
        }
    }, [isDragging, startY])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setStartY(e.clientY || (e.touches && e.touches[0].clientY))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email) {
            toast.success('Your tag has been registered.')
            setEmail('')
            setIsRegistered(true)
        }
    }

    if (!mounted) return null;

    return (
        <div className='w-full overflow-hidden flex flex-col items-center justify-start min-h-[500px] sm:min-h-[600px] relative select-none py-12 sm:py-16 border-y border-[#EAE0D5] bg-[#F4EFE6]'>

            {/* Background Fabric Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/newsletter_fabric.png"
                    alt="Fabric Background"
                    fill
                    className="object-cover object-center opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#F4EFE6] via-transparent to-[#F4EFE6] opacity-100" />
                <div className="absolute inset-0 bg-[#F4EFE6]/40" />
            </div>

            {/* Inject Custom Swing Animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes swing {
                    0% { transform: rotate(2deg); }
                    50% { transform: rotate(-2deg); }
                    100% { transform: rotate(2deg); }
                }
                .animate-swing {
                    animation: swing 8s ease-in-out infinite;
                    transform-origin: top center;
                }
                .tag-clip {
                    clip-path: polygon(20% 0%, 80% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%);
                }
            `}} />

            {/* Background Title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif italic text-[#2C241B] opacity-[0.18] whitespace-nowrap pointer-events-none select-none z-10 mix-blend-multiply">
                Exclusive
            </div>

            {/* The String */}
            <div
                className={`w-[2px] bg-[#D4B26F] opacity-60 z-10 relative ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' : ''}`}
                style={{
                    height: `calc(4rem + ${Math.max(0, pullDistance)}px)`, // 4rem is ~h-16
                    boxShadow: '2px 0px 4px rgba(0,0,0,0.1)'
                }}
            >
                {/* Knot */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-3 bg-[#D4B26F] rounded-full opacity-80" />
            </div>

            {/* The Hanging Tag */}
            <div className={`animate-swing relative z-20 ${!isDragging ? 'hover:[animation-play-state:paused]' : '[animation-play-state:paused]'}`}>

                {/* Wrapper for physics (Drag Stretch & Pull) */}
                <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className={`relative w-[260px] sm:w-[320px] h-[380px] sm:h-[440px] group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${!isDragging ? 'transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105' : ''}`}
                    style={{
                        transform: `translateY(${Math.min(0, pullDistance)}px) scaleY(${1 + (Math.max(0, pullDistance) / 2500)})`,
                    }}
                >

                    {/* Tag Shadow */}
                    <div className={`absolute inset-0 bg-black/10 blur-xl tag-clip ${!isDragging ? 'transition-all duration-500 ease-out' : ''}`} style={{ transform: `translateY(${24 + pullDistance * 0.1}px)` }} />

                    {/* Actual Tag */}
                    <div className="absolute inset-0 bg-[#FAF8F5] tag-clip border border-[#EAE0D5] flex flex-col items-center p-5 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">

                        {/* The Metal Hole */}
                        <div className="w-6 h-6 rounded-full border-[3px] border-[#D4B26F] bg-[#F4EFE6] shadow-inner absolute top-5 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-black/10 shadow-inner" />
                        </div>

                        {/* Dynamic Tag Content */}
                        {isRegistered ? (

                            // REGISTERED STATE (Authentic Garment Certificate)
                            <div className="w-full flex-1 flex flex-col items-center justify-start mt-8 border border-[#EAE0D5] bg-[#FAF8F5] p-5 sm:p-6 relative overflow-hidden shadow-sm">
                                {/* Inner dashed border */}
                                <div className="absolute inset-1.5 border border-dashed border-[#EAE0D5]/80 pointer-events-none" />

                                {/* Faint Stamp Watermark */}
                                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-[3px] border-[#2C241B] opacity-[0.04] flex items-center justify-center pointer-events-none -rotate-12 select-none">
                                    <span className="font-serif italic text-2xl font-bold tracking-widest text-[#2C241B]">REGISTERED</span>
                                </div>

                                {/* Header */}
                                <h3 className="font-serif italic text-2xl text-[#2C241B] mt-2 mb-1 text-center relative z-10">
                                    Priority Access
                                </h3>
                                <p className="text-[7px] text-[#8C8A85] text-center uppercase tracking-[0.4em] mb-4 relative z-10 border-b border-[#EAE0D5] pb-3 w-full">
                                    You are on the list
                                </p>

                                {/* Grid / Specs */}
                                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3 mt-2 mb-4 relative z-10 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-[6px] text-[#8C8A85] uppercase tracking-widest mb-0.5">Status</span>
                                        <span className="text-[9px] font-mono text-[#D4B26F] font-bold">ACTIVE</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[6px] text-[#8C8A85] uppercase tracking-widest mb-0.5">Alerts</span>
                                        <span className="text-[9px] font-mono text-[#2C241B]">NEW RELEASES</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[6px] text-[#8C8A85] uppercase tracking-widest mb-0.5">Member</span>
                                        <span className="text-[9px] font-mono text-[#2C241B]">GUEST</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[6px] text-[#8C8A85] uppercase tracking-widest mb-0.5">Date</span>
                                        <span className="text-[9px] font-mono text-[#2C241B]">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Signature */}
                                <div className="w-full flex flex-col items-center justify-center my-4 relative z-10">
                                    <div className="font-serif italic text-4xl text-[#2C241B]/70 -rotate-3 tracking-tighter pr-4">
                                        Anantin
                                    </div>
                                    <div className="w-16 border-b border-[#2C241B]/30 mt-1" />
                                    <span className="text-[5px] text-[#8C8A85] uppercase tracking-[0.3em] mt-1.5">Notifications Activated</span>
                                </div>

                                {/* Dark Barcode */}
                                <div className="mt-auto pt-3 w-full flex flex-col items-center opacity-70 relative z-10 border-t border-[#EAE0D5]">
                                    <div className="flex gap-1 h-8 items-end justify-center w-full mt-1.5">
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-1.5 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                        <div className="w-2 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                        <div className="w-1.5 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-1 h-8 bg-[#2C241B]" />
                                        <div className="w-2 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                    </div>
                                    <div className="w-full mt-2 flex items-center justify-between px-2">
                                        <span className="text-[7px] font-mono tracking-[0.3em] text-[#2C241B]">REF.</span>
                                        <span className="text-[7px] font-mono tracking-[0.3em] text-[#2C241B]">A-001</span>
                                    </div>
                                </div>
                            </div>

                        ) : (

                            // UNREGISTERED (FORM) STATE
                            <div className="w-full flex-1 flex flex-col items-center justify-start mt-10 border-2 border-dashed border-[#EAE0D5] p-5 sm:p-6 relative">

                                <div className="absolute -top-3 bg-[#FAF8F5] px-3 text-[9px] tracking-[0.4em] font-bold text-[#D4B26F] uppercase">
                                    Item 01
                                </div>

                                <h3 className="font-serif italic text-3xl sm:text-4xl text-[#2C241B] mt-4 mb-3 text-center leading-tight pointer-events-none">
                                    The <br />Journal
                                </h3>
                                <p className="text-[9px] sm:text-[10px] text-[#8C8A85] text-center mb-8 leading-relaxed uppercase tracking-widest max-w-[160px] pointer-events-none">
                                    Curated fabric releases & design stories
                                </p>

                                <form onSubmit={handleSubmit} className="w-full relative flex flex-col items-center gap-5">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        placeholder="Enter email address"
                                        className="w-full bg-transparent border-b border-[#2C241B] outline-none py-1.5 text-center text-xs sm:text-sm text-[#2C241B] font-medium placeholder-[#8C8A85]/50 transition-colors focus:border-[#D4B26F] group-hover:border-[#D4B26F]"
                                    />
                                    <button
                                        type="submit"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        className={`w-full py-2.5 sm:py-3 bg-[#2C241B] text-[#FAF8F5] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-[#D4B26F] hover:shadow-[0_10px_20px_rgba(212,178,111,0.3)]`}
                                    >
                                        Register Tag
                                    </button>
                                </form>

                                {/* Barcode Decoration */}
                                <div className="mt-auto pt-6 w-full flex flex-col items-center opacity-60 pointer-events-none">
                                    <div className="flex gap-1 h-8 items-end justify-center w-full">
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-1.5 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                        <div className="w-2 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                        <div className="w-1 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-0.5 h-8 bg-[#2C241B]" />
                                        <div className="w-2 h-8 bg-[#2C241B]" />
                                        <div className="w-[1px] h-8 bg-[#2C241B]" />
                                    </div>
                                    <span className="text-[7px] font-mono tracking-[0.4em] text-[#2C241B] mt-2 ml-1">
                                        00247-INNER
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Newsletter