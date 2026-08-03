import { getDemoStoreId, getStoreDashboardData } from "@/actions/supplier"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function Dashboard() {
    const storeId = await getDemoStoreId()
    
    if (!storeId) {
        return (
            <div className="relative pb-28 pt-8">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 text-center mt-20">
                    <h1 className="text-2xl font-serif text-[#2C241B]">No Store Found</h1>
                    <p className="text-[#8b795a] mt-2">Please create a store first to view your dashboard.</p>
                </div>
            </div>
        )
    }

    const dashboardData = await getStoreDashboardData(storeId)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon, color: "text-[#1f5c35]", bg: "bg-[#e8f3ec]" },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings.toLocaleString(), icon: CircleDollarSignIcon, color: "text-[#8b6b3d]", bg: "bg-[#FDFBF7]" },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon, color: "text-[#2C241B]", bg: "bg-[#f5f5f5]" },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon, color: "text-[#d4af37]", bg: "bg-[#fffdf0]" },
    ]

    return (
        <div className="relative pb-28 pt-8">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
                
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-[#EAE5DB]">
                    <h1 className="text-3xl font-serif font-semibold text-[#2C241B]">
                        Store Dashboard
                    </h1>
                    <p className="text-[12px] font-sans text-[#8b795a] mt-1">
                        Overview of your store's performance
                    </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {dashboardCardsData.map((card, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] p-6 flex items-center justify-between transition-transform hover:-translate-y-1">
                            <div className="flex flex-col gap-1">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8b795a]">{card.title}</p>
                                <b className="text-3xl font-serif text-[#2C241B] mt-1">{card.value}</b>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg}`}>
                                <card.icon size={28} className={card.color} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-[#F0EBE1] bg-[#FDFBF7] flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-[#2C241B]">Recent Reviews</h2>
                            <p className="text-[12px] font-sans text-[#8b795a] mt-1">Latest feedback from your customers</p>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        {dashboardData.ratings.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-[#8b795a]">
                                <p className="text-sm">No reviews yet.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-[#EAE5DB]">
                                {dashboardData.ratings.map((review, index) => (
                                    <div key={index} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 sm:items-center justify-between group">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FDFBF7] border border-[#EAE5DB] flex-shrink-0 relative">
                                                {review.user?.image ? (
                                                    <Image src={review.user.image} alt={review.user.name} fill className="object-cover" />
                                                ) : (
                                                    <span className="w-full h-full flex items-center justify-center text-lg font-serif text-[#8b795a]">
                                                        {review.user?.name?.charAt(0) || '?'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#2C241B]">{review.user?.name || 'Anonymous'}</p>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8b795a] mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                <p className="mt-3 text-[#4A3F35] text-sm leading-relaxed max-w-xl">{review.review}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:items-end justify-between min-w-[200px] p-4 rounded-xl bg-[#FDFBF7] border border-[#F0EBE1] transition-colors group-hover:bg-white group-hover:border-[#EAE5DB]">
                                            <div className="flex flex-col sm:items-end mb-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a]">{review.product?.category}</p>
                                                <p className="font-medium text-[#2C241B] text-sm mt-0.5">{review.product?.name}</p>
                                                <div className='flex items-center mt-2'>
                                                    {Array(5).fill('').map((_, idx) => (
                                                        <StarIcon key={idx} size={14} className='mr-0.5' fill={review.rating >= idx + 1 ? "#1f5c35" : "#EAE5DB"} color={review.rating >= idx + 1 ? "#1f5c35" : "#EAE5DB"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <Link href={`/shop/product/${review.product?.id}`} className="text-[11px] font-bold uppercase tracking-widest text-[#8b6b3d] hover:text-[#2C241B] transition-colors border-b border-[#8b6b3d] hover:border-[#2C241B] pb-0.5">
                                                View Product &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}