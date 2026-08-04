'use client'
import { deleteProduct, getLoggedInStoreId, getStoreProducts, updateProductStock, updateProductPrice } from "@/actions/supplier"
import Loading from "@/components/Loading"
import { PencilIcon, Trash2Icon, ArrowUpDownIcon, ChevronDownIcon, XIcon, EyeIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { toast } from "react-hot-toast"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [storeId, setStoreId] = useState(null)

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedProduct(null)
        setIsModalOpen(false)
    }

    // Sort states
    const [sortBy, setSortBy] = useState("DEFAULT")
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
    const sortDropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.price - b.price
        if (sortBy === "PRICE_DESC") return b.price - a.price
        if (sortBy === "NAME_ASC") return a.name.localeCompare(b.name)
        return 0
    })

    const fetchProducts = async () => {
        try {
            const sid = await getLoggedInStoreId()
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

    const handleUpdatePrice = async (productId, newPrice) => {
        const res = await updateProductPrice(productId, newPrice)
        if (res.success) {
            toast.success("Price updated!")
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

    const exportToCSV = () => {
        if (sortedProducts.length === 0) {
            toast.error("No products to export.");
            return;
        }

        const headers = ["Product Name", "Category", "Price", "MRP", "Stock (Meters)", "GSM", "Description"];
        const rows = sortedProducts.map(p => [
            `"${p.name || ''}"`,
            `"${p.category || ''}"`,
            p.price || 0,
            p.mrp || 0,
            p.availableStock || 0,
            `"${p.gsm || ''}"`,
            `"${(p.description || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "product_catalog.csv");
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
                    <p className="text-[#8b795a] mt-2">Please log in to manage your products.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col">
            <div className="relative z-10 w-full flex flex-col flex-1">
                
                {/* Header Section */}
                <div className="px-4 sm:px-12 py-4 sm:py-6 border-b border-[#EAE5DB] bg-white/40 backdrop-blur-md flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
                    {/* Subtle stitching effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-15" style={{ background: "radial-gradient(circle at 2px 0, #8b795a 1.5px, transparent 2px) repeat-x", backgroundSize: "6px 6px" }}></div>
                    
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1510] tracking-tight">Product Catalog</h2>
                        <p className="text-[10px] font-sans text-[#8b795a] mt-1 tracking-wide uppercase font-medium">{sortedProducts.length} items listed</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={exportToCSV} className="flex-1 sm:flex-none justify-center px-4 py-2 sm:py-2.5 text-[10px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-[#8b795a] bg-white/80 backdrop-blur-sm border border-[#EAE5DB] rounded-md hover:bg-[#F0EBE1] hover:text-[#2C241B] transition-all shadow-sm">
                            Export CSV
                        </button>
                        <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
                            <button 
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                className="w-full justify-center px-4 py-2 sm:py-2.5 text-[10px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-white bg-[#1a1510] rounded-md hover:bg-black shadow-md transition-all relative overflow-hidden group flex items-center gap-2"
                            >
                                <span className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></span>
                                <ArrowUpDownIcon className="w-3.5 h-3.5 sm:w-3 sm:h-3 relative z-10" />
                                <span className="relative z-10">
                                    {sortBy === "DEFAULT" ? "Sort" : 
                                     sortBy === "PRICE_ASC" ? "Price: Low to High" :
                                     sortBy === "PRICE_DESC" ? "Price: High to Low" : "A to Z"}
                                </span>
                                <ChevronDownIcon className={`w-3.5 h-3.5 sm:w-3 sm:h-3 relative z-10 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSortDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAE5DB] rounded-xl shadow-xl z-50 overflow-hidden text-[#1a1510] max-h-64 overflow-y-auto">
                                    <div className="px-4 py-2 border-b border-[#EAE5DB] bg-[#FDFBF7]">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8b795a]">Sort Catalog</span>
                                    </div>
                                    <div className="flex flex-col py-1">
                                        {[
                                            { value: 'DEFAULT', label: 'Default Order' },
                                            { value: 'PRICE_ASC', label: 'Price: Low to High' },
                                            { value: 'PRICE_DESC', label: 'Price: High to Low' },
                                            { value: 'NAME_ASC', label: 'Alphabetical: A to Z' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => { setSortBy(option.value); setIsSortDropdownOpen(false); }}
                                                className={`px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#FDFBF7] transition-colors ${sortBy === option.value ? 'text-[#1a1510] bg-[#FDFBF7]' : 'text-[#8b795a]'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto w-full relative z-10 flex-1 pb-28">
                    <table className="w-full text-left bg-transparent">
                        <thead className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8b795a] bg-white/60 backdrop-blur-md sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-4 sm:px-12 sm:py-6 border-b border-[#EAE5DB]">Product</th>
                                <th className="px-4 py-4 sm:px-6 sm:py-6 border-b border-[#EAE5DB] hidden md:table-cell">Category</th>
                                <th className="px-4 py-4 sm:px-6 sm:py-6 border-b border-[#EAE5DB]">Price</th>
                                <th className="px-4 py-4 sm:px-6 sm:py-6 border-b border-[#EAE5DB] text-center">Stock (Meters)</th>
                                <th className="px-4 py-4 sm:px-12 sm:py-6 border-b border-[#EAE5DB] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                                {sortedProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-[#EAE5DB]/60 last:border-0 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group relative z-0 hover:z-10">
                                        <td className="px-4 py-4 sm:px-12 sm:py-6 cursor-pointer group-hover:bg-[#FDFBF7]" onClick={() => openModal(product)}>
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0EBE1] border border-[#EAE5DB] flex-shrink-0 relative">
                                                    {product.images?.[0] ? (
                                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#f4efe4]"></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="font-bold text-[#1a1510] text-[13px] truncate group-hover:text-[#8b795a] transition-colors">{product.name}</span>
                                                    <span className="text-[11px] font-medium tracking-wide text-[#8b795a] truncate mt-0.5">{product.description || 'No description available'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-6 hidden md:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-[#EAE5DB] text-[#8b795a] text-[10px] font-bold uppercase tracking-widest">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center font-bold text-[#1f5c35] text-base">
                                                    <span className="mr-1">{currency}</span>
                                                    <input 
                                                        type="number"
                                                        defaultValue={product.price}
                                                        onBlur={(e) => {
                                                            const newVal = parseFloat(e.target.value)
                                                            if (newVal !== product.price && !isNaN(newVal)) {
                                                                handleUpdatePrice(product.id, newVal)
                                                            }
                                                        }}
                                                        className="w-20 px-1 py-0.5 border-b border-transparent hover:border-[#EAE5DB] focus:border-[#1f5c35] bg-transparent focus:outline-none focus:bg-white text-base font-bold text-[#1f5c35] transition-colors"
                                                    />
                                                </div>
                                                <span className="text-[10px] text-[#8b795a] line-through ml-1">{currency} {product.mrp.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-6 text-center">
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
                                                    className="w-20 p-1.5 text-center border border-[#EAE5DB] rounded-md bg-white/60 focus:bg-white focus:outline-none focus:border-[#8b795a] text-[12px] font-bold text-[#1a1510] transition-colors"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 sm:px-12 sm:py-6 text-center">
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
                        
                        {sortedProducts.length === 0 && (
                            <div className="py-16 flex flex-col items-center justify-center text-[#8b795a]">
                                <p className="text-sm font-serif">No products found. Start by adding one!</p>
                            </div>
                        )}
                    </div>
                </div>

            {/* Premium Product Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241B]/60 backdrop-blur-md" onClick={closeModal}>
                    <div className="bg-[#FDFBF7] rounded-[16px] shadow-2xl w-full max-w-2xl relative overflow-hidden border border-[#EAE5DB]" onClick={e => e.stopPropagation()}>
                        
                        {/* Fabric Background Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/denim_plaid_texture.png')" }}></div>
                        
                        {/* Close button */}
                        <button onClick={closeModal} className="absolute top-4 right-4 z-20 p-1.5 text-[#8b795a] hover:text-[#2C241B] transition-colors rounded-full hover:bg-black/5 bg-white/50 backdrop-blur-sm">
                            <XIcon className="w-4 h-4" />
                        </button>
                        
                        <div className="flex flex-col md:flex-row h-full relative z-10 max-h-[80vh] overflow-y-auto">
                            {/* Left Image Section */}
                            <div className="w-full md:w-2/5 min-h-[250px] md:min-h-full bg-[#F0EBE1] relative border-b md:border-b-0 md:border-r border-[#EAE5DB]">
                                {selectedProduct.images?.[0] ? (
                                    <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[#8b795a] text-xs font-medium tracking-widest uppercase">No Image</div>
                                )}
                            </div>

                            {/* Right Content Section */}
                            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-white/40">
                                
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block px-2 py-1 bg-white border border-[#EAE5DB] text-[#8b795a] text-[9px] font-bold uppercase tracking-[0.2em] rounded shadow-sm">
                                            {selectedProduct.category}
                                        </span>
                                        {selectedProduct.gsm && (
                                            <span className="inline-block px-2 py-1 bg-[#FDFBF7] border border-[#EAE5DB] text-[#1a1510] text-[9px] font-bold uppercase tracking-[0.2em] rounded shadow-sm">
                                                {selectedProduct.gsm} GSM
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[#1a1510] leading-tight mb-2">
                                        {selectedProduct.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-[#1f5c35]">{currency}{selectedProduct.price}</span>
                                        <span className="text-xs text-[#8b795a] line-through">{currency}{selectedProduct.mrp}</span>
                                    </div>
                                </div>

                                {/* Subtle stitching effect divider */}
                                <div className="w-full h-[1px] opacity-15 mb-6" style={{ background: "radial-gradient(circle at 2px 0, #8b795a 1.5px, transparent 2px) repeat-x", backgroundSize: "6px 6px" }}></div>

                                <div className="mb-6">
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b795a] mb-2">About this fabric</h4>
                                    <p className="text-[13px] text-[#4A3F35] leading-relaxed">
                                        {selectedProduct.description || "No detailed description has been provided for this product yet. Update the product bio to give your customers more details."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between bg-white px-4 py-3 border border-[#EAE5DB] rounded-lg shadow-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b795a]">Available Stock</span>
                                    <span className="text-sm font-bold text-[#1a1510]">{selectedProduct.availableStock} Meters</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}