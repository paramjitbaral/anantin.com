'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { getUserOrders, getUserAddresses, addAddress } from "@/actions/user";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    const fetchData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const parsedUser = JSON.parse(userStr);
                setUser(parsedUser);
                const [ordersData, addressesData] = await Promise.all([
                    getUserOrders(parsedUser.id),
                    getUserAddresses(parsedUser.id)
                ]);
                setOrders(ordersData);
                setAddresses(addressesData);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error("Error loading profile data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.success("Logged out");
        router.push('/login');
    }

    if (loading) return <Loading />
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pt-10 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Left Sidebar (Profile + Navigation) */}
                    <div className="w-full lg:w-[320px] flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-[#EAE5DB] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                            
                            {/* Top Half: Profile Details */}
                            <div className="relative pt-28 pb-8 px-6 text-center border-b border-[#EAE5DB] bg-gradient-to-b from-[#FAF8F5] to-white">
                                {/* Decorative Header Background */}
                                <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden border-b border-[#EAE5DB]">
                                    {/* Denim Plaid Texture */}
                                    <div className="absolute inset-0" style={{ backgroundImage: 'url("/denim_plaid_texture.png")', backgroundSize: '150px' }} />
                                    {/* Solid Black Transparent Sheet + Fade on top */}
                                    <div className="absolute inset-0 bg-black/60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90" />
                                    
                                    {/* Avatar Centered Inside Fabric Area */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-20 h-20 rounded-full border-[3px] border-white bg-white shadow-xl flex items-center justify-center text-3xl font-serif text-[#B8944F] overflow-hidden">
                                            <div className="absolute inset-1 rounded-full border border-[#EAE5DB]" />
                                            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("/denim_plaid_texture.png")', backgroundSize: '40px' }} />
                                            <span className="relative z-10">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h1 className="text-2xl font-serif text-[#1A1613]">
                                        {user.name || (user.email ? user.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Esteemed Guest')}
                                    </h1>
                                    <p className="text-sm font-mono tracking-widest text-[#7A7265] mt-1">{user.email}</p>
                                    <div className="inline-flex items-center justify-center gap-2 mt-4 px-3 py-1 bg-[#FAF8F5] border border-[#EAE5DB] rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8944F]" />
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1613]">Verified Account</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom Half: Navigation */}
                            <nav className="p-4 flex flex-col gap-1">
                                <button 
                                    onClick={() => setActiveTab('orders')} 
                                    className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${activeTab === 'orders' ? 'bg-[#2A2520] text-white shadow-md' : 'text-[#5A5245] hover:bg-[#FAF8F5]'}`}
                                >
                                    {activeTab === 'orders' && <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: 'url("/denim_plaid_texture.png")', backgroundSize: '250px' }} />}
                                    <div className="relative z-10 flex items-center gap-4 w-full">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                        <span className="text-sm font-medium tracking-wide">Order History</span>
                                        {activeTab === 'orders' && <div className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#B8944F]" />}
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab('addresses')} 
                                    className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${activeTab === 'addresses' ? 'bg-[#2A2520] text-white shadow-md' : 'text-[#5A5245] hover:bg-[#FAF8F5]'}`}
                                >
                                    {activeTab === 'addresses' && <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: 'url("/denim_plaid_texture.png")', backgroundSize: '250px' }} />}
                                    <div className="relative z-10 flex items-center gap-4 w-full">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        <span className="text-sm font-medium tracking-wide">Saved Addresses</span>
                                        {activeTab === 'addresses' && <div className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#B8944F]" />}
                                    </div>
                                </button>
                                
                                <div className="h-px bg-[#EAE5DB] my-2 mx-4" />
                                
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    <span className="text-sm font-medium tracking-wide">Sign Out</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Right Display Area */}
                    <div className="flex-1">
                        
                        {activeTab === 'orders' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="bg-white rounded-2xl border border-[#EAE5DB] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                                    <div className="p-8 border-b border-[#EAE5DB]">
                                        <h2 className="text-2xl font-serif text-[#1A1613]">Order History</h2>
                                        <p className="text-sm text-[#7A7265] mt-1">Review and manage your past purchases.</p>
                                    </div>
                                    
                                    {orders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#7A7265] bg-[#FAF8F5] border-b border-[#EAE5DB]">
                                                    <tr>
                                                        <th className="px-8 py-5">Product Details</th>
                                                        <th className="px-8 py-5 text-center">Amount</th>
                                                        <th className="px-8 py-5 text-left">Delivery</th>
                                                        <th className="px-8 py-5 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#EAE5DB]">
                                                    {orders.map((order) => (
                                                        <OrderItem order={order} key={order.id} onReviewSuccess={fetchData} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-dashed border-[#D0C8B8] flex items-center justify-center text-[#B8944F] mb-6">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                            </div>
                                            <h3 className="text-xl font-serif text-[#1A1613] mb-2">No purchases found</h3>
                                            <p className="text-sm text-[#7A7265] mb-8 max-w-md">You haven't placed any orders yet. Discover our premium collections to get started.</p>
                                            
                                            <button
                                                onClick={() => router.push('/shop')}
                                                className="px-8 py-3.5 bg-[#1A1613] rounded-full text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#B8944F] transition-all duration-300 shadow-md"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="bg-white rounded-2xl border border-[#EAE5DB] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                                    <div className="p-8 border-b border-[#EAE5DB] flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-serif text-[#1A1613]">Saved Addresses</h2>
                                            <p className="text-sm text-[#7A7265] mt-1">Manage your delivery locations.</p>
                                        </div>
                                    </div>
                                    
                                    {addresses.length > 0 ? (
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5]">
                                            {addresses.map((address) => (
                                                <div key={address.id} className="bg-white border border-[#EAE5DB] rounded-xl p-6 shadow-sm hover:border-[#B8944F] transition-all duration-300">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="font-serif text-lg text-[#1A1613] font-semibold">{address.name}</h3>
                                                        <span className="px-2 py-1 bg-[#1A1613] text-white rounded text-[9px] font-bold uppercase tracking-widest">Primary</span>
                                                    </div>
                                                    
                                                    <div className="text-sm text-[#5A5245] space-y-1 mb-6 font-mono">
                                                        <p>{address.street}</p>
                                                        <p>{address.city}, {address.state} {address.zip}</p>
                                                        <p className="uppercase text-[10px] tracking-widest mt-2 font-bold text-[#1A1613]">{address.country}</p>
                                                    </div>
                                                    
                                                    <div className="pt-4 border-t border-dashed border-[#EAE5DB]">
                                                        <p className="text-[11px] text-[#7A7265] font-mono tracking-widest uppercase">
                                                            <span className="font-bold mr-2 text-[#1A1613]">Phone:</span>
                                                            {address.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-dashed border-[#D0C8B8] flex items-center justify-center text-[#B8944F] mb-6">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </div>
                                            <h3 className="text-xl font-serif text-[#1A1613] mb-2">No addresses saved</h3>
                                            <p className="text-sm text-[#7A7265] max-w-md">You haven't added any delivery addresses yet. They will appear here when you checkout.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
