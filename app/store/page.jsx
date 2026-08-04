import { getLoggedInStoreId, getStoreDashboardData, getStoreById } from "@/actions/supplier"
import DashboardClient from "@/components/DashboardClient"

export default async function Dashboard() {
    const storeId = await getLoggedInStoreId()
    
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

    // Fetch all datasets upfront to allow for instant client-side toggling
    const [dailyData, monthlyData, yearlyData, storeData] = await Promise.all([
        getStoreDashboardData(storeId, 'daily'),
        getStoreDashboardData(storeId, 'monthly'),
        getStoreDashboardData(storeId, 'yearly'),
        getStoreById(storeId)
    ])
    
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    return (
        <div className="relative w-full min-h-full flex flex-col font-sans text-[#1a1510]">
            <DashboardClient 
                dailyData={dailyData} 
                monthlyData={monthlyData} 
                yearlyData={yearlyData} 
                storeData={storeData}
                currency={currency}
            />
        </div>
    )
}