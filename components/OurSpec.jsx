import React, { useState } from 'react'
import { ourSpecsData } from '@/assets/assets'
import { Truck, PhoneCall, RadioTower } from 'lucide-react'
 
const OurSpecs = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className='px-6 my-28 max-w-6xl mx-auto'>
            <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-16 lg:gap-24 items-start">
                
                {/* Left Side: Philosophy Header */}
                <div className="flex flex-col lg:sticky lg:top-28">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B26F] font-bold">Our Philosophy</span>
                    <h2 className="text-4xl sm:text-5xl font-light text-[#2C241B] mt-4 tracking-tight leading-tight">
                        Crafted to <br />
                        <span className="font-serif italic text-[#8C8A85]">Perfection.</span>
                    </h2>
                    <p className="text-sm text-[#8C8A85] mt-6 leading-relaxed">
                        Uncompromising standards, seamless global operations, and dedicated support built for premium designers.
                    </p>
                </div>

                {/* Right Side: Vertically Stacked Expandable List */}
                <div className="w-full flex flex-col border-t border-[#EAE0D5]">
                    {
                        ourSpecsData.map((spec, index) => {
                            const isHovered = hoveredIndex === index;
                            const number = `0${index + 1}`;
                            const bgTheme = [
                                "bg-[#D4B26F]/4",
                                "bg-[#5A6578]/4",
                                "bg-[#738266]/4"
                            ][index];

                            const watermarkText = [
                                "FREE",
                                "",
                                "24/7"
                            ][index];

                            return (
                                <div
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`flex flex-col justify-center px-4 border-b border-[#EAE0D5] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden group ${
                                        isHovered 
                                            ? `${bgTheme} h-[115px] sm:h-[125px] py-4 rounded-xl` 
                                            : 'bg-transparent h-[75px] sm:h-[85px] py-3'
                                    }`}
                                >
                                    {/* Decorative faint background text */}
                                    {watermarkText && (
                                        <div className="absolute right-4 -bottom-6 text-7xl font-serif font-bold text-[#2C241B]/3 pointer-events-none select-none uppercase tracking-widest hidden sm:block">
                                            {watermarkText}
                                        </div>
                                    )}
 
                                        <div className="flex gap-6 sm:gap-8 items-center relative z-10 w-full min-w-0">
                                            {/* Dynamic Interactive Icon Wrapper */}
                                        <div className="flex-shrink-0 w-6 h-6 relative flex items-center justify-center">
                                            {index === 0 ? (
                                                /* Dummy spacer to maintain layout spacing */
                                                <div className="w-6 h-6" />
                                            ) : index === 1 ? (
                                                <div className="relative w-6 h-6 flex items-center justify-center">
                                                    {/* Zoomed Background Watermark behind the logo */}
                                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[1200ms] ease-out pointer-events-none z-0 ${
                                                        isHovered ? 'w-[160px] h-[160px] opacity-[0.05] text-[#2C241B]' : 'w-6 h-6 opacity-0 text-[#8C8A85]'
                                                    }`}>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M12 6V2M12 22v-4M4 12H2M22 12h-4" className="opacity-30" />
                                                        </svg>
                                                    </div>
                                                    
                                                    {/* Small Golden Spinning Clock */}
                                                    <svg 
                                                        className={`relative z-10 w-6 h-6 transition-all duration-[1200ms] ease-out ${isHovered ? 'text-[#D4B26F] scale-125' : 'text-[#8C8A85] scale-100'}`} 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth={1.5} 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M12 6V2M12 22v-4M4 12H2M22 12h-4" className="opacity-30" />
                                                        <line x1="12" y1="12" x2="15.5" y2="12" className={`origin-center ${isHovered ? 'animate-[spin_3s_linear_infinite]' : 'transition-transform duration-500 rotate-0'}`} />
                                                        <line x1="12" y1="12" x2="12" y2="7" className={`origin-center ${isHovered ? 'animate-[spin_0.8s_linear_infinite]' : 'transition-transform duration-500 rotate-0'}`} />
                                                    </svg>
                                                </div>
                                            ) : index === 2 ? (
                                                <div className="relative w-6 h-6 flex items-center justify-center">
                                                    {/* Default Phone Icon (Rings for 0.5s then fades out) */}
                                                    <PhoneCall 
                                                        className={`w-full h-full transition-all duration-500 ease-out ${isHovered ? 'opacity-0 scale-50 delay-500 text-[#D4B26F] animate-ring' : 'opacity-100 scale-100 delay-0 text-[#8C8A85]'}`} 
                                                        strokeWidth={1.5} 
                                                    />
                                                </div>
                                            ) : (
                                                <spec.icon 
                                                    className={`transition-all duration-300 ${
                                                        isHovered ? 'text-[#D4B26F] animate-bounce' : 'text-[#8C8A85]'
                                                    }`} 
                                                    size={24} 
                                                    strokeWidth={1.5} 
                                                />
                                            )}
                                        </div>

                                        {/* Absolute Moving Truck (rendered only for shipping) */}
                                        {index === 0 && (
                                            <Truck 
                                                className={`absolute ${
                                                    isHovered 
                                                        ? 'animate-slide-once' 
                                                        : 'top-1/2 -translate-y-1/2 left-0 text-[#8C8A85] transition-colors duration-300'
                                                }`} 
                                                size={24} 
                                                strokeWidth={1.5} 
                                            />
                                        )}

                                        {/* Absolute Full-Width Phones (rendered only for Customer Support) */}
                                        {index === 2 && (
                                            <div className={`absolute inset-0 left-0 right-10 flex items-center justify-between transition-all duration-500 ease-out pointer-events-none z-0 ${isHovered ? 'opacity-100 scale-100 delay-500' : 'opacity-0 scale-95 delay-0'}`}>
                                                {/* Left Tower */}
                                                <div className="flex items-center gap-1">
                                                    <RadioTower size={28} className="text-[#D4B26F] shrink-0" strokeWidth={1.5} />
                                                </div>
                                                
                                                {/* Connecting String (Signals meeting in middle) */}
                                                <div className="flex-1 -mx-[14px] h-full relative z-0">
                                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="text-[#D4B26F] overflow-visible opacity-25">
                                                        {/* Base curves (draws from towers to center) */}
                                                        <path d="M 0 47 Q 25 -10 50 -10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ strokeDasharray: 100, strokeDashoffset: isHovered ? 0 : 100, transition: "stroke-dashoffset 0.8s ease-out 0.5s" }} />
                                                        <path d="M 100 47 Q 75 -10 50 -10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ strokeDasharray: 100, strokeDashoffset: isHovered ? 0 : 100, transition: "stroke-dashoffset 0.8s ease-out 0.5s" }} />
                                                        
                                                        {/* Signals and Glow (delayed until base curves connect) */}
                                                        <g className={`transition-opacity duration-300 ${isHovered ? 'opacity-100 delay-[1300ms]' : 'opacity-0 delay-0'}`}>
                                                            <path d="M 0 47 Q 25 -10 50 -10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className={isHovered ? "animate-string-signal" : ""} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                                            <path d="M 100 47 Q 75 -10 50 -10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className={isHovered ? "animate-string-signal" : ""} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                                            <circle cx="50" cy="-10" r="1.5" fill="currentColor" className={`opacity-80 ${isHovered ? "animate-ping" : ""}`} vectorEffect="non-scaling-stroke" />
                                                        </g>
                                                    </svg>
                                                    
                                                    {/* Central Phone Icon (pops in when signals connect) */}
                                                    <div className={`absolute left-1/2 -translate-x-1/2 -top-[10%] -translate-y-1/2 flex items-center justify-center transition-all duration-300 bg-[#FAF8F5] rounded-full px-1 ${isHovered ? 'opacity-100 scale-100 delay-[1300ms]' : 'opacity-0 scale-50 delay-0'}`}>
                                                        <PhoneCall size={16} className={`text-[#D4B26F] ${isHovered ? "animate-ring" : ""}`} strokeWidth={1.5} />
                                                    </div>
                                                </div>
                                                
                                                {/* Right Tower */}
                                                <div className="flex items-center gap-1">
                                                    <RadioTower size={28} className="text-[#D4B26F] shrink-0" strokeWidth={1.5} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Title, Tag, and Bio Text Column */}
                                        <div className={`flex flex-col flex-1 min-w-0 pr-4 transition-transform duration-500 ${isHovered && index === 2 ? 'translate-y-2' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-semibold text-[#2C241B] tracking-tight flex-shrink-0">
                                                    {spec.title}
                                                </h3>
                                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#8C8A85]/80 font-bold truncate">
                                                    — {index === 0 ? "Complimentary" : index === 1 ? "Flexible" : "Dedicated"}
                                                </span>
                                            </div>
                                            
                                            {/* Description (Equalized heights: 1 line collapsed, 2 lines expanded) */}
                                            <div className={`transition-all duration-300 overflow-hidden ${
                                                isHovered ? 'h-[44px] sm:h-[48px] mt-1.5' : 'h-[18px] sm:h-[20px] mt-1'
                                            }`}>
                                                <p className={`text-xs sm:text-sm text-[#8C8A85] leading-relaxed transition-all duration-500 max-w-sm sm:max-w-md md:max-w-lg ${
                                                    isHovered ? 'whitespace-normal opacity-100' : 'truncate opacity-60'
                                                }`}>
                                                    {spec.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expand indicator chevron on far right */}
                                        <div className="ml-auto flex-shrink-0 pr-2">
                                            <svg className={`w-4 h-4 text-[#8C8A85] transition-all duration-500 ${isHovered ? 'rotate-180 text-[#D4B26F]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default OurSpecs