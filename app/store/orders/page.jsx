'use client'
import { getLoggedInStoreId, getStoreOrders, updateOrderStatus } from "@/actions/supplier"
import Loading from "@/components/Loading"
import { EyeIcon, XIcon, FilterIcon, ChevronDownIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { toast } from "react-hot-toast"

export default function StoreOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [storeId, setStoreId] = useState(null)

    // Filter states
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
    const filterDropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredOrders = orders.filter(order => {
        if (filterStatus === "ALL") return true;
        return order.status === filterStatus;
    });

    const fetchOrders = async () => {
        try {
            const sid = await getLoggedInStoreId()
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

    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            toast.error("No orders to export.");
            return;
        }

        const headers = ["Order ID", "Customer Name", "Customer Email", "Customer Phone", "City", "Total Amount", "Payment Method", "Status", "Date"];
        const rows = filteredOrders.map(o => [
            `"${o.id || ''}"`,
            `"${o.user?.name || 'Guest'}"`,
            `"${o.user?.email || ''}"`,
            `"${o.address?.phone || ''}"`,
            `"${o.address?.city || ''}"`,
            o.total || 0,
            `"${o.paymentMethod || ''}"`,
            `"${o.status || ''}"`,
            `"${new Date(o.createdAt).toLocaleDateString()}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "incoming_orders.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Exported to CSV!");
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
        <div className="relative w-full min-h-screen bg-[#FDFBF7] flex flex-col">
            {/* Fabric Background Texture Overlay for the entire page */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')", backgroundRepeat: "repeat", backgroundSize: "600px" }}></div>
            
            <div className="relative z-10 w-full flex flex-col flex-1">
                
                {/* Header Section */}
                <div className="px-12 py-6 border-b border-[#EAE5DB] bg-white/40 backdrop-blur-md flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
                    {/* Subtle stitching effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-15" style={{ background: "radial-gradient(circle at 2px 0, #8b795a 1.5px, transparent 2px) repeat-x", backgroundSize: "6px 6px" }}></div>
                    
                    <div>
                        <h2 className="text-xl font-serif font-bold text-[#1a1510] tracking-tight">Incoming Orders</h2>
                        <p className="text-[10px] font-sans text-[#8b795a] mt-1 tracking-wide uppercase font-medium">Manage and track your customer orders ({filteredOrders.length})</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={exportToCSV} className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8b795a] bg-white/80 backdrop-blur-sm border border-[#EAE5DB] rounded-md hover:bg-[#F0EBE1] hover:text-[#2C241B] transition-all shadow-sm">
                            Export CSV
                        </button>
                        
                        <div className="relative" ref={filterDropdownRef}>
                            <button 
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white bg-[#1a1510] rounded-md hover:bg-black shadow-md transition-all relative overflow-hidden group flex items-center gap-2"
                            >
                                <span className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></span>
                                <FilterIcon className="w-3 h-3 relative z-10" />
                                <span className="relative z-10">{filterStatus === "ALL" ? "Filter" : filterStatus.replace('_', ' ')}</span>
                                <ChevronDownIcon className={`w-3 h-3 relative z-10 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EAE5DB] rounded-xl shadow-xl z-50 overflow-hidden text-[#1a1510]">
                                    <div className="px-4 py-2 border-b border-[#EAE5DB] bg-[#FDFBF7]">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8b795a]">Filter by Status</span>
                                    </div>
                                    <div className="flex flex-col py-1">
                                        {['ALL', 'ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => { setFilterStatus(status); setIsFilterDropdownOpen(false); }}
                                                className={`px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#FDFBF7] transition-colors ${filterStatus === status ? 'text-[#1a1510] bg-[#FDFBF7]' : 'text-[#8b795a]'}`}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto w-full relative z-10 flex-1">
                    <table className="w-full text-left bg-transparent">
                        <thead className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8b795a] bg-white/60 backdrop-blur-md sticky top-0 z-10">
                            <tr>
                                <th className="px-12 py-6 border-b border-[#EAE5DB]">Order ID</th>
                                    <th className="px-6 py-6 border-b border-[#EAE5DB]">Customer</th>
                                    <th className="px-6 py-6 border-b border-[#EAE5DB]">Date</th>
                                    <th className="px-6 py-6 border-b border-[#EAE5DB]">Total</th>
                                    <th className="px-6 py-6 border-b border-[#EAE5DB]">Payment</th>
                                    <th className="px-6 py-6 border-b border-[#EAE5DB] text-center">Status</th>
                                    <th className="px-12 py-6 border-b border-[#EAE5DB] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#EAE5DB]/60 last:border-0 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group cursor-pointer relative z-0 hover:z-10" onClick={() => openModal(order)}>
                                        <td className="px-12 py-6">
                                            <span className="inline-flex items-center text-[#1a1510] font-mono font-bold tracking-widest text-[11px]">
                                                #{order.id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1a1510] text-[13px]">{order.user?.name || 'Guest'}</span>
                                                <span className="text-[11px] font-medium tracking-wide text-[#8b795a] mt-0.5">{order.address?.city || 'No Location'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-[#8b795a] text-[12px] font-medium tracking-wide">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="font-bold text-[#1a1510] text-[14px]">{currency}{order.total.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A3F35]">
                                                    {order.paymentMethod}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="relative inline-block w-full max-w-[130px]">
                                                <select
                                                    value={order.status}
                                                    onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                                    className={`w-full text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-md border outline-none appearance-none cursor-pointer transition-all ${statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-200"} hover:shadow-sm`}
                                                >
                                                    <option value="ORDER_PLACED">PLACED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-6 text-right">
                                            <button 
                                                onClick={() => openModal(order)}
                                                className="inline-flex items-center justify-center w-7 h-7 text-[#8b795a] hover:text-[#1a1510] hover:bg-[#F0EBE1] rounded-full transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredOrders.length === 0 && (
                            <div className="py-16 flex flex-col items-center justify-center text-[#8b795a]">
                                <p className="text-sm font-serif">{orders.length === 0 ? "No orders yet." : "No orders found matching this filter."}</p>
                            </div>
                        )}
                    </div>
                </div>

            {/* Premium Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241B]/60 backdrop-blur-md" onClick={closeModal}>
                    <div className="bg-[#FDFBF7] rounded-[16px] shadow-2xl w-full max-w-3xl relative overflow-hidden border border-[#EAE5DB]" onClick={e => e.stopPropagation()}>
                        
                        {/* Fabric Background Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>
                        
                        {/* Close button */}
                        <button onClick={closeModal} className="absolute top-4 right-4 z-20 p-1.5 text-[#8b795a] hover:text-[#2C241B] transition-colors rounded-full hover:bg-black/5">
                            <XIcon className="w-4 h-4" />
                        </button>
                        
                        <div className="flex flex-col h-full relative z-10">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-[#EAE5DB] bg-white/80 backdrop-blur-sm flex justify-between items-center relative">
                                {/* Subtle stitching effect */}
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-20" style={{ background: "radial-gradient(circle at 2px 0, #8b795a 1px, transparent 2px) repeat-x", backgroundSize: "4px 4px" }}></div>
                                
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-xl font-serif font-semibold text-[#1a1510]">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${statusColors[selectedOrder.status]}`}>
                                            {selectedOrder.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium tracking-wide text-[#8b795a]">{new Date(selectedOrder.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 grid grid-cols-12 gap-8 bg-[#FDFBF7]/90 backdrop-blur-sm">
                                
                                {/* Left Column: Details (7 cols) */}
                                <div className="col-span-7 flex flex-col gap-6">
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Customer */}
                                        <div>
                                            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-2 flex items-center gap-2">
                                                <span className="w-4 h-[1px] bg-[#8b795a]/30"></span> Customer
                                            </h3>
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-[#1a1510] text-[13px]">{selectedOrder.user?.name || 'Guest'}</p>
                                                <p className="text-[#8b795a] text-[11px]">{selectedOrder.user?.email || 'N/A'}</p>
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
                                                    <span className="font-bold uppercase tracking-widest text-[#1a1510]">{selectedOrder.paymentMethod}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[11px]">
                                                    <span className="text-[#8b795a]">Status</span>
                                                    <span className={`font-bold uppercase tracking-widest ${selectedOrder.isPaid ? 'text-[#1f5c35]' : 'text-orange-500'}`}>
                                                        {selectedOrder.isPaid ? 'Paid' : 'Pending'}
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
                                        <div className="flex items-start justify-between bg-white/60 p-4 rounded-xl border border-[#EAE5DB]/50">
                                            <div>
                                                <p className="font-semibold text-[#1a1510] text-[12px] mb-0.5">{selectedOrder.address?.name}</p>
                                                <p className="text-[#4A3F35] text-[11px] leading-relaxed">
                                                    {selectedOrder.address?.street}, {selectedOrder.address?.city}<br/>
                                                    {selectedOrder.address?.state} {selectedOrder.address?.zip}, {selectedOrder.address?.country}
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end justify-center">
                                                <p className="text-[#8b795a] text-[9px] uppercase tracking-widest">Phone</p>
                                                <p className="font-medium text-[#1a1510] text-[11px] mt-0.5">{selectedOrder.address?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Items (5 cols) */}
                                <div className="col-span-5 flex flex-col bg-white/80 rounded-xl border border-[#EAE5DB] overflow-hidden backdrop-blur-sm relative">
                                    {/* Fabric tag element */}
                                    <div className="absolute top-0 right-4 w-6 h-8 bg-[#8b795a] opacity-10 rounded-b-md"></div>
                                    
                                    <div className="px-4 py-3 border-b border-[#EAE5DB] bg-[#FDFBF7]/50">
                                        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a]">Order Summary</h3>
                                    </div>
                                    
                                    <div className="p-4 flex-1 flex flex-col gap-3">
                                        {selectedOrder.orderItems?.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <div className="w-10 h-10 rounded-md bg-[#F0EBE1] border border-[#EAE5DB] overflow-hidden flex-shrink-0">
                                                    {item.product?.images?.[0] ? (
                                                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : null}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-[#1a1510] text-[11px] truncate">{item.product?.name || 'Unknown'}</p>
                                                    <p className="text-[9px] font-medium tracking-wide text-[#8b795a]">{item.quantity} × {currency}{item.price}</p>
                                                </div>
                                                <p className="font-bold text-[#1a1510] text-[12px]">{currency}{(item.quantity * item.price).toLocaleString()}</p>
                                            </div>
                                        ))}
                                        {selectedOrder.orderItems?.length > 3 && (
                                            <div className="text-center pt-1 border-t border-[#EAE5DB] mt-1">
                                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8b795a]">+{selectedOrder.orderItems.length - 3} more items</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 bg-[#1a1510] flex justify-between items-center relative overflow-hidden">
                                        {/* Texture in footer */}
                                        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>
                                        <span className="font-bold uppercase tracking-[0.2em] text-[#A89F8D] text-[9px] relative z-10">Grand Total</span>
                                        <span className="font-bold text-lg text-white tracking-tight relative z-10">{currency}{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
