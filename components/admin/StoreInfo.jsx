'use client'
import Image from "next/image"
import { MapPin, Mail, Phone, ExternalLink, Calendar, User } from "lucide-react"
import toast from "react-hot-toast"

const StoreInfo = ({ store, toggleIsActive }) => {
    return (
        <div className="flex flex-col h-full bg-white relative">
            
            {/* Professional Header Section */}
            <div className="p-6 border-b border-[#EAE5DB] bg-[#FDFBF7] flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* Structured Logo Box */}
                    <div className="w-12 h-12 bg-white rounded-lg border border-[#EAE5DB] p-1.5 flex items-center justify-center shadow-sm">
                        <div className="relative w-full h-full">
                            <Image 
                                fill 
                                src={store.logo || "/shop%20icon.png"} 
                                alt={store.name} 
                                className={`object-contain ${!store.logo && 'opacity-40'}`} 
                            />
                        </div>
                    </div>
                    
                    {/* Header Details */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-[#2C241B]">{store.name}</h3>
                            {/* Professional Badge */}
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                store.status === 'pending' ? 'bg-amber-100 text-amber-700' 
                                : store.status === 'rejected' ? 'bg-red-100 text-red-700' 
                                : 'bg-[#1f5c35]/10 text-[#1f5c35]'
                            }`}>
                                {store.status}
                            </span>
                        </div>
                        <div className="flex items-center text-[12px] text-[#8b795a] font-medium">
                            <span>@{store.username}</span>
                        </div>
                    </div>
                </div>

                {/* Professional Toggle Control */}
                {toggleIsActive && (
                    <div className="flex flex-col items-end justify-center h-full">
                        <label className="relative inline-flex items-center cursor-pointer group">
                            <input type="checkbox" className="sr-only peer" onChange={() => toggleIsActive(store.id)} checked={store.isActive} />
                            <div className="w-10 h-5 bg-[#EAE5DB] rounded-full peer peer-checked:bg-[#1f5c35] transition-colors duration-200"></div>
                            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                        </label>
                        <span className="text-[10px] font-semibold text-[#8b795a] uppercase tracking-wider mt-1.5">
                            {store.isActive ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                
                {/* Description */}
                <div className="mb-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#8b795a] mb-2">About Store</h4>
                    <p className="text-[13px] text-[#4A3F35] leading-relaxed">
                        {store.description}
                    </p>
                </div>

                {/* Structured Contact Info */}
                <div className="bg-[#FDFBF7] rounded-lg border border-[#EAE5DB] p-4 mb-6 flex flex-col gap-3">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#8b795a] mb-1">Contact Information</h4>
                    <div className="flex items-start gap-3">
                        <MapPin size={15} className="text-[#8b6b3d] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#2C241B]">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={15} className="text-[#8b6b3d] shrink-0" />
                        <span className="text-[13px] text-[#2C241B]">{store.contact}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail size={15} className="text-[#8b6b3d] shrink-0" />
                        <span className="text-[13px] text-[#2C241B]">{store.email}</span>
                    </div>
                </div>

                <div className="flex-grow"></div>

                {/* Structured Footer / Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-[#EAE5DB]">
                    
                    {/* Applicant details */}
                    <div className="flex items-center gap-2.5">
                        <User size={14} className="text-[#8b795a]" />
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-[#2C241B]">{store.user.name}</span>
                            <span className="text-[10px] bg-[#EAE5DB] text-[#4A3F35] px-1.5 py-0.5 rounded font-medium">Applicant</span>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[#8b795a]">
                        <Calendar size={13} />
                        <span className="text-[11px] font-medium">
                            {new Date(store.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StoreInfo