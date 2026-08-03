'use client'
import { addProduct, getDemoStoreId } from "@/actions/supplier"
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {
    const router = useRouter()
    const categories = ['Cotton Fabric', 'Linen Fabric', 'Silk Fabric', 'Denim Fabric', 'Polyester Fabric', 'Rayon Fabric', 'Wool Fabric', 'Satin Fabric', 'Chiffon Fabric', 'Canvas Fabric', 'Terry Cloth', 'Velvet Fabric']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: "",
        colors: "",
        gsm: "",
        width: "",
        material: "",
        availableStock: "",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const storeId = await getDemoStoreId()
            if (!storeId) {
                toast.error("Store not found. Please log in.")
                setLoading(false)
                return
            }

            // Mocking image upload - passing dummy URLs for now
            const mockImageUrls = Object.values(images).filter(i => i !== null).map(() => "https://via.placeholder.com/300")
            
            const data = {
                ...productInfo,
                images: mockImageUrls,
                colors: productInfo.colors ? productInfo.colors.split(',').map(c => c.trim()) : []
            }

            const res = await addProduct(storeId, data)
            
            if (res.success) {
                toast.success("Product added successfully!")
                router.push('/store/manage-product')
            } else {
                toast.error(res.error || "Failed to add product")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative pb-0 pt-0 w-full flex-1 flex flex-col justify-center min-h-full">
            <div className="relative z-10 w-full max-w-full mx-auto">
                
                {/* Form Section */}

                <form onSubmit={onSubmitHandler} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-[#F0EBE1] bg-[#FDFBF7]">
                        <h2 className="text-xl font-serif font-semibold text-[#2C241B]">Product Details</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Product Name</label>
                                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="e.g. Premium Silk Blend" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" required />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Description</label>
                                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Detailed product description..." rows={3} className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg resize-none" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Actual Price ($)</label>
                                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="e.g. 50" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Offer Price ($)</label>
                                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="e.g. 45" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Available Stock (M)</label>
                                    <input type="number" name="availableStock" onChange={onChangeHandler} value={productInfo.availableStock} placeholder="0" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Colors</label>
                                    <input type="text" name="colors" onChange={onChangeHandler} value={productInfo.colors} placeholder="Red, Blue, Green" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-4">
                            
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block">Category</label>
                                <select onChange={onChangeHandler} name="category" value={productInfo.category} className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all rounded-lg" required>
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block truncate">GSM</label>
                                    <input type="text" name="gsm" onChange={onChangeHandler} value={productInfo.gsm} placeholder="200" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block truncate">Width</label>
                                    <input type="text" name="width" onChange={onChangeHandler} value={productInfo.width} placeholder="58in" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#7A6B52] mb-1.5 block truncate">Material</label>
                                    <input type="text" name="material" onChange={onChangeHandler} value={productInfo.material} placeholder="Cotton" className="w-full px-4 py-3 bg-[#F5F2EA] border border-transparent focus:bg-white focus:outline-none focus:border-[#8b6b3d] focus:ring-1 focus:ring-[#8b6b3d] text-[13px] text-[#2C241B] transition-all placeholder-[#A89F8D] rounded-lg" />
                                </div>
                            </div>

                            <div className="mt-2 border-t border-[#F0EBE1] pt-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A6B52] mb-2 block">Product Images</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {Object.keys(images).map((key) => (
                                        <label key={key} htmlFor={`images${key}`} className="relative h-20 rounded-lg border-2 border-dashed border-[#D4C8B5] bg-[#F5F2EA] hover:bg-[#EAE4D5] hover:border-[#8b6b3d] transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center group">
                                            {images[key] ? (
                                                <Image fill className="object-cover" src={URL.createObjectURL(images[key])} alt={`Upload ${key}`} />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-[#8b795a] group-hover:text-[#8b6b3d]">
                                                    <span className="text-2xl leading-none font-light">+</span>
                                                </div>
                                            )}
                                            <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                                        </label>
                                    ))}
                                </div>
                                <p className="text-[9px] text-[#8b795a] mt-2.5">Upload up to 4 high-resolution images. First image will be the cover.</p>
                            </div>
                            
                            <div className="mt-auto pt-3 flex justify-end">
                                <button disabled={loading} type="submit" className="w-full bg-[#2C241B] hover:bg-[#1A1510] text-white py-3 px-6 rounded-lg transition-all shadow-lg font-bold text-[13px] tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Publishing...' : 'Publish Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}