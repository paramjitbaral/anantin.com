'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')

    return (
        <div className="mt-0 mb-18 text-sm text-[#73706A]">

            {/* Tabs */}
            <div className="flex border-b border-[#EAE0D5] mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] border-[#2C241B] text-[#2C241B] font-semibold' : 'text-[#8C8A85]'} px-3 py-2 font-medium transition`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl leading-relaxed">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-14">
                    {product.rating.map((item,index) => (
                        <div key={index} className="flex gap-5 mb-10">
                            {item.user.image && !item.user.image.includes('shop icon') ? (
                                <Image src={item.user.image} alt="" className="size-10 rounded-full" width={100} height={100} />
                            ) : (
                                <div className="size-10 rounded-full bg-[#2C241B] text-[#EAE5DB] flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {item.user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-[#2C241B] mb-1">{item.user.name}</p>
                                <div className="flex items-center mb-2" >
                                    {Array(5).fill('').map((_, index) => (
                                        <StarIcon key={index} size={16} className='text-transparent' fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                    ))}
                                </div>
                                <p className="text-sm max-w-lg mb-1">{item.review}</p>
                                <p className="font-light text-xs text-[#8C8A85]">{new Date(item.createdAt).toDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Store Page */}
            <div className="flex gap-3 mt-14">
                <Image src={((product.store?.logo?.startsWith('http') || product.store?.logo?.startsWith('/')) ? product.store.logo : `/${product.store?.logo || 'shop icon.png'}`).replace(/ /g, '%20')} alt="" className="size-11 rounded-full ring ring-[#EAE0D5]" width={100} height={100} />
                <div>
                    <p className="font-medium text-[#2C241B]">Product by {product.store.name}</p>
                    <Link href={`/shop/${product.store.username}`} className="flex items-center gap-1.5 text-[#8C8A85] hover:text-[#2C241B] transition font-semibold"> view store <ArrowRight size={14} /></Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription