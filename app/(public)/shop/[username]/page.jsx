'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, Store } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { dummyStoreData, productDummyData } from "@/assets/assets"

export default function StoreShop() {

    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStoreData = async () => {
        setStoreInfo(dummyStoreData)
        setProducts(productDummyData)
        setLoading(false)
    }

    useEffect(() => {
        fetchStoreData()
    }, [])

    return !loading ? (
        <div className="min-h-screen bg-[#F4EFE6] pb-24 relative overflow-hidden">
            
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'url("/newsletter_fabric.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />

            {/* Store Info Banner */}
            {storeInfo && (
                <div className="relative z-10 w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6">
                    <div className="relative rounded-sm border-[6px] border-[#1E1914] shadow-2xl p-0.5 bg-[#1E1914] flex flex-col md:flex-row">
                        {/* Gold Inner Trim */}
                        <div className="w-full h-full border-[2px] border-[#D4B26F] relative rounded-sm bg-[#F4EFE6] overflow-hidden flex flex-col md:flex-row">
                            
                            {/* Left Side: Store Visual Banner (Fabric) */}
                            <div className="relative w-full md:w-1/3 h-48 md:h-auto border-b md:border-b-0 md:border-r-2 border-dashed border-[#b8b0a1] bg-[#1E1914] flex items-center justify-center p-6 overflow-hidden">
                                <Image
                                    src="/swirling_fabrics.png"
                                    alt="Banner Background"
                                    fill
                                    className="object-cover opacity-60 scale-125 mix-blend-multiply pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1914]/80 to-transparent" />
                                
                                {/* Logo Badge */}
                                <div className="relative z-20 w-[120px] h-[120px] rounded-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                    <Image
                                        src={storeInfo.logo || "/shop icon.png"}
                                        alt={storeInfo.name}
                                        fill
                                        className={`object-contain ${!storeInfo.logo && "mix-blend-multiply"}`}
                                    />
                                </div>
                            </div>

                            {/* Right Side: Store Details (Canvas) */}
                            <div className="relative w-full md:w-2/3 h-full p-8 md:p-12 flex flex-col justify-center">
                                {/* Subtle Background Texture */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply">
                                    <Image src="/newsletter_fabric.png" alt="Texture" fill className="object-cover" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#8b6b3d]" style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #c5a059' }}>
                                            {storeInfo.name}
                                        </h1>
                                    </div>
                                    <p className="text-[10px] font-serif font-bold text-[#2C241B] uppercase tracking-[0.2em] mb-6">
                                        @{username}
                                    </p>
                                    
                                    <p className="text-[14px] font-serif text-[#4A3F35] max-w-2xl leading-relaxed mb-8">
                                        {storeInfo.description}
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="flex items-center gap-2 bg-[#EAE5DB] border-[1.5px] border-[#bda27e] px-4 py-2 rounded shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                                            <MapPinIcon className="w-4 h-4 text-[#8b6b3d]" />
                                            <span className="text-[11px] font-serif font-semibold text-[#2C241B] uppercase tracking-wider">{storeInfo.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-[#EAE5DB] border-[1.5px] border-[#bda27e] px-4 py-2 rounded shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                                            <MailIcon className="w-4 h-4 text-[#8b6b3d]" />
                                            <span className="text-[11px] font-serif font-semibold text-[#2C241B] uppercase tracking-wider">{storeInfo.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="relative z-10 max-w-7xl mx-auto mt-16 px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-semibold text-[#8b6b3d] flex items-center gap-3">
                        <Store className="text-[#1E1914]" size={24} />
                        The Collection
                    </h2>
                    <div className="h-[2px] flex-grow mx-6 bg-gradient-to-r from-[#D4B26F]/50 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-8 justify-center sm:justify-start">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    ) : <Loading />
}