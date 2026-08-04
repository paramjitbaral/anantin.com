'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

const OrderItem = ({ order, onReviewSuccess }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <>
            <tr className="text-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer" onClick={() => setIsDetailsModalOpen(true)}>
                <td className="text-left py-4 pl-4">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                    <Image
                                        className="w-16 h-16 rounded-md object-cover border border-[#EAE5DB]"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={64}
                                        height={64}
                                    />
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center py-4 max-md:hidden">{currency}{order.total}</td>

                <td className="text-left py-4 max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-center py-4 pr-6 text-sm max-md:hidden align-middle">
                    <div className="flex flex-col gap-1.5 items-center justify-center inline-flex">
                        <div
                            className={`flex items-center justify-center gap-1 rounded-full px-3 py-1.5 whitespace-nowrap min-w-[100px] ${order.status === 'DELIVERED'
                                ? 'text-green-600 bg-green-100'
                                : (order.status === 'CANCELLED' || order.status === 'RETURNED')
                                    ? 'text-red-600 bg-red-100'
                                    : 'text-slate-500 bg-slate-100'
                                }`}
                        >
                            <DotIcon size={10} className="scale-250" />
                            {order.status.split('_').join(' ').toLowerCase()}
                        </div>
                        {order.hasReviewed && order.avgRating && (
                            <div className="flex items-center justify-center gap-0.5 w-full">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3.5 h-3.5 ${i < order.avgRating ? 'text-[#C29E57] fill-current' : 'text-[#EAE5DB] fill-current'}`} viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                        )}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden cursor-pointer" onClick={() => setIsDetailsModalOpen(true)}>
                <td colSpan={5} className="py-4 px-4">
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex flex-col items-center justify-center gap-1.5 mt-2 inline-flex w-full">
                        <span className={`text-center mx-auto px-6 py-1.5 rounded-full min-w-[120px] ${order.status === 'DELIVERED'
                            ? 'text-green-600 bg-green-100'
                            : (order.status === 'CANCELLED' || order.status === 'RETURNED')
                                ? 'text-red-600 bg-red-100'
                                : 'text-slate-500 bg-slate-100'
                            }`} >
                            {order.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        {order.hasReviewed && order.avgRating && (
                            <div className="flex items-center justify-center gap-0.5 w-full">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < order.avgRating ? 'text-[#C29E57] fill-current' : 'text-[#EAE5DB] fill-current'}`} viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                        )}
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
            <OrderDetailsModal 
                order={order} 
                isOpen={isDetailsModalOpen} 
                onClose={() => setIsDetailsModalOpen(false)} 
                onReviewSuccess={onReviewSuccess}
            />
        </>
    )
}

export default OrderItem