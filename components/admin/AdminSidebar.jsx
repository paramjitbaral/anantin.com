'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon  },
    ]
    return (
        <div className="inline-flex h-full flex-col gap-6 border-r border-[#EAE5DB] bg-white sm:min-w-64 relative z-40">
            <div className="flex flex-col gap-4 justify-center items-center pt-10 pb-4 max-sm:hidden border-b border-[#F0EBE1] mx-6">
                <div className="w-16 h-16 rounded-2xl shadow-sm border border-[#EAE5DB] bg-white flex items-center justify-center overflow-hidden relative">
                    <Image className="object-cover p-2" src={assets.gs_logo} alt="Profile" fill />
                </div>
                <div className="text-center">
                    <p className="font-serif font-bold text-lg text-[#2C241B]">Administrator</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#1f5c35] font-bold mt-1">HQ Management</p>
                </div>
            </div>

            <div className="max-sm:mt-6 px-4 flex flex-col gap-2">
                {sidebarLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link 
                            key={index} 
                            href={link.href} 
                            className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-[#1f5c35] text-white shadow-md' 
                                : 'text-[#8b795a] hover:bg-[#F0EBE1] hover:text-[#2C241B]'
                            }`}
                        >
                            <link.icon 
                                size={20} 
                                className={`sm:ml-2 ${isActive ? 'text-white' : 'text-[#8b795a] group-hover:text-[#8b6b3d]'}`} 
                            />
                            <p className={`max-sm:hidden font-medium text-sm tracking-wide ${isActive ? 'text-white' : ''}`}>
                                {link.name}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default AdminSidebar