'use client'
import { getAllStores, toggleStoreActiveStatus } from "@/actions/admin"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState("newest")

    const fetchStores = async () => {
        const data = await getAllStores()
        setStores(data)
        setLoading(false)
    }

    const toggleIsActive = async (storeId) => {
        const storeToUpdate = stores.find(s => s.id === storeId)
        if (!storeToUpdate) return

        const res = await toggleStoreActiveStatus(storeId, storeToUpdate.isActive)
        if (res.success) {
            // Update local state to reflect the change immediately
            setStores(prev => prev.map(s => s.id === storeId ? { ...s, isActive: !s.isActive } : s))
            toast.success("Store status updated")
        } else {
            toast.error("Failed to update status")
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    // Filter and Sort the stores
    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        store.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return !loading ? (
        <div className="relative pb-28 px-4 sm:px-8 pt-8 min-h-screen">
            <div className="relative z-10 max-w-7xl mx-auto">
                
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
                            placeholder="Search by store name, username, or email..."
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredStores.map((store) => (
                            <div key={store.id} className="relative group bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#F0EBE1] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 flex flex-col">
                                
                                {/* Store Info handles the entire internal card layout now */}
                                <StoreInfo store={store} toggleIsActive={toggleIsActive} />

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#bda27e] bg-[#FDFBF7] rounded-2xl">
                        <h1 className="text-xl font-serif text-[#8b795a]">No Stores Available</h1>
                    </div>
                )}
            </div>
        </div>
    ) : <Loading />
}