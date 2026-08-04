'use client'
import { StarIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {

    const dispatch = useDispatch();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = Array.isArray(product.rating) && product.rating.length > 0
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0;

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({ productId: product.id }));
        toast.success('Added to cart!');
    };

    return (
        <Link href={`/product/${product.id}`} className=' group max-xl:mx-auto block'>
            <div className='bg-[#FDFBF7] h-40 sm:w-60 sm:h-68 rounded-lg overflow-hidden border border-[#EAE0D5] hover:border-[#8C8A85] transition relative group/image'>
                <Image fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" className='object-cover group-hover/image:scale-110 transition duration-300' src={product.images[0]} alt={product.name} />
                
                {/* Hover overlay with Quick Add button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button onClick={handleQuickAdd} className="flex items-center gap-2 bg-[#2C241B] text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 hover:bg-black hover:scale-105 active:scale-95 border border-[#4A4238]">
                        <ShoppingCartIcon size={14} />
                        Quick Add
                    </button>
                </div>
            </div>
            <div className='flex justify-between gap-3 text-sm text-[#2C241B] pt-2 max-w-60'>
                <div>
                    <p className="font-medium">{product.name}</p>
                    <div className='flex mt-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={12} className='text-transparent' fill={rating >= index + 1 ? "#D4B26F" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="font-semibold">{currency}{product.price}</p>
                    <p className="text-[10px] text-[#8C8A85] mt-0.5">per meter</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard