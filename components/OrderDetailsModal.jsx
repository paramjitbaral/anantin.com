import { XIcon, CheckCircleIcon, ClockIcon, TruckIcon, PackageIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitReview } from "@/actions/review";

export default function OrderDetailsModal({ order, isOpen, onClose, onReviewSuccess }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    // Rating state
    const [selectedProductToRate, setSelectedProductToRate] = useState(order?.orderItems?.[0]?.product || null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

    if (!isOpen || !order) return null;

    const statuses = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statuses.indexOf(order.status) !== -1 ? statuses.indexOf(order.status) : (order.status === 'CANCELLED' || order.status === 'RETURNED' ? -1 : 0);

    const getIconForStatus = (status) => {
        switch (status) {
            case 'ORDER_PLACED': return <PackageIcon size={14} />;
            case 'PROCESSING': return <ClockIcon size={14} />;
            case 'SHIPPED': return <TruckIcon size={14} />;
            case 'DELIVERED': return <CheckCircleIcon size={14} />;
            default: return <PackageIcon size={14} />;
        }
    };

    const statusColors = {
        ORDER_PLACED: "bg-red-100 text-red-700 border-red-200",
        PROCESSING: "bg-yellow-100 text-yellow-700 border-yellow-200",
        SHIPPED: "bg-slate-100 text-slate-700 border-slate-200",
        DELIVERED: "bg-green-100 text-green-700 border-green-200",
        CANCELLED: "bg-red-100 text-red-700 border-red-200",
        RETURNED: "bg-red-100 text-red-700 border-red-200"
    };

    const ribbonColors = {
        ORDER_PLACED: "bg-red-600",
        PROCESSING: "bg-yellow-500",
        SHIPPED: "bg-slate-600",
        DELIVERED: "bg-green-600",
        CANCELLED: "bg-red-600",
        RETURNED: "bg-red-600"
    };

    const handleRatingSubmit = async () => {
        if (rating < 1 || rating > 5) {
            return toast.error('Please select a rating');
        }
        if (review.length < 5) {
            return toast.error('Please write a short review');
        }

        try {
            setIsSubmitting(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return toast.error('Please log in');
            const user = JSON.parse(userStr);

            const res = await submitReview({
                userId: user.id,
                productId: selectedProductToRate.id,
                orderId: order.id,
                rating,
                review
            });

            if (res.success) {
                toast.success("Review submitted!");
                setRating(0);
                setReview('');
                setIsReviewSubmitted(true);
                if (onReviewSuccess) onReviewSuccess();
            } else {
                toast.error(res.error || "Failed to submit review");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241B]/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-[#FDFBF7] rounded-[16px] shadow-2xl w-full max-w-3xl relative overflow-hidden border border-[#EAE5DB] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

                {/* Fabric Background Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>

                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-1.5 text-[#8b795a] hover:text-[#2C241B] transition-colors rounded-full hover:bg-black/5">
                    <XIcon className="w-4 h-4" />
                </button>

                <div className="flex flex-col h-full relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[#EAE5DB] bg-white/80 backdrop-blur-sm flex justify-between items-center relative sticky top-0 z-20">
                        {/* Subtle stitching effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-20" style={{ background: "radial-gradient(circle at 2px 0, #8b795a 1px, transparent 2px) repeat-x", backgroundSize: "4px 4px" }}></div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-serif font-semibold text-[#1a1510]">Order #{order.id.slice(-6).toUpperCase()}</h2>
                                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                                {order.status === 'DELIVERED' && (
                                    <span className="text-[10px] text-[#1f5c35] font-bold tracking-wide italic opacity-80">
                                        (Delivered in {Math.max(1, Math.ceil((new Date(order.updatedAt) - new Date(order.createdAt)) / (1000 * 60 * 60 * 24)))} days)
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-medium tracking-wide text-[#8b795a]">{new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col gap-8 bg-[#FDFBF7]/90 backdrop-blur-sm">

                        {/* Order Timeline */}
                        <div className="w-full">
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-6 flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Order Status
                            </h3>

                            {order.status === 'CANCELLED' || order.status === 'RETURNED' ? (
                                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <XIcon size={18} />
                                    <span className="font-bold uppercase tracking-widest text-[11px]">Order {order.status}</span>
                                </div>
                            ) : (
                                <div className="relative px-4">
                                    <div className="absolute top-[16px] left-8 right-8 h-[1px] bg-[#EAE5DB] hidden sm:block"></div>
                                    <div className="absolute top-0 bottom-0 left-[20px] w-[1px] bg-[#EAE5DB] block sm:hidden"></div>

                                    <div className="flex flex-col sm:flex-row justify-between relative gap-6 sm:gap-0">
                                        {statuses.map((status, index) => {
                                            const isCompleted = index <= currentStatusIndex;
                                            const isCurrent = index === currentStatusIndex;
                                            return (
                                                <div key={status} className="flex sm:flex-col items-center gap-4 sm:gap-3 z-10 relative flex-1">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-[#1a1510] text-[#FDFBF7] shadow-md border border-[#1a1510]' : 'bg-white border border-[#EAE5DB] text-[#8b795a]'}`}>
                                                        {getIconForStatus(status)}
                                                    </div>
                                                    <div className="text-left sm:text-center">
                                                        <p className={`text-[9px] font-bold uppercase tracking-[0.15em] ${isCurrent ? 'text-[#1a1510]' : (isCompleted ? 'text-[#8b795a]' : 'text-[#8b795a]/50')}`}>
                                                            {status.replace(/_/g, ' ')}
                                                        </p>
                                                        {status === 'DELIVERED' && order.status === 'DELIVERED' && (
                                                            <p className="text-[9px] text-green-600 font-bold tracking-wider mt-0.5">
                                                                {new Date(order.updatedAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                        {status === 'ORDER_PLACED' && (
                                                            <p className="text-[9px] text-[#8b795a] font-bold tracking-wider mt-0.5">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Left Column: Details or Rating (7 cols) */}
                            <div className="md:col-span-7 flex flex-col gap-6">
                                {order.status === 'DELIVERED' && !isReviewSubmitted && !order.hasReviewed ? (
                                    <div className="h-full flex flex-col">
                                        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-4 flex items-center gap-2">
                                            <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Rate & Review
                                        </h3>

                                        {/* Product Selector if multiple */}
                                        {order.orderItems.length > 1 && (
                                            <div className="mb-4">
                                                <p className="text-[10px] text-[#8b795a] uppercase tracking-wider font-bold mb-2">Select Item to Review</p>
                                                <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                                                    {order.orderItems.map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedProductToRate(item.product)}
                                                            className={`shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-lg border transition-colors ${selectedProductToRate?.id === item.product.id ? 'border-[#1a1510] bg-[#1a1510] text-white' : 'border-[#EAE5DB] hover:border-[#8b795a] bg-white'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded shrink-0 bg-white overflow-hidden">
                                                                <Image src={item.product.images[0]} width={32} height={32} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                            <span className={`text-[10px] font-bold truncate max-w-[100px] ${selectedProductToRate?.id === item.product.id ? 'text-white' : 'text-[#1a1510]'}`}>
                                                                {item.product.name}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`size-6 cursor-pointer transition-all ${rating > i ? "text-[#D4B26F] fill-[#D4B26F]" : "text-[#EAE5DB]"}`}
                                                        onClick={() => setRating(i + 1)}
                                                    />
                                                ))}
                                            </div>

                                            <textarea
                                                className="w-full p-3 border border-[#EAE5DB]/50 bg-white/60 shadow-sm text-[#1a1510] rounded-xl h-[80px] focus:outline-none focus:border-[#8b795a] focus:ring-1 focus:ring-[#8b795a] transition-colors resize-none text-[13px] placeholder:text-[#8b795a]/60"
                                                placeholder={`How did you like ${selectedProductToRate?.name || 'this product'}?`}
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                            ></textarea>

                                            <button
                                                onClick={handleRatingSubmit}
                                                disabled={isSubmitting || rating === 0}
                                                className="w-full bg-[#1a1510] hover:bg-black disabled:bg-[#8b795a] disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition-all font-bold tracking-wider text-[10px] uppercase mt-2"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Customer */}
                                            <div>
                                                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-2 flex items-center gap-2">
                                                    <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Customer
                                                </h3>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-[#1a1510] text-[13px]">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-[#8b795a] text-[11px]">{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Payment */}
                                            <div>
                                                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-2 flex items-center gap-2">
                                                    <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Payment
                                                </h3>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between items-center text-[11px]">
                                                        <span className="text-[#8b795a]">Method</span>
                                                        <span className="font-bold uppercase tracking-widest text-[#1a1510]">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[11px]">
                                                        <span className="text-[#8b795a]">Status</span>
                                                        <span className={`font-bold uppercase tracking-widest ${order.isPaid || order.status === 'DELIVERED' ? 'text-[#1f5c35]' : 'text-orange-500'}`}>
                                                            {order.isPaid || order.status === 'DELIVERED' ? 'Paid' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery */}
                                        <div>
                                            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-2 flex items-center gap-2">
                                                <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Shipping Address
                                            </h3>
                                            <div className="flex items-start justify-between bg-white/60 p-4 rounded-xl border border-[#EAE5DB]/50 shadow-sm">
                                                <div>
                                                    <p className="font-semibold text-[#1a1510] text-[12px] mb-0.5">{order.address?.name}</p>
                                                    <p className="text-[#4A3F35] text-[11px] leading-relaxed">
                                                        {order.address?.street}, {order.address?.city}<br />
                                                        {order.address?.state} {order.address?.zip}, {order.address?.country}
                                                    </p>
                                                </div>
                                                <div className="text-right flex flex-col items-end justify-center">
                                                    <p className="text-[#8b795a] text-[9px] uppercase tracking-widest">Phone</p>
                                                    <p className="font-medium text-[#1a1510] text-[11px] mt-0.5">{order.address?.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Right Column: Items (5 cols) */}
                            <div className="md:col-span-5 flex flex-col bg-white/80 rounded-xl border border-[#EAE5DB] overflow-hidden backdrop-blur-sm relative shadow-sm">
                                {/* Fabric tag element */}
                                <div className={`absolute top-0 right-4 w-6 h-8 ${ribbonColors[order.status] || "bg-[#8b795a]"} opacity-30 rounded-b-md hidden md:block`}></div>

                                <div className="px-4 py-3 border-b border-[#EAE5DB] bg-[#FDFBF7]/50">
                                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a]">Order Summary</h3>
                                </div>

                                <div className="p-4 flex-1 flex flex-col gap-4">
                                    {order.orderItems?.map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start border-b border-[#EAE5DB]/50 pb-3 last:border-0 last:pb-0">
                                            <Link href={`/product/${item.product?.id}`} className="w-12 h-12 rounded-md bg-[#F0EBE1] border border-[#EAE5DB] overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                                {item.product?.images?.[0] ? (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : null}
                                            </Link>
                                            <div className="flex-1 min-w-0 flex justify-between items-start">
                                                <div>
                                                    <Link href={`/product/${item.product?.id}`} className="font-bold text-[#1a1510] text-[11px] leading-tight hover:underline cursor-pointer block">
                                                        {item.product?.name || 'Unknown'}
                                                    </Link>
                                                    <p className="text-[9px] font-medium tracking-wide text-[#8b795a] mt-0.5">{item.quantity} × {currency}{item.price}</p>

                                                    {/* Rate product button is no longer needed here since it's on the left */}
                                                    {order.status !== 'DELIVERED' && (
                                                        <span className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-[#8b795a]/50">
                                                            Pending Delivery
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-bold text-[#1a1510] text-[12px]">{currency}{(item.quantity * item.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-4 py-4 bg-[#1a1510] flex justify-between items-center relative overflow-hidden">
                                    {/* Texture in footer */}
                                    <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>
                                    <span className="font-bold uppercase tracking-[0.2em] text-[#A89F8D] text-[9px] relative z-10">Grand Total</span>
                                    <span className="font-bold text-lg text-white tracking-tight relative z-10">{currency}{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
