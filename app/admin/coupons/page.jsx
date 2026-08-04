'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon } from "lucide-react"
import { getAllCoupons, createCoupon, deleteCoupon as deleteCouponAction } from "@/actions/coupon"

export default function AdminCoupons() {

    const [coupons, setCoupons] = useState([])

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    const fetchCoupons = async () => {
        const data = await getAllCoupons()
        setCoupons(data)
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        const res = await createCoupon(newCoupon)
        if (res.success) {
            toast.success("Coupon created!")
            setNewCoupon({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: false,
                expiresAt: new Date()
            })
            fetchCoupons()
        } else {
            toast.error(res.error)
            throw new Error(res.error)
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const deleteCoupon = async (code) => {
        const res = await deleteCouponAction(code)
        if (res.success) {
            toast.success("Coupon deleted")
            fetchCoupons()
        } else {
            toast.error(res.error)
            throw new Error(res.error)
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    return (
        <div className="relative pb-28 pt-8">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
                
                {/* One Big Professional Container */}
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] overflow-hidden flex flex-col">
                    
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Add Coupon Form (Left Column) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 border-r-0 lg:border-r border-[#EAE5DB] lg:pr-10">
                            <h2 className="text-lg font-serif font-semibold text-[#2C241B]">Create New</h2>
                            
                            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a] mb-2 block">Coupon Code</label>
                                        <input type="text" placeholder="e.g. SUMMER20" className="w-full p-2.5 border border-[#EAE5DB] bg-[#FDFBF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] text-sm text-[#2C241B] transition-colors uppercase placeholder-gray-400"
                                            name="code" value={newCoupon.code} onChange={handleChange} required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a] mb-2 block">Discount (%)</label>
                                        <input type="number" placeholder="e.g. 20" min={1} max={100} className="w-full p-2.5 border border-[#EAE5DB] bg-[#FDFBF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] text-sm text-[#2C241B] transition-colors placeholder-gray-400"
                                            name="discount" value={newCoupon.discount} onChange={handleChange} required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a] mb-2 block">Description</label>
                                        <input type="text" placeholder="20% Off for Summer" className="w-full p-2.5 border border-[#EAE5DB] bg-[#FDFBF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] text-sm text-[#2C241B] transition-colors placeholder-gray-400"
                                            name="description" value={newCoupon.description} onChange={handleChange} required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a] mb-2 block">Expiry Date</label>
                                        <input type="date" className="w-full p-2.5 border border-[#EAE5DB] bg-[#FDFBF7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8b6b3d] focus:border-[#8b6b3d] text-sm text-[#2C241B] transition-colors"
                                            name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-1 py-4 border-y border-[#F0EBE1]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#4A3F35]">For New Users Only</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer"
                                                name="forNewUser" checked={newCoupon.forNewUser}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                                            />
                                            <div className="w-10 h-5 bg-[#EAE5DB] rounded-full peer peer-checked:bg-[#1f5c35] transition-colors duration-200"></div>
                                            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#4A3F35]">For Members Only</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer"
                                                name="forMember" checked={newCoupon.forMember}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                                            />
                                            <div className="w-10 h-5 bg-[#EAE5DB] rounded-full peer peer-checked:bg-[#1f5c35] transition-colors duration-200"></div>
                                            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <button className="mt-2 w-full bg-[#1f5c35] hover:bg-[#1a4a2b] text-white py-3 rounded-xl transition-colors shadow-sm font-semibold text-sm tracking-wide">
                                    Create Coupon
                                </button>
                            </form>
                        </div>

                        {/* List Coupons Table (Right Column) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <h2 className="text-lg font-serif font-semibold text-[#2C241B]">Active Codes</h2>
                            
                            <div className="overflow-hidden overflow-y-auto max-h-[500px] rounded-xl border border-[#F0EBE1] bg-[#FDFBF7]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style dangerouslySetInnerHTML={{__html: `
                                    .overflow-y-auto::-webkit-scrollbar { display: none; }
                                `}} />
                                <table className="w-full text-sm text-left table-fixed">
                                    <thead className="text-[9px] uppercase font-bold tracking-widest text-[#8b795a] border-b border-[#F0EBE1] bg-white sticky top-0 z-10">
                                        <tr>
                                            <th className="px-3 py-3 w-[15%]">Code</th>
                                            <th className="px-3 py-3 w-[15%]">Discount</th>
                                            <th className="px-3 py-3 w-[30%]">Description</th>
                                            <th className="px-3 py-3 w-[20%]">Expires</th>
                                            <th className="px-3 py-3 w-[10%] text-center">Settings</th>
                                            <th className="px-3 py-3 w-[10%] text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0EBE1]">
                                        {coupons.map((coupon) => (
                                            <tr key={coupon.code} className="hover:bg-white transition-colors group">
                                                <td className="px-3 py-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-[#EAE5DB] text-[#2C241B] font-mono font-semibold tracking-wider text-[11px] truncate max-w-full">
                                                        {coupon.code}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className="font-bold text-[#1f5c35] text-base">{coupon.discount}%</span>
                                                </td>
                                                <td className="px-3 py-3 text-[#4A3F35] text-[12px] truncate pr-2" title={coupon.description}>
                                                    {coupon.description}
                                                </td>
                                                <td className="px-3 py-3 text-[#8b795a] text-[12px] font-medium whitespace-nowrap">
                                                    {format(coupon.expiresAt, 'MMM dd, yyyy')}
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {coupon.forNewUser && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="For New Users"></span>}
                                                        {coupon.forMember && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="For Members"></span>}
                                                        {!coupon.forNewUser && !coupon.forMember && <span className="w-1.5 h-1.5 rounded-full bg-gray-300" title="Public"></span>}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <button 
                                                        onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting..." })} 
                                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                                                        title="Delete Coupon"
                                                    >
                                                        <DeleteIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {!coupons.length && (
                                    <div className="py-12 flex flex-col items-center justify-center text-[#8b795a] bg-white">
                                        <p className="text-sm">No active coupons found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}