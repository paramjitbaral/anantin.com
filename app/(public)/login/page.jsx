'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            // Use Supabase Auth to securely log in
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error

            if (data.user) {
                // Bypass for specific admin email
                if (data.user.email === 'paramjitbaral44@gmail.com') {
                    toast.success('Welcome back, Admin!')
                    router.push('/admin')
                    return
                }

                // Fetch their custom user profile to get their role, name, etc.
                const { data: userProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                toast.success('Welcome back to Anantin.')
                
                // Combine auth data with profile data for the session
                const sessionData = { ...data.user, ...userProfile }
                localStorage.setItem('user', JSON.stringify(sessionData))
                
                router.push('/')
            }
        } catch (error) {
            toast.error(error.message || 'Failed to login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen w-full flex bg-[#F4EFE6] overflow-hidden">

            {/* Left Half: Onboarding Screen */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-8 lg:p-16 bg-[#2c3e50] shadow-[10px_0_30px_rgba(0,0,0,0.3)] z-20 h-full">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/newsletter_fabric.png"
                        alt="Fabric Background"
                        fill
                        className="object-cover opacity-30 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a252f] via-[#1a252f]/40 to-transparent opacity-90" />
                </div>

                {/* Top Logo */}
                <div className="relative z-10">
                    <Link href="/" className="relative flex items-center gap-3 mt-4 inline-flex">
                        <div className="relative w-[40px] h-[40px]">
                            <Image src="/anantin%20logo.png" alt="Anantin Logo" fill className="object-contain" />
                        </div>
                        <div className="relative text-4xl font-semibold text-[#FDFBF7]">
                            <span className="text-[#a69d8b]">anan</span>tin<span className="text-[#D4B26F] text-5xl leading-0">.</span>
                            <p className="absolute text-[8px] font-bold uppercase -top-1 -right-9 px-2.5 py-0.5 rounded-full flex items-center gap-2 text-[#2c3e50] bg-[#D4B26F]">
                                LUXE
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Bottom Content & Footer */}
                <div className="relative z-10 flex flex-col">
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#FDFBF7] leading-[1.1] mb-5">
                        Discover<br />Premium Textiles.
                    </h2>
                    <p className="text-[#EAE0D5]/80 font-serif text-[15px] max-w-[340px] leading-relaxed mb-12">
                        Join the most exclusive B2B collective connecting top fashion brands with world-class textile mills worldwide.
                    </p>
                    
                    <p className="text-[#8b795a] text-[10px] font-serif uppercase tracking-[0.2em] mb-2">© 2026 Anantin Luxe</p>
                </div>
            </div>

            {/* Right Half: Login Form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative bg-[#F4EFE6] px-4 py-8 z-10">
                {/* Skip Button */}
                <Link href="/" className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-1.5 text-[12px] uppercase tracking-wider font-serif font-bold text-[#8b6b3d] hover:text-[#2c3e50] transition-colors z-50 group">
                    Skip
                    <svg className="transform group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>

                {/* Very faint tiled background texture */}
                <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'url("/newsletter_fabric.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />

                {/* Outer Frame (Dark Blue/Grey denim style) */}
                <div className="relative z-10 w-full max-w-[420px] rounded-sm border-[6px] border-[#2c3e50] shadow-2xl p-0.5 bg-[#2c3e50]">
                    {/* Gold Inner Trim of Outer Frame */}
                    <div className="w-full h-full border-[2px] border-[#c5a059] relative rounded-sm flex items-center justify-center bg-[#F4EFE6]">

                        {/* Swirling Fabrics Background */}
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-sm">
                            <Image
                                src="/swirling_fabrics.png"
                                alt="Fabric Mosaic Background"
                                fill
                                className="object-cover object-center scale-110 opacity-90"
                            />
                            {/* Shadow overlay to give depth to the swirl edges */}
                            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] z-10 pointer-events-none" />
                        </div>

                        {/* Inner Content Wrapper */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8 pb-4">

                            {/* Inner Leather/Canvas Card */}
                            <div className="relative z-20 w-[85%] bg-[#F4EFE6] shadow-[0px_10px_20px_rgba(0,0,0,0.6)] p-0.5 mt-12 mb-4">

                                {/* Top Logo Badge (Positioned over the card) */}
                                <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-30 w-[90px] h-[90px] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.6)] flex items-center justify-center bg-transparent">
                                    <div className="relative w-full h-full border-[2px] border-[#2c3e50] rounded-full overflow-hidden flex items-center justify-center bg-[#F4EFE6]">
                                        <Image src="/anantin%20logo.png" alt="Anantin Logo" fill className="object-cover scale-[1.05] -translate-x-[1px] -translate-y-[1px]" />
                                    </div>
                                </div>

                                {/* Stitched Border */}
                                <div className="w-full h-full border-2 border-dashed border-[#b8b0a1] p-6 pt-10 flex flex-col items-center">

                                    {/* Header */}
                                    <div className="text-center mt-2 mb-6 w-full">
                                        <h1
                                            className="text-3xl font-serif font-semibold text-[#b8944f]"
                                            style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #7a5e30, 1px 2px 3px rgba(0,0,0,0.3)' }}
                                        >
                                            Welcome Back
                                        </h1>
                                        <p className="text-[13px] font-serif text-[#2C241B] mt-2">
                                            Log in to your Textile Collective account
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                                        {/* Email Input */}
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-[#EAE5DB] border-2 border-[#bda27e] rounded-md py-2.5 px-4 text-[13px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]"
                                                placeholder="Email or Phone"
                                            />
                                        </div>

                                        {/* Password Input */}
                                        <div className="relative w-full">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-[#EAE5DB] border-2 border-[#bda27e] rounded-md py-2.5 px-4 pr-10 text-[13px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]"
                                                placeholder="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b795a] hover:text-[#2C241B] focus:outline-none"
                                            >
                                                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                            </button>
                                        </div>

                                        {/* Options */}
                                        <div className="flex items-center justify-between w-full mt-1 mb-3">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <div className="w-4 h-4 bg-[#EAE5DB] border border-[#bda27e] rounded-sm shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_1px_rgba(255,255,255,0.5)] flex items-center justify-center">
                                                    {/* Simulated custom checkbox */}
                                                </div>
                                                <span className="text-[12px] font-serif text-[#2C241B]">
                                                    Remember me
                                                </span>
                                            </label>
                                            <Link href="#" className="text-[12px] font-serif text-[#8b6b3d] hover:underline underline-offset-2">
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full relative p-[3px] bg-[#2c3e50] rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5)] transition-transform active:scale-95"
                                        >
                                            <div
                                                className="w-full h-full border-[1.5px] border-dashed border-[#c5a059] rounded-full py-2.5 flex items-center justify-center relative overflow-hidden"
                                            >
                                                {/* Plaid Texture */}
                                                <div className="absolute inset-0 z-0">
                                                    <Image
                                                        src="/plaid_texture.png"
                                                        alt="Plaid Background"
                                                        fill
                                                        className="object-cover opacity-90 scale-125 mix-blend-multiply"
                                                    />
                                                    <div className="absolute inset-0 bg-[#8b6b3d]/20" />
                                                </div>
                                                {/* Text */}
                                                <span
                                                    className="relative z-10 text-[14px] font-serif font-bold text-[#f0dfaa] tracking-widest"
                                                    style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.4), -1px -1px 0px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)' }}
                                                >
                                                    {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                                                </span>
                                            </div>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Footer (outside card, inside frame) */}
                            <div className="relative z-20 text-center mt-2 mb-2">
                                <div className="bg-[#F4EFE6] px-5 py-1.5 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.4)] border border-[#c5a059]/50 inline-block">
                                    <p className="text-[12px] font-serif text-[#2C241B]">
                                        Don't have an account?{' '}
                                        <Link href="/signup" className="text-[#8b6b3d] hover:underline font-bold">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
