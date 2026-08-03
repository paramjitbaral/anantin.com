'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon, StoreIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({storeInfo}) => {
    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/store', icon: HomeIcon },
        { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
        { name: 'Manage Products', href: '/store/manage-product', icon: SquarePenIcon },
        { name: 'Orders', href: '/store/orders', icon: LayoutListIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-6 border-r border-[#EAE5DB] bg-white sm:min-w-64">
            <div className="flex flex-col gap-4 justify-center items-center pt-10 pb-4 max-sm:hidden border-b border-[#F0EBE1] mx-6">
                <div className="w-16 h-16 rounded-2xl shadow-sm border border-[#EAE5DB] bg-[#FDFBF7] flex items-center justify-center overflow-hidden relative">
                    {storeInfo?.logo ? (
                        <Image className="object-cover" src={storeInfo.logo} alt="" fill />
                    ) : (
                        <StoreIcon className="w-8 h-8 text-[#8b795a]" />
                    )}
                </div>
                <div className="text-center">
                    <p className="font-serif font-bold text-lg text-[#2C241B]">{storeInfo?.name || "My Store"}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#1f5c35] font-bold mt-1">Vendor Portal</p>
                </div>
            </div>

            <div className="max-sm:mt-6 px-4 flex flex-col gap-2">
                {sidebarLinks.map((link, index) => {
                    const isActive = pathname === link.href
                    return (
                        <Link 
                            key={index} 
                            href={link.href} 
                            className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-[#1f5c35] text-white shadow-md' 
                                : 'text-[#8b795a] hover:bg-[#FDFBF7] hover:text-[#2C241B]'
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

export default StoreSidebar