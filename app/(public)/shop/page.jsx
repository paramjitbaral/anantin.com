'use client'
import { Suspense, useState, useMemo, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, Filter, ChevronDown, Check, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { setProduct } from "@/lib/features/product/productSlice"
import { getAllProducts } from "@/actions/product"

function ShopContent() {
    const searchParams = useSearchParams()
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlColor = searchParams.get('color')
    const urlGsm = searchParams.get('gsm')
    const urlMaxPrice = searchParams.get('maxPrice')
    const router = useRouter()
    const dispatch = useDispatch()

    const products = useSelector(state => state.product.list)
    
    // Fallback: if Redux store is empty, fetch products directly
    useEffect(() => {
        if (!products || products.length === 0) {
            getAllProducts().then(data => {
                if (data && data.length > 0) {
                    dispatch(setProduct(data))
                }
            })
        }
    }, [products, dispatch])
    
    // Filters State
    const [selectedCategories, setSelectedCategories] = useState(urlCategory && urlCategory !== 'All' ? [urlCategory] : [])
    const [selectedColors, setSelectedColors] = useState(urlColor ? [urlColor] : [])
    const [selectedGsms, setSelectedGsms] = useState(urlGsm ? [urlGsm] : [])
    const [maxPriceFilter, setMaxPriceFilter] = useState(urlMaxPrice ? Number(urlMaxPrice) : 0)
    const [sortBy, setSortBy] = useState('relevance')
    
    // Sync URL Filters to State and Hide from URL bar
    useEffect(() => {
        let hasFilters = false
        if (urlCategory && urlCategory !== 'All') {
            setSelectedCategories([urlCategory])
            hasFilters = true
        } else if (!urlCategory) {
            setSelectedCategories([])
        }
        
        if (urlColor) { setSelectedColors([urlColor]); hasFilters = true; }
        if (urlGsm) { setSelectedGsms([urlGsm]); hasFilters = true; }
        if (urlMaxPrice) { setMaxPriceFilter(Number(urlMaxPrice)); hasFilters = true; }
        if (urlSearch) { hasFilters = true; }

        // Clean the URL bar so users don't see the messy parameters
        if (hasFilters && typeof window !== 'undefined') {
            window.history.replaceState(null, '', '/shop')
        }
    }, [urlCategory, urlColor, urlGsm, urlMaxPrice, urlSearch])
    
    // Extract unique filter options from products
    const { categories, colors, gsms, maxProductPrice } = useMemo(() => {
        const catSet = new Set()
        const colSet = new Set()
        const gsmSet = new Set()
        let maxP = 0
        
        products.forEach(p => {
            if (p.category) catSet.add(p.category)
            if (p.gsm) gsmSet.add(p.gsm)
            if (p.price && p.price > maxP) maxP = p.price
            if (p.colors && Array.isArray(p.colors)) {
                p.colors.forEach(c => colSet.add(c))
            }
        })
        
        return {
            categories: Array.from(catSet).sort(),
            colors: Array.from(colSet).sort(),
            gsms: Array.from(gsmSet).sort((a,b) => parseInt(a) - parseInt(b)),
            maxProductPrice: Math.ceil(maxP)
        }
    }, [products])

    // Set initial max price filter once maxProductPrice is derived
    useMemo(() => {
        if (maxPriceFilter === 0 && maxProductPrice > 0) {
            setMaxPriceFilter(maxProductPrice)
        }
    }, [maxProductPrice, maxPriceFilter])

    // Filter and Sort Logic
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products]

        // 1. Search Query Filter
        if (urlSearch) {
            const stopWords = new Set(['cloths', 'clothes', 'cloth', 'fabric', 'fabrics', 'for', 'me', 'find', 'show', 'please', 'open', 'get', 'a', 'the', 'item', 'items']);
            const words = urlSearch.toLowerCase().split(/\s+/).filter(w => w && !stopWords.has(w));
            
            if (words.length > 0) {
                result = result.filter(p => {
                    const text = `${p.name || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
                    // Use word boundaries so 'silk' doesn't match 'silky'
                    return words.some(w => {
                        const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
                        return regex.test(text);
                    });
                });
            }
        }

        // 2. Category Filter
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category))
        }

        // 3. Color Filter
        if (selectedColors.length > 0) {
            result = result.filter(p => p.colors && p.colors.some(c => selectedColors.includes(c)))
        }

        // 4. GSM Filter
        if (selectedGsms.length > 0) {
            result = result.filter(p => selectedGsms.includes(p.gsm))
        }

        // 5. Price Filter
        if (maxPriceFilter > 0) {
            result = result.filter(p => p.price <= maxPriceFilter)
        }

        // 6. Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                result.sort((a, b) => b.price - a.price)
                break
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            default: // 'relevance' - keep original order
                break
        }

        return result
    }, [products, urlSearch, selectedCategories, selectedColors, selectedGsms, maxPriceFilter, sortBy])

    // Accordion State
    const [openSections, setOpenSections] = useState({
        fabric: false,
        price: false,
        color: false,
        gsm: false
    })

    const [fabricSearch, setFabricSearch] = useState('')
    const [colorSearch, setColorSearch] = useState('')
    const [gsmSearch, setGsmSearch] = useState('')

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Toggle Handlers
    const toggleArrayItem = (setState, item) => {
        setState(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        )
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedColors([])
        setSelectedGsms([])
        setMaxPriceFilter(maxProductPrice)
        if (urlSearch || urlCategory) {
            router.push('/shop')
        }
    }

    return (
        <div className="min-h-[70vh] w-full bg-[#FAF8F5]">


            {/* Main Content: Sidebar + Products */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                {/* Left Sidebar (Filters) */}
                <div className="w-full lg:w-64 shrink-0 bg-white p-6 rounded-xl shadow-sm border border-[#EAE0D5] h-fit lg:sticky lg:top-28">
                    <div className="flex items-center justify-between mb-2 pb-4 border-b border-[#EAE0D5]">
                        <h3 className="text-sm uppercase tracking-[0.1em] font-bold text-[#2C241B] flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </h3>
                        <button onClick={clearAllFilters} className="text-[10px] uppercase tracking-widest text-[#D4B26F] hover:text-[#2C241B] font-semibold transition-colors">
                            Clear All
                        </button>
                    </div>

                    <div className="flex flex-col">
                        
                        {/* Categories */}
                        <div className="border-b border-[#EAE0D5] py-4">
                            <button onClick={() => toggleSection('fabric')} className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-[#8C8A85] hover:text-[#2C241B] transition-colors">
                                Fabric
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.fabric ? 'rotate-180' : ''}`} />
                            </button>
                            {openSections.fabric && (
                                <div className="flex flex-col gap-2.5 mt-4">
                                    <div className="relative mb-2">
                                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8A85]" />
                                        <input type="text" placeholder="Search Fabric..." value={fabricSearch} onChange={(e) => setFabricSearch(e.target.value)} className="w-full text-[11px] border border-[#EAE0D5] rounded-full py-1.5 pl-8 pr-3 outline-none focus:border-[#D4B26F] text-[#2C241B] placeholder-[#8C8A85]" />
                                    </div>
                                    {categories.filter(c => c.toLowerCase().startsWith(fabricSearch.toLowerCase())).map((cat, idx) => (
                                        <div key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayItem(setSelectedCategories, cat)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${selectedCategories.includes(cat) ? 'bg-[#2C241B] border-[#2C241B]' : 'border-[#EAE0D5] group-hover:border-[#D4B26F]'}`}>
                                                {selectedCategories.includes(cat) && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-[13px] truncate transition-colors ${selectedCategories.includes(cat) ? 'text-[#2C241B] font-medium' : 'text-[#8C8A85] group-hover:text-[#2C241B]'}`}>
                                                {cat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="border-b border-[#EAE0D5] py-4">
                            <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-[#8C8A85] hover:text-[#2C241B] transition-colors">
                                Max Price
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
                            </button>
                            {openSections.price && (
                                <div className="mt-4 px-1">
                                    <h4 className="text-[11px] font-bold text-[#2C241B] mb-2">₹{maxPriceFilter}</h4>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max={maxProductPrice} 
                                        step="50"
                                        value={maxPriceFilter} 
                                        onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                                        className="w-full accent-[#2C241B] cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-[#8C8A85] mt-1 font-medium">
                                        <span>₹0</span>
                                        <span>₹{maxProductPrice}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Colors */}
                        <div className="border-b border-[#EAE0D5] py-4">
                            <button onClick={() => toggleSection('color')} className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-[#8C8A85] hover:text-[#2C241B] transition-colors">
                                Color
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.color ? 'rotate-180' : ''}`} />
                            </button>
                            {openSections.color && (
                                <div className="flex flex-col gap-2.5 mt-4">
                                    <div className="relative mb-2">
                                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8A85]" />
                                        <input type="text" placeholder="Search Color..." value={colorSearch} onChange={(e) => setColorSearch(e.target.value)} className="w-full text-[11px] border border-[#EAE0D5] rounded-full py-1.5 pl-8 pr-3 outline-none focus:border-[#D4B26F] text-[#2C241B] placeholder-[#8C8A85]" />
                                    </div>
                                    {colors.filter(c => c.toLowerCase().startsWith(colorSearch.toLowerCase())).map((color, idx) => (
                                        <div key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArrayItem(setSelectedColors, color)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${selectedColors.includes(color) ? 'bg-[#2C241B] border-[#2C241B]' : 'border-[#EAE0D5] group-hover:border-[#D4B26F]'}`}>
                                                {selectedColors.includes(color) && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-[13px] truncate transition-colors ${selectedColors.includes(color) ? 'text-[#2C241B] font-medium' : 'text-[#8C8A85] group-hover:text-[#2C241B]'}`}>
                                                {color}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* GSM */}
                        <div className="py-4">
                            <button onClick={() => toggleSection('gsm')} className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-[#8C8A85] hover:text-[#2C241B] transition-colors">
                                Weight (GSM)
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.gsm ? 'rotate-180' : ''}`} />
                            </button>
                            {openSections.gsm && (
                                <div className="flex flex-col gap-2.5 mt-4">
                                    <div className="relative mb-2">
                                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8A85]" />
                                        <input type="text" placeholder="Search Weight..." value={gsmSearch} onChange={(e) => setGsmSearch(e.target.value)} className="w-full text-[11px] border border-[#EAE0D5] rounded-full py-1.5 pl-8 pr-3 outline-none focus:border-[#D4B26F] text-[#2C241B] placeholder-[#8C8A85]" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {gsms.filter(g => g.toLowerCase().startsWith(gsmSearch.toLowerCase())).map((gsm, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => toggleArrayItem(setSelectedGsms, gsm)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                                                    selectedGsms.includes(gsm) 
                                                        ? 'bg-[#2C241B] text-white border-[#2C241B]' 
                                                        : 'bg-white text-[#8C8A85] border-[#EAE0D5] hover:border-[#D4B26F] hover:text-[#2C241B]'
                                                }`}
                                            >
                                                {gsm}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Right Content (Products & Sorting) */}
                <div className="flex-1 flex flex-col gap-6">
                    


                    {/* Top Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#EAE0D5] gap-4">
                        <p className="text-sm text-[#8C8A85] font-medium">
                            Showing <strong className="text-[#2C241B]">{filteredAndSortedProducts.length}</strong> products
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-widest font-bold text-[#8C8A85]">Sort By:</span>
                            <div className="relative">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-[#FAF8F5] border border-[#EAE0D5] text-[#2C241B] text-sm font-medium py-2 pl-4 pr-10 rounded cursor-pointer outline-none focus:border-[#D4B26F] transition-colors"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8A85] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm border border-[#EAE0D5]">
                            <Search size={48} className="text-[#EAE0D5] mb-4" />
                            <h3 className="text-2xl font-serif italic text-[#2C241B] mb-2">No matching products</h3>
                            <p className="text-sm text-[#8C8A85] max-w-sm">Try adjusting your filters or search query to find what you're looking for.</p>
                            <button onClick={clearAllFilters} className="mt-6 px-6 py-2 bg-[#D4B26F] text-[#1E1914] text-xs uppercase tracking-widest font-bold rounded-full hover:bg-[#C3A160] transition-colors">
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6 mb-32">
                            {filteredAndSortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    )}
                </div>

            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #FAF8F5;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #EAE0D5;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D4B26F;
                }
            `}</style>
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl font-serif italic text-[#8C8A85]">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}