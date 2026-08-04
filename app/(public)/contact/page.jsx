import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col lg:flex-row selection:bg-[#D4B26F] selection:text-white">
            
            {/* Left Side - Fixed Visual & Info */}
            <div className="lg:w-[45%] lg:sticky lg:top-0 lg:h-screen relative flex flex-col justify-between p-12 lg:p-20 overflow-hidden border-r border-[#EAE0D5]">
                <div className="absolute inset-0">
                    <Image src="/light_silk_bg.png" alt="Silk Fabric" fill className="object-cover opacity-80" priority />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7]/80 to-[#FDFBF7]/30" />
                </div>
                
                <div className="relative z-10 mt-12 lg:mt-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#D4B26F]/30 text-[#8b795a] text-[10px] font-bold uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4B26F] animate-pulse" />
                        B2B Textile Platform
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif text-[#1E1914] leading-[1.1] mb-6">
                        Connect with our <br />
                        <span className="italic text-[#8b795a]">Global Network.</span>
                    </h1>
                    <p className="text-[#5A4F44] text-sm leading-relaxed max-w-sm">
                        Whether you are a premium mill looking to join the network, or a fashion house seeking bespoke sourcing solutions, our team is ready to assist.
                    </p>
                </div>

                <div className="relative z-10 mt-16 lg:mt-0 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-[#8b795a] uppercase tracking-widest mb-2 border-b border-[#D4B26F]/30 pb-2 inline-block">Surat Textile Hub</h3>
                        <p className="text-[#1E1914] text-sm mt-2">Ring Road, Textile Market<br />Surat, Gujarat 395002, India</p>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-[#8b795a] uppercase tracking-widest mb-2 border-b border-[#D4B26F]/30 pb-2 inline-block">Direct Inquiries</h3>
                        <p className="text-[#1E1914] text-sm mt-2 flex flex-col gap-1">
                            <a href="mailto:partners@anantin.com" className="hover:text-[#D4B26F] transition-colors">partners@anantin.com</a>
                            <a href="tel:+919876543210" className="hover:text-[#D4B26F] transition-colors">+91 98765 43210</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="lg:w-[55%] bg-white min-h-screen flex flex-col justify-center p-8 sm:p-16 lg:p-24">
                
                <div className="w-full max-w-xl">
                    <h2 className="text-2xl font-serif text-[#1E1914] mb-2">Send an Inquiry</h2>
                    <p className="text-[#8b795a] text-sm mb-10">Fill out the form below and we will get back to you shortly.</p>
                    
                    <form className="flex flex-col gap-8">
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#1E1914] uppercase tracking-wider">Full Name *</label>
                            <input type="text" className="w-full border-b border-[#EAE0D5] bg-transparent py-3 text-sm focus:outline-none focus:border-[#D4B26F] transition-colors text-[#1E1914] placeholder-gray-300" placeholder="Jane Doe" required />
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#1E1914] uppercase tracking-wider">Company *</label>
                                <input type="text" className="w-full border-b border-[#EAE0D5] bg-transparent py-3 text-sm focus:outline-none focus:border-[#D4B26F] transition-colors text-[#1E1914] placeholder-gray-300" placeholder="Your Brand" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#1E1914] uppercase tracking-wider">Role</label>
                                <select className="w-full border-b border-[#EAE0D5] bg-transparent py-3 text-sm focus:outline-none focus:border-[#D4B26F] transition-colors text-[#1E1914] appearance-none cursor-pointer">
                                    <option value="" disabled selected className="text-gray-300">Select Role</option>
                                    <option value="buyer">Buyer / Sourcing</option>
                                    <option value="mill">Textile Mill / Supplier</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#1E1914] uppercase tracking-wider">Business Email *</label>
                            <input type="email" className="w-full border-b border-[#EAE0D5] bg-transparent py-3 text-sm focus:outline-none focus:border-[#D4B26F] transition-colors text-[#1E1914] placeholder-gray-300" placeholder="jane@brand.com" required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#1E1914] uppercase tracking-wider">How can we help? *</label>
                            <textarea rows="5" className="w-full border-b border-[#EAE0D5] bg-transparent py-3 text-sm focus:outline-none focus:border-[#D4B26F] transition-colors text-[#1E1914] resize-none placeholder-gray-300" placeholder="Detail your sourcing requirements..." required></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="button" className="group inline-flex items-center justify-center gap-4 bg-[#1E1914] text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 hover:bg-[#D4B26F] transition-all w-full sm:w-auto">
                                Submit Request 
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    );
}
