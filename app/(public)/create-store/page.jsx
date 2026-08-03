'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { UploadCloud, Check, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { createStore, getDemoStoreId } from "@/actions/supplier"

export default function CreateStore() {
    const router = useRouter()
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        gst: "",
        address: "",
        image: null
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        try {
            const sid = await getDemoStoreId()
            if (sid) {
                setAlreadySubmitted(true)
                setStatus("approved")
                setMessage("You already have an active store!")
                setTimeout(() => {
                    router.push('/store')
                }, 3000)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // In a real app we would upload the image file to S3/Cloudinary here.
            // For now, we mock the logo URL.
            const submitData = {
                ...storeInfo,
                logo: storeInfo.image ? "https://via.placeholder.com/150" : "https://via.placeholder.com/150",
            }

            const res = await createStore(submitData)
            
            if (res.success) {
                setStatus("approved")
                setAlreadySubmitted(true)
                setMessage("Your application is under review by our curation team.")
                toast.success("Store application submitted!")
                
                setTimeout(() => {
                    router.push('/store')
                }, 5000)
            } else {
                toast.error(res.error || "Failed to submit application")
            }
        } catch (error) {
            toast.error("An error occurred during submission")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [router])

    return !loading ? (
        <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-8 lg:p-12 bg-[#F4EFE6] overflow-hidden">
            
            {/* Background Canvas Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'url("/newsletter_fabric.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />

            {!alreadySubmitted ? (
                /* The Artisan Canvas Card (Fabric Skeuomorphic) */
                <div className="relative z-10 w-full max-w-5xl rounded-sm border-[6px] border-[#1E1914] shadow-2xl p-0.5 bg-[#1E1914]">
                    {/* Gold Inner Trim */}
                    <div className="w-full h-full border-[2px] border-[#D4B26F] relative rounded-sm bg-[#F4EFE6]">
                        
                        {/* Fabric Texture Background for the Frame */}
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-sm">
                            <Image
                                src="/newsletter_fabric.png"
                                alt="Fabric Texture"
                                fill
                                className="object-cover object-center opacity-40 mix-blend-multiply pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-[#8b6b3d]/5 pointer-events-none" />
                        </div>

                        {/* Stitched Inner Card */}
                        <div className="relative z-10 w-full h-full p-2 mt-4">
                            <div className="w-full h-full border-2 border-dashed border-[#b8b0a1] p-8 lg:p-12 flex flex-col items-center bg-[#F4EFE6]/90 shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
                                
                                {/* Top Logo Badge */}
                                <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 z-30 w-[110px] h-[110px] drop-shadow-[0_5px_10px_rgba(0,0,0,0.4)]">
                                    <Image src="/shop%20icon.png" alt="Shop Icon" fill className="object-contain mix-blend-multiply" />
                                </div>

                                {/* Header */}
                                <div className="text-center mt-2 mb-6 w-full">
                                    <h1
                                        className="text-3xl font-serif font-semibold text-[#8b6b3d]"
                                        style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #c5a059, 1px 2px 3px rgba(0,0,0,0.1)' }}
                                    >
                                        The Artisan Collective
                                    </h1>
                                    <p className="text-[11px] font-serif font-bold text-[#2C241B] mt-2 uppercase tracking-[0.2em]">
                                        Apply for an exclusive seller account
                                    </p>
                                </div>

                                {/* Form - 3 Columns Horizontal Grid */}
                                <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                                    
                                    {/* Column 1: Logo & Submit (3/12) */}
                                    <div className="lg:col-span-3 flex flex-col items-center justify-center gap-5 h-full pt-1">
                                        <div className="flex flex-col items-center w-full">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest mb-3">Store Logo</label>
                                            <label className="cursor-pointer group flex flex-col items-center justify-center w-[100px] h-[100px] rounded-full border-[2px] border-dashed border-[#bda27e] bg-[#EAE5DB] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] hover:border-[#8b6b3d] transition-all relative overflow-hidden">
                                                {storeInfo.image ? (
                                                    <Image src={URL.createObjectURL(storeInfo.image)} className="object-cover w-full h-full" alt="Store Logo" width={100} height={100} />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-[#8b795a] group-hover:text-[#8b6b3d] transition-colors">
                                                        <UploadCloud size={20} className="mb-1" />
                                                        <span className="text-[8px] uppercase font-serif font-bold tracking-widest">Upload</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                                            </label>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="w-full relative p-[2px] bg-[#1E1914] rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.3)] transition-transform active:scale-95 mt-auto"
                                        >
                                            <div className="w-full h-full border-[1px] border-dashed border-[#D4B26F] rounded-sm py-2 flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute inset-0 z-0">
                                                    <Image
                                                        src="/swirling_fabrics.png"
                                                        alt="Fabric Texture"
                                                        fill
                                                        className="object-cover opacity-80 scale-125 mix-blend-multiply pointer-events-none"
                                                    />
                                                    <div className="absolute inset-0 bg-[#8b6b3d]/30 pointer-events-none" />
                                                </div>
                                                <span
                                                    className="relative z-10 text-[10px] font-serif font-bold text-[#f0dfaa] tracking-[0.15em] uppercase"
                                                    style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.2), -1px -1px 0px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,1)' }}
                                                >
                                                    Submit Form
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Column 2: Basic Info (5/12) */}
                                    <div className="lg:col-span-5 grid grid-cols-2 gap-x-4 gap-y-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Username</label>
                                            <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="e.g. silk_emporium" required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Store Name</label>
                                            <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="The Silk Emporium" required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Email</label>
                                            <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="store@example.com" required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Contact No.</label>
                                            <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="+1 (555) 000-0000" required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">GST Number</label>
                                            <input name="gst" onChange={onChangeHandler} value={storeInfo.gst} type="text" placeholder="e.g. 22AAAAA0000A1Z5" required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]" />
                                        </div>
                                    </div>

                                    {/* Column 3: Textareas (4/12) */}
                                    <div className="lg:col-span-4 flex flex-col gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Description</label>
                                            <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={3} placeholder="Briefly describe your fabrics..." required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] resize-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-serif font-bold text-[#8b6b3d] tracking-widest ml-1 mb-1.5 block">Full Address</label>
                                            <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={3} placeholder="Street address, City, Country..." required
                                                className="w-full bg-[#EAE5DB] border-[1.5px] border-[#bda27e] rounded py-2 px-3 text-[12px] font-serif text-[#2C241B] placeholder-[#8b795a] outline-none focus:border-[#8b6b3d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] resize-none" />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Success State */
                <div className="relative z-10 w-full max-w-md rounded-sm border-[6px] border-[#1E1914] shadow-2xl p-0.5 bg-[#1E1914]">
                    <div className="w-full h-full border-[2px] border-[#D4B26F] relative rounded-sm bg-[#F4EFE6] p-10 flex flex-col items-center text-center">
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-sm opacity-20 pointer-events-none">
                            <Image src="/newsletter_fabric.png" alt="Fabric" fill className="object-cover" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#8b6b3d] bg-[#EAE5DB] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] flex items-center justify-center mb-6">
                                <Check size={32} className="text-[#8b6b3d]" />
                            </div>
                            <h2 className="text-3xl font-serif font-semibold text-[#8b6b3d] mb-3" style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #c5a059' }}>Submitted</h2>
                            <p className="text-[13px] font-serif text-[#2C241B] font-medium mb-6">
                                {message || "Your application is under review by our curation team."}
                            </p>
                            {status === "approved" && (
                                <p className="text-[10px] uppercase font-serif font-bold tracking-widest text-[#D4B26F] bg-[#1E1914] px-4 py-2 rounded-sm shadow-lg">
                                    Redirecting in 5s...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : (<Loading />)
}