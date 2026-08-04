'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

import ProductDescription from "./ProductDescription";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex max-lg:flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <div className="flex max-sm:flex-col-reverse gap-3">
                        <div className="flex sm:flex-col gap-3">
                            {product.images.map((image, index) => (
                                <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-white border border-[#EAE0D5] flex items-center justify-center size-24 rounded-lg overflow-hidden group cursor-pointer hover:border-[#8C8A85] transition relative">
                                    <Image src={image} className="w-full h-full object-cover group-hover:scale-105 group-active:scale-95 transition duration-300" alt="" width={100} height={100} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center items-center h-100 sm:size-113 bg-white border border-[#EAE0D5] rounded-lg overflow-hidden relative">
                            <Image src={mainImage} alt={product.name} width={500} height={500} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {/* Desktop Description sits right below the image */}
                    <div className="hidden lg:block max-w-113">
                        <ProductDescription product={product} />
                    </div>
                </div>
                <div className="flex-1 lg:pl-6">
                    <span className="text-xs uppercase tracking-widest text-[#8C8A85] font-semibold">{product.category}</span>
                    <h1 className="text-4xl font-light text-[#2C241B] mt-1 tracking-tight">{product.name}</h1>

                    <div className='flex items-center mt-3 gap-2'>
                        <div className='flex items-center'>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon key={index} size={14} className='text-transparent' fill={averageRating >= index + 1 ? "#2C241B" : "#D1D5DB"} />
                            ))}
                        </div>
                        <p className="text-xs ml-1 text-[#73706A] tracking-wider uppercase">{product.rating.length} Reviews</p>
                    </div>

                    <div className="flex items-baseline my-4 gap-4">
                        <div className="flex items-baseline">
                            <p className="text-3xl font-light text-[#2C241B]"> {currency}{product.price} </p>
                            <span className="text-xs text-[#8C8A85] ml-1.5 font-medium">/ meter</span>
                        </div>
                        <p className="text-lg text-[#8C8A85] line-through font-light">{currency}{product.mrp}</p>
                        <span className="ml-2 bg-[#EAE0D5] text-[#2C241B] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <TagIcon size={10} />
                            Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}%
                        </span>
                    </div>

                    {/* Fabric Specifications Grid */}
                    <div className="my-4 border border-[#EAE0D5] rounded-xl bg-white/50 backdrop-blur-sm overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-y divide-[#EAE0D5]">
                            {product.material && (
                                <div className="p-4 flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] font-medium">Material</span>
                                    <span className="text-sm font-semibold text-[#2C241B]">{product.material}</span>
                                </div>
                            )}
                            {product.gsm && (
                                <div className="p-4 flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] font-medium">Weight (GSM)</span>
                                    <span className="text-sm font-semibold text-[#2C241B]">{product.gsm} gsm</span>
                                </div>
                            )}
                            {product.width && (
                                <div className="p-4 flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] font-medium">Width</span>
                                    <span className="text-sm font-semibold text-[#2C241B]">{product.width}</span>
                                </div>
                            )}
                            {product.availableStock !== undefined && (
                                <div className="p-4 flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] font-medium">Available Stock</span>
                                    <span className="text-sm font-semibold text-[#2C241B]">{product.availableStock} Meters</span>
                                </div>
                            )}
                        </div>
                        {product.colors && product.colors.length > 0 && (
                            <div className="p-4 border-t border-[#EAE0D5] flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] font-medium">Available Colors</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white border border-[#EAE0D5] rounded-full text-xs text-[#2C241B] font-medium shadow-sm">{color}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mt-4 w-full">
                        {
                            cart[productId] && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs uppercase tracking-wider text-[#8C8A85] font-semibold">Quantity</span>
                                    <Counter productId={productId} />
                                </div>
                            )
                        }
                        <button onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} className="flex-1 bg-[#2C241B] text-white hover:bg-[#1E1914] text-xs uppercase tracking-widest py-4 px-10 font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-center">
                            {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                        </button>
                    </div>

                    <hr className="border-[#EAE0D5] my-4" />

                    {/* Premium Trust Badge Icons */}
                    <div className="grid grid-cols-3 gap-2 my-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <EarthIcon size={20} className="text-[#3182CE]" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C241B] leading-tight">Worldwide Shipping</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <CreditCardIcon size={20} className="text-[#5A6578]" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C241B] leading-tight">Secure Checkout</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <UserIcon size={20} className="text-[#D4B26F]" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C241B] leading-tight">
                                <span className="sm:hidden">Trusted<br />Brand</span>
                                <span className="hidden sm:inline">Trusted Brand</span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProductDetails