'use client'
import { getAllStores, updateStoreStatus } from "@/actions/admin"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState("newest")

    const fetchStores = async () => {
        const data = await getAllStores()
        setStores(data)
        setLoading(false)
    }

    const handleApprove = async ({ storeId, status }) => {
        const res = await updateStoreStatus(storeId, status)
        if (res.success) {
            // Remove from local state since it's no longer pending
            setStores(prev => prev.filter(s => s.id !== storeId))
            toast.success(`Store ${status} successfully`)
        } else {
            toast.error(`Failed to ${status} store`)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    // Filter to show ONLY pending stores, then apply search query, then sort
    const pendingStores = stores.filter(store => store.status === 'pending')
    const filteredStores = pendingStores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        store.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return !loading ? (
        <div className="relative pb-28 px-4 sm:px-8 pt-8">
            <div className="relative z-10 max-w-5xl mx-auto">
                
                {/* Search and Sort Header */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search pending applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-[#EAE5DB] rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] sm:text-sm shadow-sm transition-all"
                        />
                    </div>
                    
                    {/* Sort Dropdown */}
                    <div className="w-full sm:w-auto">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2.5 border border-[#EAE5DB] rounded-xl leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] sm:text-sm shadow-sm transition-all cursor-pointer text-[#4A3F35]"
                        >
                            <option value="newest">Sort by: Newest First</option>
                            <option value="oldest">Sort by: Oldest First</option>
                        </select>
                    </div>
                </div>

                {filteredStores.length ? (
                    <div className="flex flex-col gap-6">
                        {filteredStores.map((store) => (
                            <div key={store.id} className="bg-white rounded-xl border border-[#EAE5DB] shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:items-start hover:shadow-md transition-shadow">
                                
                                {/* Store Info */}
                                <div className="flex-1 w-full">
                                    <StoreInfo store={store} />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 pt-4 md:pt-0 pb-2 md:min-w-[140px]">
                                    <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })} 
                                        className="w-full bg-[#1f5c35] hover:bg-[#1a4a2b] text-white px-6 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center">
                                        <span className="text-[12px] font-sans font-semibold tracking-wider uppercase">
                                            Approve
                                        </span>
                                    </button>
                                    
                                    <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })} 
                                        className="w-full bg-white hover:bg-[#FDFBF7] text-[#2C241B] border border-[#EAE5DB] px-6 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center">
                                        <span className="text-[12px] font-sans font-semibold tracking-wider uppercase">
                                            Reject
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#bda27e] bg-[#FDFBF7] rounded-xl">
                        <h1 className="text-xl font-serif text-[#8b795a]">No Applications Pending</h1>
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}