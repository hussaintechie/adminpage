import React, { useState, useEffect } from 'react'
import { Zap, Clock, Search, Trash2, Plus, ArrowRight, Tag, Percent, Calculator } from 'lucide-react'

// Dummy Data for Product Inventory
const INVENTORY_DATA = [
    { id: 'PROD-001', name: 'Organic Almonds', price: 900, image: '🌰' },
    { id: 'PROD-002', name: 'Fresh Milk 1L', price: 60, image: '🥛' },
    { id: 'PROD-003', name: 'Sunflower Oil 5L', price: 850, image: '🌻' },
    { id: 'PROD-004', name: 'Basmati Rice 5kg', price: 600, image: '🍚' },
    { id: 'PROD-005', name: 'Green Tea Pack', price: 250, image: '🍵' },
    { id: 'PROD-006', name: 'Chocolate Bar', price: 100, image: '🍫' },
]

export default function SuperDeals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeDeals, setActiveDeals] = useState([
    { id: 101, productId: 'PROD-001', name: 'Organic Almonds', original: 900, offer: 450, endTime: '2025-12-31T23:59', image: '🌰' }
  ])

  // State for the "Add Deal" Modal/Form
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Added discountPercent to state to track the percentage input
  const [dealConfig, setDealConfig] = useState({ 
    offerPrice: '', 
    discountPercent: '', 
    endTime: '' 
  })

  // --- Handlers ---

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setDealConfig({ offerPrice: '', discountPercent: '', endTime: '' }) // Reset form
  }

  // LOGIC: Calculate Percentage when Price is typed
  const handlePriceChange = (e) => {
    const price = e.target.value;
    
    if (price === '') {
        setDealConfig(prev => ({ ...prev, offerPrice: '', discountPercent: '' }));
        return;
    }

    if (parseFloat(price) > selectedProduct.price) return; // Prevent price higher than original

    const percent = ((selectedProduct.price - price) / selectedProduct.price) * 100;
    
    setDealConfig(prev => ({ 
        ...prev, 
        offerPrice: price, 
        discountPercent: percent.toFixed(0) // Round to whole number
    }));
  }

  // LOGIC: Calculate Price when Percentage is typed
  const handlePercentChange = (e) => {
    const percent = e.target.value;
    
    if (percent === '') {
        setDealConfig(prev => ({ ...prev, offerPrice: '', discountPercent: '' }));
        return;
    }

    if (parseFloat(percent) > 100) return; // Prevent > 100%

    const price = selectedProduct.price - (selectedProduct.price * (percent / 100));
    
    setDealConfig(prev => ({ 
        ...prev, 
        offerPrice: Math.round(price), // Round price to avoid decimals
        discountPercent: percent
    }));
  }

  const handleAddDeal = () => {
    if (!selectedProduct || !dealConfig.offerPrice || !dealConfig.endTime) {
      alert("Please enter Deal Price and End Time")
      return
    }

    const newDeal = {
      id: Date.now(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      original: selectedProduct.price,
      offer: dealConfig.offerPrice,
      endTime: dealConfig.endTime
    }

    setActiveDeals([...activeDeals, newDeal])
    setSelectedProduct(null) // Close form
  }

  const handleRemoveDeal = (id) => {
    if(window.confirm("Are you sure you want to stop this deal?")) {
        setActiveDeals(activeDeals.filter(deal => deal.id !== id))
    }
  }

  const filteredInventory = INVENTORY_DATA.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Zap className="text-orange-500 fill-orange-500" /> Super Deals Manager
           </h1>
           <p className="text-slate-500 text-sm mt-1">Select products from inventory and create flash sales.</p>
        </div>
        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-bold border border-orange-100">
            Active Deals: {activeDeals.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* LEFT COLUMN: PRODUCT INVENTORY */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-700 mb-3">1. Select Product</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Search product by name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {filteredInventory.map(prod => (
                    <div 
                        key={prod.id} 
                        onClick={() => handleSelectProduct(prod)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 hover:shadow-md ${selectedProduct?.id === prod.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-100 hover:border-orange-200 bg-white'}`}
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {prod.image}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm">{prod.name}</h4>
                            <p className="text-xs text-gray-500 font-mono">{prod.id}</p>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-gray-700 text-sm">₹{prod.price}</span>
                            <button className="mt-1 text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full">Select</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* MIDDLE COLUMN: CONFIGURATION (Calculations Here) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
             {selectedProduct ? (
                 <div className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100 animate-in zoom-in duration-200">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Configure Deal
                    </h2>

                    <div className="space-y-4">
                        {/* Original Price Read-only */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Original Price</span>
                            <span className="text-lg font-bold text-gray-800">₹{selectedProduct.price}</span>
                        </div>
                        
                        {/* Calculation Grid */}
                        <div className="grid grid-cols-2 gap-3">
                             {/* Deal Price Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deal Price (₹)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        autoFocus
                                        value={dealConfig.offerPrice}
                                        onChange={handlePriceChange}
                                        placeholder="0"
                                        className="w-full border-2 border-orange-100 focus:border-orange-500 rounded-lg p-2 font-bold text-gray-800 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                             {/* Discount Percent Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount %</label>
                                <div className="relative">
                                    <Percent className="absolute right-3 top-2.5 text-gray-400" size={14}/>
                                    <input 
                                        type="number" 
                                        value={dealConfig.discountPercent}
                                        onChange={handlePercentChange}
                                        placeholder="0"
                                        className="w-full border border-gray-300 focus:border-orange-500 rounded-lg p-2 font-medium text-gray-600 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Calculation Summary Badge */}
                        {dealConfig.offerPrice && (
                            <div className="bg-green-50 text-green-700 p-2 rounded-lg text-xs font-bold text-center border border-green-200 flex items-center justify-center gap-2">
                                <Calculator size={14} />
                                Customer saves ₹{selectedProduct.price - dealConfig.offerPrice} ({dealConfig.discountPercent}% OFF)
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deal End Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                                <input 
                                    type="datetime-local" 
                                    value={dealConfig.endTime}
                                    onChange={(e) => setDealConfig({...dealConfig, endTime: e.target.value})}
                                    className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddDeal}
                            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18}/> Publish Deal
                        </button>
                        
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            className="w-full text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            Cancel selection
                        </button>
                    </div>
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-6 text-center">
                     <ArrowRight size={40} className="mb-2 opacity-20"/>
                     <p className="text-sm font-medium">Select a product to configure deal.</p>
                 </div>
             )}
        </div>

        {/* RIGHT COLUMN: ACTIVE DEALS LIST */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
                <h2 className="font-bold text-gray-700">Live Deals</h2>
                <Tag size={18} className="text-orange-400"/>
             </div>

             <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {activeDeals.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">No Active Deals</div>
                )}

                {activeDeals.map(deal => (
                    <div key={deal.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1 bg-orange-500 w-2/3"></div>
                        <div className="flex gap-3">
                            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border border-gray-100">
                                {deal.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 text-sm truncate">{deal.name}</h4>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-lg font-bold text-orange-600">₹{deal.offer}</span>
                                    <span className="text-xs text-gray-400 line-through">₹{deal.original}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded-full">
                                    <Clock size={10}/> Ends: {new Date(deal.endTime).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleRemoveDeal(deal.id)}
                                className="self-start text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  )
}