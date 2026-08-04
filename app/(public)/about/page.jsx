import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#D4B26F] selection:text-[#1E1914]">
            
            {/* Act I: The Vision */}
            <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/b2b_hero.png" alt="Global Network" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-black/75" />
                </div>
                
                <div className="relative z-10 text-center px-6 mb-24">
                    <p className="text-[#D4B26F] uppercase tracking-[0.4em] text-xs font-semibold mb-6">Maison Anantin</p>
                    <h1 className="text-5xl md:text-8xl font-serif text-white font-light tracking-wide mb-8 leading-tight">
                        The Future of <br className="hidden md:block" /> B2B Commerce.
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                        A cinematic digital ecosystem connecting world-class suppliers with discerning retailers.
                    </p>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
                    <Mouse size={32} strokeWidth={1} className="text-[#D4B26F]" />
                </div>
            </div>

            {/* Act II: The Network */}
            <div className="relative w-full h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/b2b_partnership.png" alt="Partnership" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
                    <div className="max-w-xl">
                        <p className="text-[#D4B26F] uppercase tracking-[0.3em] text-xs font-semibold mb-4">I. The Network</p>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                            Curated excellence.
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-12">
                            We dismantle traditional barriers by curating a strictly vetted network of premium manufacturers. Every partnership forged on our platform is built on absolute trust, uncompromising quality, and mutual growth.
                        </p>
                        <div className="w-12 h-[1px] bg-[#D4B26F]" />
                    </div>
                </div>
            </div>

            {/* Act III: The Technology */}
            <div className="relative w-full h-screen flex items-center justify-end overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/b2b_technology.png" alt="Technology" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full flex justify-end text-right">
                    <div className="max-w-xl">
                        <p className="text-[#D4B26F] uppercase tracking-[0.3em] text-xs font-semibold mb-4">II. The Technology</p>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                            Frictionless scale.
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-12">
                            To trade on Anantin is to experience commerce stripped of friction. Seamlessly manage bulk orders, digital invoices, and secure multi-currency transactions through an interface designed to disappear.
                        </p>
                        <div className="w-12 h-[1px] bg-[#D4B26F] ml-auto" />
                    </div>
                </div>
            </div>

            {/* Act IV: The CTA */}
            <div className="w-full bg-[#FDFBF7] py-32 text-center px-6 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-[#D4B26F] flex items-center justify-center mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#D4B26F] animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif text-[#1E1914] mb-8 font-light">Join the Ecosystem.</h2>
                    <p className="text-[#5A4F44] mb-12 text-lg">Elevate your enterprise. Connect with the best.</p>
                    <Link href="/create-store" className="inline-flex items-center gap-4 text-[#D4B26F] text-sm font-bold uppercase tracking-[0.2em] pb-3 border-b border-[#D4B26F] hover:text-[#1E1914] hover:border-[#1E1914] transition-all">
                        Register as a Partner <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            
        </div>
    );
}
