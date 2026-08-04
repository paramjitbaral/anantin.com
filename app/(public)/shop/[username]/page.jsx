'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, Store } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { getStoreByUsername } from "@/actions/supplier"

export default function StoreShop() {

    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStoreData = async () => {
        const store = await getStoreByUsername(username)
        if (store) {
            setStoreInfo(store)
            setProducts(store.Product || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStoreData()
    }, [username])

    return !loading ? (
        <div className="min-h-screen bg-[#FDFBF7] pb-24 relative overflow-hidden font-sans">
            
            {/* Subtle Background Texture for the whole page */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("/newsletter_fabric.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />

            {/* Hero Header Section - Horizontal Royal Fabric */}
            {storeInfo && (
                <div className="w-full relative bg-[#1E1914] py-8 sm:py-12 flex flex-col justify-center overflow-hidden border-b-[4px] border-[#D4B26F]">
                    
                    {/* Rich Fabric Background */}
                    <Image 
                        src="/swirling_fabrics.png" 
                        fill 
                        className="object-cover opacity-50 mix-blend-screen pointer-events-none scale-105" 
                        alt="Fabric Background" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1E1914] via-[#1E1914]/80 to-[#1E1914]/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1914]/90 to-transparent sm:hidden" />

                    {/* Content (Horizontal Layout) */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center w-full max-w-6xl mx-auto px-4 sm:px-6 gap-6 sm:gap-10">
                        
                        {/* Avatar */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-[#D4B26F] shadow-[0_0_30px_rgba(212,178,111,0.25)] bg-[#FDFBF7] relative p-1 group flex-shrink-0">
                            <Image
                                src={((storeInfo.logo?.startsWith('http') || storeInfo.logo?.startsWith('/')) ? storeInfo.logo : `/${storeInfo.logo || 'shop icon.png'}`).replace(/ /g, '%20')}
                                alt={storeInfo.name}
                                fill
                                className={`object-contain transition-transform duration-700 group-hover:scale-105 rounded-full ${!storeInfo.logo && "mix-blend-multiply"}`}
                            />
                            {/* Inner ring */}
                            <div className="absolute inset-0 rounded-full border border-[#D4B26F]/40 pointer-events-none" />
                        </div>

                        {/* Store Info */}
                        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-2 sm:mb-3">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#FDFBF7] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    {storeInfo.name}
                                </h1>
                                <p className="text-[10px] sm:text-xs font-semibold text-[#D4B26F] uppercase tracking-[0.25em] drop-shadow-md pb-1.5">
                                    @{username}
                                </p>
                            </div>
                            
                            <p className="text-sm sm:text-base text-[#D3C9BD] max-w-3xl leading-relaxed mb-5 font-serif italic drop-shadow-md line-clamp-3 sm:line-clamp-none">
                                "{storeInfo.description}"
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <div className="flex items-center gap-2 border border-[#D4B26F]/40 bg-[#1E1914]/40 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-lg text-[#FDFBF7] hover:bg-[#D4B26F]/10 transition-colors">
                                    <MapPinIcon className="w-3.5 h-3.5 text-[#D4B26F]" />
                                    <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest">{storeInfo.address}</span>
                                </div>
                                <div className="flex items-center gap-2 border border-[#D4B26F]/40 bg-[#1E1914]/40 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-lg text-[#FDFBF7] hover:bg-[#D4B26F]/10 transition-colors">
                                    <MailIcon className="w-3.5 h-3.5 text-[#D4B26F]" />
                                    <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest">{storeInfo.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="relative z-10 max-w-6xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6">
                <div className="flex items-center justify-center mb-12">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#8b6b3d]/40" />
                    <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#2C241B] flex items-center gap-3 px-6 tracking-wide">
                        <Store className="text-[#D4B26F]" size={28} />
                        The Collection
                    </h2>
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#8b6b3d]/40" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    ) : <Loading />
}