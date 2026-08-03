'use client'
import { getDemoStoreId, getStoreOrders, updateOrderStatus } from "@/actions/supplier"
import Loading from "@/components/Loading"
import { EyeIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [storeId, setStoreId] = useState(null)

    const fetchOrders = async () => {
        try {
            const sid = await getDemoStoreId()
            setStoreId(sid)
            if (sid) {
                const data = await getStoreOrders(sid)
                setOrders(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleUpdateStatus = async (orderId, status) => {
        toast.loading("Updating status...", { id: 'status' })
        const res = await updateOrderStatus(orderId, status)
        if (res.success) {
            toast.success("Status updated!", { id: 'status' })
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
        } else {
            toast.error(res.error, { id: 'status' })
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    if (loading) return <Loading />

    if (!storeId) {
        return (
            <div className="relative pb-28 pt-8">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 text-center mt-20">
                    <h1 className="text-2xl font-serif text-[#2C241B]">No Store Found</h1>
                    <p className="text-[#8b795a] mt-2">Please log in to manage your orders.</p>
                </div>
            </div>
        )
    }

    const statusColors = {
        ORDER_PLACED: "bg-blue-100 text-blue-700 border-blue-200",
        PROCESSING: "bg-yellow-100 text-yellow-700 border-yellow-200",
        SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
        DELIVERED: "bg-green-100 text-green-700 border-green-200",
    }

    return (
        <div className="relative pb-28 pt-8">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
                
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-[#EAE5DB]">
                    <h1 className="text-3xl font-serif font-semibold text-[#2C241B]">
                        Order Management
                    </h1>
                    <p className="text-[12px] font-sans text-[#8b795a] mt-1">
                        Track, manage, and update customer orders
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-[#F0EBE1] bg-[#FDFBF7] flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-[#2C241B]">Incoming Orders</h2>
                            <p className="text-[12px] font-sans text-[#8b795a] mt-1">{orders.length} orders total</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] uppercase font-bold tracking-widest text-[#8b795a] bg-white border-b border-[#EAE5DB]">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EAE5DB]">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#FDFBF7] transition-colors group cursor-pointer" onClick={() => openModal(order)}>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-[#EAE5DB] text-[#2C241B] font-mono font-semibold tracking-wider text-[11px]">
                                                #{order.id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#2C241B]">{order.user?.name || 'Guest'}</span>
                                                <span className="text-[10px] text-[#8b795a]">{order.address?.city || ''}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#8b795a] text-xs font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#1f5c35] text-base">{currency}{order.total.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A3F35]">
                                                {order.paymentMethod} {order.isPaid ? '✓' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer ${statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
                                            >
                                                <option value="ORDER_PLACED">PLACED</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => openModal(order)}
                                                className="p-2 text-[#8b795a] hover:text-[#2C241B] hover:bg-[#EAE5DB] rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {orders.length === 0 && (
                            <div className="py-16 flex flex-col items-center justify-center text-[#8b795a]">
                                <p className="text-sm">No orders yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241B]/40 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="px-8 py-6 border-b border-[#F0EBE1] bg-[#FDFBF7] flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-[#2C241B]">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                                <p className="text-[12px] font-sans text-[#8b795a] mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusColors[selectedOrder.status]}`}>
                                {selectedOrder.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            
                            {/* Customer Section */}
                            <div className="mb-8">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b795a] mb-4 border-b border-[#EAE5DB] pb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[#8b795a]">Name</p>
                                        <p className="font-medium text-[#2C241B]">{selectedOrder.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#8b795a]">Email</p>
                                        <p className="font-medium text-[#2C241B]">{selectedOrder.user?.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[#8b795a]">Shipping Address</p>
                                        <p className="font-medium text-[#2C241B]">
                                            {selectedOrder.address?.name}<br/>
                                            {selectedOrder.address?.street}, {selectedOrder.address?.city}<br/>
                                            {selectedOrder.address?.state}, {selectedOrder.address?.zip}<br/>
                                            {selectedOrder.address?.country}
                                        </p>
                                        <p className="font-medium text-[#2C241B] mt-1">Phone: {selectedOrder.address?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="mb-8">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b795a] mb-4 border-b border-[#EAE5DB] pb-2">Order Items</h3>
                                <div className="flex flex-col gap-4">
                                    {selectedOrder.orderItems?.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-[#F0EBE1] bg-[#FDFBF7]">
                                            <div className="w-16 h-16 rounded-lg bg-white border border-[#EAE5DB] overflow-hidden relative flex-shrink-0">
                                                {item.product?.images?.[0] ? (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#EAE5DB]"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <p className="font-semibold text-[#2C241B]">{item.product?.name || 'Unknown Product'}</p>
                                                <p className="text-xs text-[#8b795a] mt-1">Qty: {item.quantity} &times; {currency}{item.price}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="font-bold text-[#1f5c35] text-lg">{currency}{(item.quantity * item.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b795a] mb-4 border-b border-[#EAE5DB] pb-2">Payment Summary</h3>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[#8b795a]">Method</span>
                                    <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[#8b795a]">Payment Status</span>
                                    <span className={`font-medium ${selectedOrder.isPaid ? 'text-[#1f5c35]' : 'text-yellow-600'}`}>
                                        {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                                {selectedOrder.isCouponUsed && (
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[#8b795a]">Coupon Applied</span>
                                        <span className="font-medium text-[#1f5c35]">
                                            {selectedOrder.coupon?.code} ({selectedOrder.coupon?.discount}% OFF)
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#EAE5DB]">
                                    <span className="font-serif font-semibold text-[#2C241B] text-lg">Total</span>
                                    <span className="font-bold text-[#1f5c35] text-2xl">{currency}{selectedOrder.total.toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                        
                        <div className="p-6 border-t border-[#F0EBE1] bg-white flex justify-end">
                            <button onClick={closeModal} className="px-6 py-2.5 bg-white border border-[#EAE5DB] text-[#2C241B] hover:bg-[#FDFBF7] rounded-xl transition-colors text-sm font-semibold">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
