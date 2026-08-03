'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Coupon copied to clipboard!');
        navigator.clipboard.writeText('NEW20');
    };

    return isOpen && (
        <div className="w-full px-6 py-0.5 text-[#FDFBF7] text-[11px] font-medium relative flex items-center justify-center bg-cover bg-center border-b border-[#D0C8B8]" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/denim_plaid_texture.png')" }}>
            <div className="flex items-center gap-4 flex-wrap justify-center">
                <span className="tracking-wide">Get 20% OFF on Your First Order!</span>
                <button onClick={handleClaim} type="button" className="font-normal text-[10px] text-white bg-[#8C8A85] hover:bg-[#73706A] px-4 py-1 rounded-full max-sm:hidden transition inline-flex items-center justify-center leading-none mt-0.5 mb-0.5">
                    Claim Offer
                </button>
            </div>
            <button onClick={() => setIsOpen(false)} type="button" className="absolute right-6 p-1 text-[#8C8A85] hover:text-[#FAF8F5] transition duration-300 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="11" y2="11"></line>
                    <line x1="11" y1="1" x2="1" y2="11"></line>
                </svg>
            </button>
        </div>
    );
};