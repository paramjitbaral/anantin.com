'use client'
import { getAdminDashboardData } from "@/actions/admin"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        const data = await getAdminDashboardData()
        setDashboardData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="relative pb-28 px-4 sm:px-8 pt-8 animate-pulse">
                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Skeleton Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-[#f9f8f5] rounded-xl shadow-sm p-6 border border-[#EAE5DB] flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full flex-shrink-0 bg-[#EAE5DB]"></div>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="h-2.5 bg-[#EAE5DB] rounded w-1/2"></div>
                                    <div className="h-5 bg-[#EAE5DB] rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Skeleton Chart */}
                    <div className="w-full bg-[#f9f8f5] rounded-xl shadow-sm border border-[#EAE5DB] p-4 lg:p-5 h-[320px]"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative pb-28 px-4 sm:px-8 pt-8">
            <div className="relative z-10 max-w-6xl mx-auto">
                
                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-2">
                    {
                        dashboardCardsData.map((card, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-[#EAE5DB] flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center bg-[#FDFBF7] text-[#8b6b3d] border border-[#EAE5DB]">
                                    <card.icon size={24} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-[11px] font-sans font-medium text-[#8b795a] uppercase tracking-widest">{card.title}</p>
                                    <b className="text-2xl font-serif font-semibold text-[#2C241B] leading-none">{card.value}</b>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Area Chart */}
                <div className="w-full bg-white rounded-xl shadow-sm border border-[#EAE5DB] p-4 lg:p-5">
                    <div className="relative z-10">
                        <OrdersAreaChart allOrders={dashboardData.allOrders} />
                    </div>
                </div>
            </div>
        </div>
    )
}