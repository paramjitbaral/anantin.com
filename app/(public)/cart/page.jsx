'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen bg-[#FDFBF7] pt-10 pb-32 font-sans relative">

            {/* Subtle background texture pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')", backgroundSize: '400px' }}></div>

            <div className="max-w-6xl mx-auto px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Left Side: Fabric Swatches (Cart Items) */}
                    <div className="w-full lg:flex-1 flex flex-col gap-6">

                        {/* Heading */}
                        <div className="flex flex-col items-start mb-1">
                            <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#8b795a] mb-2">Curated For You</p>
                            <h1 className="text-xl md:text-3xl font-sans font-extrabold uppercase tracking-[0.15em] bg-clip-text text-transparent bg-cover bg-center leading-tight py-2" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}>
                                Shopping Bag
                            </h1>
                        </div>

                        <div className="flex flex-col gap-4">
                            {cartArray.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-4 bg-white p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">

                                    {/* Fabric Edge Accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>

                                    <div className="relative w-20 h-28 bg-[#F5F2EA] flex-shrink-0 shadow-inner ml-1">
                                        <Image src={item.images[0]} fill className="object-cover" alt={item.name} />
                                    </div>

                                    <div className="flex-1 flex flex-col py-1 pr-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[7px] font-bold text-[#A89F8D] uppercase tracking-[0.2em] mb-1">Swatch No. {item.id.substring(0, 6).toUpperCase()}</p>
                                                <h3 className="font-serif text-lg text-[#2C241B] leading-tight pr-6">{item.name}</h3>
                                            </div>
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-[#A89F8D] hover:text-[#8b795a] transition-colors p-1">
                                                <XIcon size={14} />
                                            </button>
                                        </div>

                                        <div className="mt-auto flex justify-between items-end border-t border-dashed border-[#EAE5DB] pt-2.5">
                                            <div>
                                                <p className="text-[8px] text-[#8b795a] uppercase tracking-widest font-bold mb-1">Meters</p>
                                                <div className="scale-75 origin-left -ml-2 -mt-1">
                                                    <Counter productId={item.id} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] text-[#8b795a] uppercase tracking-widest font-bold mb-1">Price</p>
                                                <span className="text-base font-serif text-[#2C241B]">{currency}{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full lg:w-[380px] lg:sticky lg:top-24">
                        <OrderSummary totalPrice={totalPrice} items={cartArray} />
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] bg-[#FDFBF7] flex flex-col items-center justify-center text-center px-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')", backgroundSize: '400px' }}></div>
            <h1 className="text-3xl lg:text-5xl font-sans font-extrabold uppercase tracking-[0.15em] bg-clip-text text-transparent bg-cover bg-center leading-tight py-2 relative z-10" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}>
                Empty Bag
            </h1>
            <p className="text-[#2C241B] text-xs max-w-md mb-8 font-bold tracking-[0.2em] uppercase mt-4 relative z-10">Your tailor's table is currently clear. Discover premium textiles for your next creation.</p>
            <Link href="/" className="px-10 py-4 bg-[#2C241B] text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-black transition-colors shadow-xl relative z-10">
                Explore Collection
            </Link>
        </div>
    )
}