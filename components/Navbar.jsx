'use client'
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/lib/supabaseClient";

const Navbar = () => {

    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const [user, setUser] = useState(null)

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isHomePage = window.location.pathname === '/';
            const threshold = isHomePage ? window.innerHeight * 3 - 80 : 40;
            setIsScrolled(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        // Check for logged in user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        setUser(null);
        router.refresh(); // Refresh to clear state in other components if needed
    }

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    // Determine if text should be light based on scroll state or if we are on the home page hero section
    const isLightText = isScrolled || isHome;

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#2C241B]/90 backdrop-blur-md border-b border-[#3F332A]/30 shadow-lg' : 'bg-transparent'}`}>
            <div className="mx-6">
                <div className={`flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>

                    <Link href="/" className="relative flex items-center gap-3">
                        <div className="relative w-[40px] h-[40px]">
                            <Image src="/anantin%20logo.png" alt="Anantin Logo" fill sizes="60px" className="object-contain transition-all duration-300" />
                        </div>
                        {/* Made logo font-bold instead of semibold to pop more */}
                        <div className={`relative text-4xl font-bold transition-colors duration-300 ${isLightText ? 'text-[#FDFBF7]' : 'text-[#2C241B]'}`}>
                            <span className={`${isScrolled ? 'text-[#D4B26F]' : 'text-[#2C241B]'}`}>anan</span>tin<span className="text-[#D4B26F] text-5xl leading-0">.</span>
                            <p className={`absolute text-[8px] font-bold uppercase -top-1 -right-9 px-2.5 py-0.5 rounded-full flex items-center gap-2 transition-colors duration-300 ${isLightText ? 'text-[#2C241B] bg-[#D4B26F]' : 'text-[#FAF8F5] bg-[#2C241B]'}`}>
                                LUXE
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={`hidden lg:flex items-center gap-4 lg:gap-8 transition-colors duration-300 ${isLightText ? 'text-[#FDFBF7] drop-shadow-sm' : 'text-[#2C241B]'}`}>
                        <Link href="/" className={`transition tracking-widest uppercase text-[13px] font-extrabold ${isLightText ? 'hover:text-[#D4B26F]' : 'hover:text-black'}`}>Home</Link>
                        <Link href="/shop" className={`transition tracking-widest uppercase text-[13px] font-extrabold ${isLightText ? 'hover:text-[#D4B26F]' : 'hover:text-black'}`}>Shop</Link>
                        <Link href="/about" className={`transition tracking-widest uppercase text-[13px] font-extrabold ${isLightText ? 'hover:text-[#D4B26F]' : 'hover:text-black'}`}>About</Link>
                        <Link href="/contact" className={`transition tracking-widest uppercase text-[13px] font-extrabold ${isLightText ? 'hover:text-[#D4B26F]' : 'hover:text-black'}`}>Contact</Link>
                        
                        <form onSubmit={handleSearch} className={`hidden xl:flex items-center w-xs text-sm gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${isLightText ? 'bg-[#1E1914]/80 border-[#D4B26F]/30 backdrop-blur-sm' : 'bg-[#2C241B]/10 border-[#2C241B]/20'}`}>
                            <Search size={16} className={`transition-colors duration-300 ${isLightText ? 'text-[#D4B26F]' : 'text-[#2C241B]'}`} />
                            <input className={`w-full bg-transparent outline-none text-xs transition-colors duration-300 ${isLightText ? 'placeholder-[#8C8A85] text-[#FDFBF7]' : 'placeholder-[#2C241B]/60 text-[#2C241B]'}`} type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className={`relative flex items-center gap-2 transition-colors duration-300 ${isLightText ? 'text-[#FDFBF7] hover:text-[#D4B26F]' : 'text-[#2C241B] hover:text-black'}`}>
                            <ShoppingCart size={16} />
                            <span className="tracking-widest uppercase text-[13px] font-extrabold">Cart</span>
                            <button className={`absolute -top-1 left-2.5 text-[8px] font-bold size-3.5 rounded-full transition-all duration-300 ${isLightText ? 'text-[#2C241B] bg-[#D4B26F]' : 'text-[#FAF8F5] bg-[#2C241B]'}`}>{cartCount}</button>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer ${isLightText ? 'bg-[#1E1914]/80 border-[#D4B26F]/30 backdrop-blur-sm text-[#FDFBF7]' : 'bg-[#2C241B]/10 border-[#2C241B]/20 text-[#2C241B]'}`}>
                                    <User size={16} className={isLightText ? 'text-[#D4B26F]' : 'text-[#2C241B]'} />
                                    <span className="text-xs font-bold tracking-wider">
                                        {user.name ? user.name.split(' ')[0] : (user.user_metadata?.name || user.user_metadata?.full_name)?.split(' ')[0] || 'Profile'}
                                    </span>
                                </Link>
                                <button onClick={handleLogout} className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${isLightText ? 'bg-[#D4B26F] hover:bg-red-600 hover:text-white text-[#1E1914]' : 'bg-[#2C241B] hover:bg-red-600 hover:text-white text-white'}`}>
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => router.push('/login')} className={`px-7 py-2.5 transition tracking-widest uppercase text-[13px] font-extrabold rounded-full duration-300 shadow-md ${isLightText ? 'bg-[#D4B26F] hover:bg-[#C3A160] text-[#1E1914]' : 'bg-[#2C241B] hover:bg-[#1E1914] text-white'}`}>
                                Login
                            </button>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        {user ? (
                            <button onClick={handleLogout} className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${isLightText ? 'bg-[#D4B26F] hover:bg-red-600 hover:text-white text-[#1E1914]' : 'bg-[#2C241B] hover:bg-red-600 hover:text-white text-white'}`}>
                                <LogOut size={16} />
                            </button>
                        ) : (
                            <button onClick={() => router.push('/login')} className={`px-6 py-2 transition tracking-widest uppercase text-xs font-bold rounded-full duration-300 ${isLightText ? 'bg-[#D4B26F] hover:bg-[#C3A160] text-[#1E1914]' : 'bg-[#2C241B] hover:bg-[#1E1914] text-white'}`}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar