'use client'
import { deleteProduct, getDemoStoreId, getStoreProducts, updateProductStock } from "@/actions/supplier"
import Loading from "@/components/Loading"
import { PencilIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [storeId, setStoreId] = useState(null)

    const fetchProducts = async () => {
        try {
            const sid = await getDemoStoreId()
            setStoreId(sid)
            if (sid) {
                const data = await getStoreProducts(sid)
                setProducts(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleUpdateStock = async (productId, newStock) => {
        const res = await updateProductStock(productId, newStock)
        if (res.success) {
            toast.success("Stock updated!")
        } else {
            toast.error(res.error)
        }
    }

    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        toast.loading("Deleting product...", { id: 'delete' })
        const res = await deleteProduct(productId)
        if (res.success) {
            toast.success("Product deleted!", { id: 'delete' })
            setProducts(products.filter(p => p.id !== productId))
        } else {
            toast.error(res.error, { id: 'delete' })
        }
    }

    if (loading) return <Loading />

    if (!storeId) {
        return (
            <div className="relative pb-28 pt-8">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 text-center mt-20">
                    <h1 className="text-2xl font-serif text-[#2C241B]">No Store Found</h1>
                    <p className="text-[#8b795a] mt-2">Please log in to manage your products.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative pb-28 pt-8">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
                
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-[#EAE5DB]">
                    <h1 className="text-3xl font-serif font-semibold text-[#2C241B]">
                        Manage Products
                    </h1>
                    <p className="text-[12px] font-sans text-[#8b795a] mt-1">
                        View, update stock, and delete your catalog items
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EAE5DB] overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-[#F0EBE1] bg-[#FDFBF7] flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-[#2C241B]">Product Catalog</h2>
                            <p className="text-[12px] font-sans text-[#8b795a] mt-1">{products.length} items listed</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] uppercase font-bold tracking-widest text-[#8b795a] bg-white border-b border-[#EAE5DB]">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-center">Stock (Meters)</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EAE5DB]">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#FDFBF7] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-[#EAE5DB] flex-shrink-0 relative">
                                                    {product.images?.[0] ? (
                                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#f4efe4]"></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="font-semibold text-[#2C241B] truncate">{product.name}</span>
                                                    <span className="text-[10px] text-[#8b795a] truncate mt-0.5">{product.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-[#EAE5DB] text-[#8b795a] text-xs">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1f5c35] text-base">{currency} {product.price.toLocaleString()}</span>
                                                <span className="text-[10px] text-[#8b795a] line-through">{currency} {product.mrp.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center">
                                                <input 
                                                    type="number" 
                                                    defaultValue={product.availableStock} 
                                                    onBlur={(e) => {
                                                        const newVal = parseInt(e.target.value)
                                                        if (newVal !== product.availableStock) {
                                                            handleUpdateStock(product.id, newVal)
                                                        }
                                                    }}
                                                    className="w-20 p-2 text-center border border-[#EAE5DB] rounded-lg bg-white focus:outline-none focus:border-[#8b6b3d] text-sm font-semibold text-[#2C241B] transition-colors"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {products.length === 0 && (
                            <div className="py-16 flex flex-col items-center justify-center text-[#8b795a]">
                                <p className="text-sm">No products found. Start by adding one!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}