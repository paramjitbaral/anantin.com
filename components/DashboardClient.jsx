"use client"

import { useState, useEffect, useRef } from "react"
import { CircleDollarSignIcon, ShoppingBasketIcon, TagsIcon, UsersIcon, ChevronDown, BellIcon, SearchIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SalesChart from "@/components/SalesChart"

export default function DashboardClient({ dailyData, monthlyData, yearlyData, storeData, currency }) {
    const [view, setView] = useState('monthly')
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [hasUnread, setHasUnread] = useState(true)
    const notificationsRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);
    
    // Select the correct data based on view
    const dashboardData = view === 'daily' ? dailyData : view === 'yearly' ? yearlyData : monthlyData;

    const filteredTransactions = dashboardData.recentTransactions.filter(order => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return (
            order.user?.name?.toLowerCase().includes(query) ||
            order.id.toLowerCase().includes(query) ||
            order.orderItems?.[0]?.product?.name?.toLowerCase().includes(query)
        )
    });

    const filteredProducts = dashboardData.topProducts.filter(item => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return item.product.name.toLowerCase().includes(query) || item.product.id.toLowerCase().includes(query);
    });

    const timeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " secs ago";
    }

    const notifications = dashboardData.recentTransactions.flatMap(order => {
        const notifs = [];
        const productImage = order.orderItems?.[0]?.product?.images?.[0] || '/placeholder.png';
        
        notifs.push({ 
            type: 'order', 
            text: `New Order Placed`, 
            detail: `Order #${order.id.substring(0, 8)}`, 
            date: order.createdAt,
            image: productImage,
            link: '/store/orders'
        });

        if (order.isPaid || order.status === 'DELIVERED') {
            notifs.push({ 
                type: 'payment', 
                text: `Payment Received`, 
                detail: `${currency}${order.total.toLocaleString()} from ${order.user?.name || 'Customer'}`, 
                date: order.createdAt,
                image: productImage,
                link: '/store/orders'
            });
        }
        return notifs;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    const dashboardCardsData = [
        { 
            title: 'Total Revenue', 
            value: currency + dashboardData.totalEarnings.toLocaleString(), 
            icon: CircleDollarSignIcon, 
            bg: "bg-[#fff0f0]", 
            iconColor: "text-[#d33a3a]" 
        },
        { 
            title: 'Total Customers', 
            value: dashboardData.totalCustomers.toLocaleString(), 
            icon: UsersIcon, 
            bg: "bg-[#fff8e6]", 
            iconColor: "text-[#d4af37]" 
        },
        { 
            title: 'Total Transactions', 
            value: dashboardData.totalOrders.toLocaleString(), 
            icon: TagsIcon, 
            bg: "bg-[#e8f3ec]", 
            iconColor: "text-[#1f5c35]" 
        },
        { 
            title: 'Total Products', 
            value: dashboardData.totalProducts.toLocaleString(), 
            icon: ShoppingBasketIcon, 
            bg: "bg-[#f0f5ff]", 
            iconColor: "text-[#3a7bd5]" 
        },
    ]

    return (
        <div className="relative z-10 w-full flex flex-col flex-1 py-2">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 w-full">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1a1510] tracking-tight">Sales Dashboard</h1>
                    <p className="text-[#8b795a] mt-1 text-sm">Welcome back, <span className="font-bold text-[#1a1510]">{storeData?.name || 'Partner'}!</span></p>
                </div>
                
                <div className="flex items-center gap-4 w-full lg:w-auto relative justify-end">
                    <div className="relative hidden md:block z-50">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b795a]" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search orders or products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="pl-9 pr-16 py-2.5 rounded-xl border border-[#EAE5DB] bg-white text-sm focus:outline-none focus:border-[#d4c9b5] focus:ring-1 focus:ring-[#d4c9b5] w-[300px]" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <span className="px-1.5 py-0.5 rounded border border-[#EAE5DB] text-[10px] text-[#8b795a]">⌘</span>
                            <span className="px-1.5 py-0.5 rounded border border-[#EAE5DB] text-[10px] text-[#8b795a]">K</span>
                        </div>

                        {/* Search Dropdown */}
                        {isSearchFocused && searchTerm.length > 0 && (
                            <div className="absolute left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#EAE5DB] overflow-hidden transform origin-top-left transition-all">
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                                    {filteredTransactions.length > 0 && (
                                        <div className="px-3 pb-1 pt-2">
                                            <h4 className="text-[10px] uppercase font-bold text-[#8b795a] tracking-wider mb-2">Orders</h4>
                                            {filteredTransactions.slice(0, 3).map(order => (
                                                <Link key={order.id} href={`/store/orders`} className="flex items-center gap-3 p-2 hover:bg-[#FDFBF7] rounded-lg group">
                                                    <div className="w-8 h-8 rounded bg-[#f0f5ff] text-[#3a7bd5] flex items-center justify-center shrink-0">
                                                        <ShoppingBasketIcon size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1a1510] group-hover:text-[#3a7bd5]">Order #{order.id.substring(0,6)}</p>
                                                        <p className="text-xs text-[#8b795a]">{order.user?.name || 'Customer'}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {filteredProducts.length > 0 && (
                                        <div className="px-3 pb-1 pt-2 border-t border-[#EAE5DB]/40 mt-2">
                                            <h4 className="text-[10px] uppercase font-bold text-[#8b795a] tracking-wider mb-2">Products</h4>
                                            {filteredProducts.slice(0, 3).map(item => (
                                                <Link key={item.product.id} href={`/store/manage-product`} className="flex items-center gap-3 p-2 hover:bg-[#FDFBF7] rounded-lg group">
                                                    <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-[#EAE5DB]">
                                                        <Image src={item.product.images[0] || '/placeholder.png'} alt={item.product.name} width={32} height={32} className="object-cover w-full h-full" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1a1510] group-hover:text-[#8b795a] truncate w-48">{item.product.name}</p>
                                                        <p className="text-xs text-[#8b795a]">Sold: {item.totalSold}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {filteredTransactions.length === 0 && filteredProducts.length === 0 && (
                                        <div className="p-6 text-center text-sm text-[#8b795a]">
                                            No results found for "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative" ref={notificationsRef}>
                        <button 
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) setHasUnread(false);
                            }}
                            className="p-2.5 rounded-xl border border-[#EAE5DB] bg-white text-[#8b795a] hover:bg-[#FDFBF7] flex items-center justify-center"
                        >
                            <div className="relative">
                                <BellIcon size={18} />
                                {hasUnread && notifications.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                            </div>
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-[360px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#EAE5DB] z-50 overflow-hidden transform origin-top-right transition-all">
                                <div className="p-4 bg-[#2C241B] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/denim_plaid_texture.png')" }}>
                                    <div className="absolute top-0 left-0 right-0 h-1 opacity-20" style={{ background: "radial-gradient(circle at 5px 0, transparent 5px, white 6px) repeat-x", backgroundSize: "10px 10px" }}></div>
                                    <h3 className="text-sm font-bold text-white tracking-tight relative z-10">Recent Activity</h3>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar divide-y divide-[#EAE5DB]/40">
                                    {notifications.map((n, i) => (
                                        <Link href={n.link} key={i} className="flex gap-4 p-4 hover:bg-[#FDFBF7] transition-colors cursor-pointer group block">
                                            <div className="mt-0.5 shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-[#EAE5DB] bg-white relative">
                                                <Image src={n.image} alt="Product" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-sm text-[#1a1510] font-bold group-hover:text-[#8b795a] transition-colors">{n.text}</p>
                                                    <p className="text-[10px] text-[#8b795a] mt-1 font-semibold uppercase tracking-wider shrink-0">{timeAgo(n.date)}</p>
                                                </div>
                                                <p className="text-xs text-[#4A3F35] mt-0.5">{n.detail}</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {notifications.length === 0 && (
                                        <div className="p-8 text-center text-sm text-[#8b795a] font-medium">No recent activity</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full flex flex-col gap-8">
                
                {/* View Filters - Instant Client-side switching */}
                <div className="flex items-center gap-8 border-b border-[#EAE5DB] pb-1">
                    <span className="text-sm font-bold flex items-center gap-1">Select Views <ChevronDown size={14}/></span>
                    <div className="flex gap-6">
                        <button onClick={() => setView('daily')} className={`text-sm pb-2 ${view === 'daily' ? 'font-bold text-[#1a1510] border-b-2 border-[#1a1510]' : 'text-[#8b795a] hover:text-[#1a1510]'}`}>Last 24 Hours</button>
                        <button onClick={() => setView('monthly')} className={`text-sm pb-2 ${view === 'monthly' ? 'font-bold text-[#1a1510] border-b-2 border-[#1a1510]' : 'text-[#8b795a] hover:text-[#1a1510]'}`}>Monthly View</button>
                        <button onClick={() => setView('yearly')} className={`text-sm pb-2 ${view === 'yearly' ? 'font-bold text-[#1a1510] border-b-2 border-[#1a1510]' : 'text-[#8b795a] hover:text-[#1a1510]'}`}>Yearly View</button>
                    </div>
                </div>

                {/* Metric Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardCardsData.map((card, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center ${card.iconColor}`}>
                                    <card.icon size={16} strokeWidth={2} />
                                </div>
                                <span className="text-sm font-bold text-[#1a1510]">{card.title}</span>
                            </div>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-3xl font-bold tracking-tight text-[#1a1510]">{card.value}</span>
                                <span className={`text-[11px] font-bold flex items-center gap-1 mb-1 ${index === 1 ? 'text-[#d33a3a]' : 'text-[#1f5c35]'}`}>
                                    {index === 1 ? '↓ 0.4%' : '↑ 12%'} vs last period
                                </span>
                            </div>
                            <div className="pt-4 border-t border-[#EAE5DB]/50">
                                <p className="text-[10px] text-[#8b795a] uppercase tracking-wider font-semibold">Active Period Data</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart & Side Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sales Performance Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-bold">Sales Performance</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex gap-3 text-[11px] font-bold text-[#8b795a]">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1a1510]"></span> Revenue</span>
                                </div>
                            </div>
                        </div>
                        <SalesChart data={dashboardData.salesData} />
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold">Customer Overview</h2>
                            </div>
                            <div className="w-full aspect-[4/3] bg-[#FDFBF7] rounded-xl border border-[#EAE5DB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>
                                 <div className="relative z-10 text-center">
                                     <UsersIcon size={40} className="text-[#8b795a] mx-auto mb-4 opacity-50" />
                                     <p className="text-sm text-[#8b795a] font-bold uppercase tracking-widest mb-1">Total Unique Buyers</p>
                                     <b className="text-4xl font-serif text-[#1a1510]">{dashboardData.totalCustomers.toLocaleString()}</b>
                                 </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between items-end">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs font-bold text-[#8b795a] mb-2">
                                    <span>Conversion Goal</span>
                                    <span>82%</span>
                                </div>
                                <div className="w-full h-2 bg-[#EAE5DB] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#1a1510] w-[82%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Transactions */}
                    <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Recent Transactions</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#EAE5DB] text-[#8b795a] text-xs uppercase tracking-wider">
                                        <th className="pb-3 font-semibold w-1/4">Customer</th>
                                        <th className="pb-3 font-semibold w-1/3">First Item</th>
                                        <th className="pb-3 font-semibold w-1/4">Date</th>
                                        <th className="pb-3 font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAE5DB]/50">
                                    {filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-[#8b795a]">No transactions found.</td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((order, i) => (
                                            <tr key={i} className="hover:bg-[#FDFBF7] transition-colors group">
                                                <td className="py-4 font-bold text-[#1a1510]">
                                                    {order.user?.name ? (order.user.name.split(' ')[0] + '...') : `#${order.id.substring(0,6)}`}
                                                </td>
                                                <td className="py-4 text-[#4A3F35] truncate max-w-[150px]">
                                                    {order.orderItems[0]?.product?.name || "Multiple items"}
                                                </td>
                                                <td className="py-4 text-[#8b795a] font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-bold text-[#1a1510]">{currency}{order.total.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Top Products</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#EAE5DB] text-[#8b795a] text-xs uppercase tracking-wider">
                                        <th className="pb-3 font-semibold">Product Info</th>
                                        <th className="pb-3 font-semibold">Price</th>
                                        <th className="pb-3 font-semibold">Sold</th>
                                        <th className="pb-3 font-semibold">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EAE5DB]/50">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-[#8b795a]">No products found.</td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((item, i) => (
                                            <tr key={i} className="hover:bg-[#FDFBF7] transition-colors">
                                                <td className="py-3 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded border border-[#EAE5DB] overflow-hidden bg-white shrink-0">
                                                        <Image src={item.product.images[0] || '/placeholder.png'} alt={item.product.name} width={40} height={40} className="object-cover w-full h-full" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#1a1510] truncate max-w-[150px]">{item.product.name}</span>
                                                        <span className="text-[10px] text-[#8b795a] uppercase">ID: {item.product.id.substring(0,8)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 font-medium text-[#4A3F35]">
                                                    {currency}{item.product.price}
                                                </td>
                                                <td className="py-3 font-medium text-[#1a1510]">
                                                    {item.totalSold}
                                                </td>
                                                <td className="py-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#e8f3ec] text-[#1f5c35] text-[10px] font-bold tracking-wider">
                                                        {currency}{item.revenue.toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
