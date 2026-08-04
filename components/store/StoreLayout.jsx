'use client'
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SellerNavbar from "./StoreNavbar"
import FloatingAssistant from "@/components/FloatingAssistant"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import SellerSidebar from "./StoreSidebar"
import { getLoggedInStoreId, supplierLogin, getStoreById } from "@/actions/supplier"
import { supabase } from "@/lib/supabaseClient"
import prisma from "@/lib/prisma"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const StoreLayout = ({ children }) => {
    const router = useRouter()
    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)
    
    // Login form state
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const fetchIsSeller = async () => {
        try {
            const sid = await getLoggedInStoreId()
            if (sid) {
                setIsSeller(true)
                const store = await getStoreById(sid)
                if (store) {
                    setStoreInfo(store)
                } else {
                    setStoreInfo({ name: "Your Store", logo: "/shop icon.png" })
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoggingIn(true)
        
        // Admin Universal Bypass
        if (username === 'paramjitbaral44@gmail.com') {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: username,
                    password: password
                })
                
                if (data?.user) {
                    toast.success("Welcome back, Admin!")
                    router.push('/admin')
                    router.refresh()
                    return
                } else {
                    toast.error("Invalid Admin Credentials")
                    setIsLoggingIn(false)
                    return
                }
            } catch (err) {
                console.error(err)
            }
        }

        try {
            const res = await supplierLogin(username, password)
            if (res.success) {
                toast.success("Welcome back!")
                setIsSeller(true)
                setStoreInfo(res.store)
                router.refresh() // Force Next.js to reload the layout and fetch authenticated data
            } else {
                toast.error(res.error || "Login failed")
            }
        } catch (error) {
            toast.error("An error occurred during login")
        } finally {
            setIsLoggingIn(false)
        }
    }

    return loading ? (
        <Loading />
    ) : isSeller ? (
        <div className="flex flex-col h-screen bg-[#FDFBF7] overflow-hidden">
            <SellerNavbar />
            <div className="flex flex-col sm:flex-row flex-1 h-[calc(100vh-80px)] overflow-hidden relative z-10">
                <div className="order-2 sm:order-1 z-50 w-full sm:w-auto">
                    <SellerSidebar storeInfo={storeInfo} />
                </div>
                <div className="order-1 sm:order-2 flex-1 h-full w-full overflow-y-auto relative z-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')", backgroundRepeat: "repeat", backgroundSize: "600px" }}></div>
                    <div className="relative z-10 p-6 lg:p-8 min-h-full flex flex-col">
                        {children}
                    </div>
                </div>
            </div>
            <FloatingAssistant role="supplier" />
        </div>
    ) : (
        <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-[#1E1914] overflow-y-auto md:overflow-hidden">
            
            {/* Left Side - Brand Focus (Hidden on Mobile) */}
            <div className="hidden md:flex relative w-full md:w-1/2 bg-[#14100c] flex-col justify-center md:justify-between p-8 lg:p-16 shadow-[0_10px_30px_rgba(0,0,0,0.8)] md:shadow-[15px_0_40px_rgba(0,0,0,0.8)] z-20 min-h-[30vh] md:h-full gap-8 md:gap-0">
                <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                    <Image src="/newsletter_fabric.png" alt="Fabric" fill className="object-cover" />
                </div>
                
                {/* Top Logo */}
                <div className="relative z-10">
                    <Link href="/" className="relative flex items-center gap-3 mt-4 inline-flex">
                        <div className="relative w-[40px] h-[40px]">
                            <Image src="/anantin%20logo.png" alt="Anantin Logo" fill className="object-contain" />
                        </div>
                        <div className="relative text-4xl font-semibold text-[#FDFBF7]">
                            <span className="text-[#a69d8b]">anan</span>tin<span className="text-[#D4B26F] text-5xl leading-0">.</span>
                            <p className="absolute text-[8px] font-bold uppercase -top-1 -right-[50px] px-2.5 py-0.5 rounded-full flex items-center gap-2 text-[#2c3e50] bg-[#D4B26F]">
                                VENDOR
                            </p>
                        </div>
                    </Link>
                </div>
                
                {/* Bottom Content & Footer */}
                <div className="relative z-10 flex flex-col">
                    <h1 className="text-4xl lg:text-5xl font-serif font-semibold text-[#EAE5DB] leading-[1.1] mb-5">
                        Elevate<br />Your Craft.
                    </h1>
                    <p className="text-[#b8b0a1] font-serif text-[15px] max-w-[340px] leading-relaxed mb-12">
                        The exclusive hub for premium textile creators. Manage your collections, process orders, and grow your global presence.
                    </p>
                    
                    <p className="text-[#8b795a] text-[10px] font-serif uppercase tracking-[0.2em] mb-2">© 2026 Anantin Luxe</p>
                </div>
            </div>
            
            {/* Right Side - Artistic Container Frame */}
            <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 py-12 bg-[#F4EFE6] z-10 min-h-[70vh] md:h-full">
                <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'url("/newsletter_fabric.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />
                
                {/* Mobile Header Logo (Since left side is hidden) */}
                <div className="md:hidden relative z-10 flex items-center justify-center gap-2 mb-8 mt-2">
                    <div className="relative w-[35px] h-[35px]">
                        <Image src="/anantin%20logo.png" alt="Anantin Logo" fill className="object-contain" />
                    </div>
                    <div className="relative text-3xl font-semibold text-[#1E1914]">
                        <span className="text-[#8b795a]">anan</span>tin<span className="text-[#D4B26F] text-4xl leading-0">.</span>
                        <p className="absolute text-[7px] font-bold uppercase -top-1 -right-[40px] px-2 py-0.5 rounded-full flex items-center gap-1 text-[#FDFBF7] bg-[#1E1914]">
                            VENDOR
                        </p>
                    </div>
                </div>
                
                {/* Outer Dark Frame */}
                <div className="relative z-10 w-full max-w-[400px] rounded-sm p-[3.5px] bg-[#1E1914] shadow-[0_25px_60px_rgba(0,0,0,0.3)] my-auto">
                    {/* Gold Inner Trim */}
                    <div className="relative w-full border-[2px] border-[#D4B26F] rounded-sm bg-[#FDFBF7] flex flex-col items-center">
                        
                        {/* Elegant Plaid Texture */}
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-sm">
                            <Image src="/plaid_texture.png" alt="Plaid Texture" fill className="object-cover opacity-100 z-0 scale-[1.03]" />
                            <div className="absolute inset-0 bg-[#1E1914]/50 mix-blend-multiply z-10"></div>
                            <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.5)] z-20 pointer-events-none" />
                        </div>
                        
                        {/* Inner Content Wrapper */}
                        <div className="relative z-10 w-full flex flex-col items-center pt-8 pb-5">
                            
                            {/* Inner form card */}
                            <div className="relative z-20 w-[85%] bg-[#FDFBF7] shadow-[0px_10px_25px_rgba(0,0,0,0.4)] p-[2.5px] mt-10 mb-4">
                                
                                {/* Top Icon Badge */}
                                <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-30 w-[90px] h-[90px] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center bg-transparent">
                                    <div className="relative w-full h-full border-[3px] border-[#1E1914] rounded-full overflow-hidden flex items-center justify-center bg-[#FDFBF7]">
                                        <Image src="/shop icon.png" alt="Icon" fill className="object-cover scale-[1.15] mix-blend-multiply" />
                                    </div>
                                </div>
                                
                                {/* Stitched Border */}
                                <div className="w-full h-full border-[2px] border-dashed border-[#bda27e] p-6 pt-10 flex flex-col items-center">
                                    
                                    <div className="text-center w-full mb-6 mt-2">
                                        <h2 className="text-[34px] font-serif font-bold text-[#8b6b3d] leading-none mb-2 tracking-tight" style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #FDFBF7, 1px 2px 3px rgba(0,0,0,0.1)' }}>
                                            Vendor Access
                                        </h2>
                                        <p className="text-[13px] font-serif text-[#2C241B] mt-1.5 font-medium">
                                            Log in to your Anantin Luxe account
                                        </p>
                                    </div>
                                    
                                    <form onSubmit={handleLogin} className="w-full space-y-4">
                                        <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#EAE5DB] border-[2px] border-[#D4C3A3] rounded-md py-3 px-4 text-[13.5px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        
                                        <div className="relative w-full">
                                            <input type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#EAE5DB] border-[2px] border-[#D4C3A3] rounded-md py-3 px-4 pr-10 text-[13.5px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b795a] hover:text-[#2C241B] focus:outline-none"
                                            >
                                                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                            </button>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-[12.5px] font-serif text-[#2C241B] pt-1 mb-2">
                                            <label className="flex items-center gap-2 cursor-pointer font-medium group">
                                                <div className="w-[15px] h-[15px] bg-[#EAE5DB] border border-[#bda27e] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-[#8b6b3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                Remember me
                                            </label>
                                            <Link href="#" className="text-[#8b6b3d] hover:underline font-bold">Forgot Password?</Link>
                                        </div>
                                        
                                        <button type="submit" disabled={isLoggingIn} className="w-full mx-auto block relative p-[3px] bg-[#1E1914] rounded-full shadow-[0_5px_12px_rgba(0,0,0,0.4)] overflow-hidden active:scale-95 transition-transform group">
                                            <div className="w-full h-full border-[1.5px] border-dashed border-[#FDFBF7]/60 rounded-full py-3 flex items-center justify-center relative overflow-hidden transition-colors">
                                                <div className="absolute inset-0 z-0">
                                                    <Image src="/plaid_texture.png" alt="Plaid Texture" fill className="object-cover opacity-90 z-0 scale-125 mix-blend-multiply" />
                                                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply z-10"></div>
                                                </div>
                                                <span className="relative z-10 text-[14.5px] font-serif font-bold text-[#FDFBF7] tracking-widest uppercase drop-shadow-md">
                                                    {isLoggingIn ? "Logging in..." : "Log In"}
                                                </span>
                                            </div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            {/* Pill button inside the container */}
                            <div className="relative z-20 text-center mt-3 mb-2">
                                <div className="bg-[#EAE5DB] px-6 py-2 rounded-full shadow-[0_5px_12px_rgba(0,0,0,0.3)] border border-[#cbbca3] inline-block">
                                    <span className="text-[12.5px] font-serif text-[#2C241B] font-medium">Don't have an account? <Link href="/create-store" className="text-[#8b6b3d] font-bold hover:underline">Sign Up</Link></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreLayout