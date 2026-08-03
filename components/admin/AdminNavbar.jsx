'use client'
import Link from "next/link"
import Image from "next/image"
import { BellIcon, LogOutIcon } from "lucide-react"

const AdminNavbar = () => {

    return (
        <div className="flex items-center justify-between px-8 lg:px-12 py-3 bg-[#1E1914] relative z-50 shadow-[0_5px_20px_rgba(0,0,0,0.3)]">
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <Image src="/newsletter_fabric.png" alt="Texture" fill className="object-cover mix-blend-multiply" />
            </div>

            <Link href="/" className="relative z-10 flex items-center">
                <div className="relative text-4xl font-semibold text-[#FDFBF7]">
                    <span className="text-[#a69d8b]">anan</span>tin<span className="text-[#D4B26F] text-5xl leading-none">.</span>
                    <p className="absolute text-[7.5px] font-bold uppercase top-2.5 -right-[42px] px-1.5 py-[1.5px] rounded-full flex items-center gap-2 text-[#2c3e50] bg-[#D4B26F] shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        ADMIN
                    </p>
                </div>
            </Link>
            <div className="relative z-10 flex items-center gap-6">
                <button className="relative p-2 text-[#b8b0a1] hover:text-[#EAE5DB] transition-colors rounded-full hover:bg-[#2C241B]">
                    <BellIcon size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1E1914]"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-6 border-l border-[#2C241B]">
                    <div className="flex flex-col text-right">
                        <span className="text-[12px] font-serif font-bold text-[#EAE5DB]">Admin Account</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B26F]">Active</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#2C241B] text-[#D4B26F] flex items-center justify-center font-serif font-bold border border-[#8b6b3d] shadow-sm">
                        A
                    </div>
                </div>

                <Link href="/" className="ml-2 p-2 text-[#b8b0a1] hover:text-[#D4B26F] transition-colors rounded-full hover:bg-[#2C241B]" title="Logout">
                    <LogOutIcon size={18} />
                </Link>
            </div>
        </div>
    )
}

export default AdminNavbar