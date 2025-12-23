import React, { useState,useEffect } from 'react'
import { Save, TicketPercent, Image as ImageIcon, UploadCloud, Plus, Trash2, Layers, Link as LinkIcon } from 'lucide-react'
import {createCouponAPI, getCouponsAPI, deleteCouponAPI} from '../api/couponAPI'

export default function Settings() {
  
  const [couponForm, setCouponForm] = useState({
  code: '',
  discount_type: 'PERCENT', // 🔥 default
  discount: '',
  expiry: ''
});

 const [couponsList, setCouponsList] = useState([]);

 useEffect(() => {
  loadCoupons();
}, []);

const loadCoupons = async () => {
  try {
    const res = await getCouponsAPI();

    if (res.data.status === 1) {
      setCouponsList(res.data.data);
    }
  } catch (err) {
    console.error("Failed to load coupons", err);
  }
}; // --- 2. BANNER STATE ---
  const [bannerForm, setBannerForm] = useState({ slot: 'Banner Slot 1', title: '', link: '' })
  const [bannersList, setBannersList] = useState([
    { id: 1, slot: 'Banner Slot 1', title: 'Monsoon Sale', link: '/sale' },
    { id: 2, slot: 'Banner Slot 2', title: 'Fresh Fruits', link: '/fruits' }
  ])

  // --- HANDLERS ---
  const handleCouponInput = (e) => setCouponForm({...couponForm, [e.target.name]: e.target.value})
  const handleBannerInput = (e) => setBannerForm({...bannerForm, [e.target.name]: e.target.value})

 const addCoupon = async () => {
  if (!couponForm.code || !couponForm.discount) {
    return alert("Fill coupon details");
  }
if (
  couponForm.discount_type === "PERCENT" &&
  couponForm.discount > 100
) {
  return alert("Percentage discount cannot exceed 100%");
}

  try {
    const payload = {
      coupon_code: couponForm.code.toUpperCase(),
      discount_type: couponForm.discount_type,
      discount_value: Number(couponForm.discount),
      expiry_date: couponForm.expiry || null
    };

    const res = await createCouponAPI(payload);

    if (res.data.status === 1) {
      await loadCoupons();
      setCouponForm({
        code: '',
        discount_type: 'PERCENT',
        discount: '',
        expiry: ''
      });
      alert("Coupon created successfully");
    } else {
      alert(res.data.message);
    }

  } catch (err) {
    alert(err.response?.data?.message || "Failed to create coupon");
  }
};

const removeCoupon = async (coupon_id) => {
  if (!window.confirm("Delete this coupon?")) return;

  try {
    const res = await deleteCouponAPI(coupon_id);

    if (res.data.status === 1) {
      await loadCoupons(); // 🔥 refresh list
      alert("Coupon deleted");
    } else {
      alert(res.data.message);
    }

  } catch (err) {
    alert("Failed to delete coupon");
  }
};


  const addBanner = () => {
    if(!bannerForm.title) return alert("Add a title for reference")
    setBannersList([...bannersList, { ...bannerForm, id: Date.now() }])
    setBannerForm({ slot: 'Banner Slot 1', title: '', link: '' })
  }
  const removeBanner = (id) => setBannersList(bannersList.filter(item => item.id !== id))

  const handleSaveAll = () => {
    console.log({ couponsList, bannersList })
    alert("Marketing Settings Saved!")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Marketing Assets</h1>
          <p className="text-slate-500 text-sm mt-1">Manage Coupons and App Banners.</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- CARD 1: COUPONS --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[550px]">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
             <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <TicketPercent size={20} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-gray-800">Coupons</h3>
                <p className="text-xs text-slate-500">Add or Remove Codes</p>
             </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <input 
              type="text" name="code" value={couponForm.code} onChange={handleCouponInput}
              placeholder="Code (e.g. SAVE20)"
              className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 font-bold text-gray-700 uppercase text-sm"
            />
          <div className="grid grid-cols-2 gap-3">
  {/* DISCOUNT TYPE */}
  <select
    name="discount_type"
    value={couponForm.discount_type}
    onChange={handleCouponInput}
    className="w-full border border-gray-300 rounded-xl p-2.5
               outline-none focus:ring-2 focus:ring-green-100
               focus:border-green-500 text-sm bg-white"
  >
    <option value="PERCENT">Percentage (%)</option>
    <option value="FLAT">Flat Amount (₹)</option>
  </select>

  {/* DISCOUNT VALUE */}
  <input 
    type="number"
    name="discount"
    value={couponForm.discount}
    onChange={handleCouponInput}
    placeholder={
      couponForm.discount_type === "PERCENT"
        ? "Discount %"
        : "Flat ₹"
    }
    className="w-full border border-gray-300 rounded-xl p-2.5
               outline-none focus:ring-2 focus:ring-green-100
               focus:border-green-500 text-sm"
  />
</div>

<input 
  type="date"
  name="expiry"
  value={couponForm.expiry}
  onChange={handleCouponInput}
  className="w-full border border-gray-300 rounded-xl p-2.5
             outline-none focus:ring-2 focus:ring-green-100
             focus:border-green-500 text-xs text-gray-600"
/>

            <button onClick={addCoupon} className="w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center justify-center gap-2">
                <Plus size={16}/> Add Coupon
            </button>
          </div>

          <div className="border-t border-dashed border-gray-200 my-2"></div>
<div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
  {couponsList.map(c => (
  <div
    key={c.coupon_id}
    className="flex items-center justify-between bg-green-50/50
               p-3 rounded-lg border border-green-100"
  >
    <div>
      <p className="font-bold text-green-800 text-sm">
        {c.coupon_code}
      </p>

      <p className="text-[10px] text-green-600">
        Get{" "}
        {c.discount_type === "PERCENT"
          ? `${c.discount_value}%`
          : `₹${c.discount_value}`
        } OFF
        {c.expiry_date && ` • Exp: ${c.expiry_date}`}
      </p>
    </div>

    {/* 🗑 DELETE */}
    <button
      onClick={() => removeCoupon(c.coupon_id)}
      className="text-gray-400 hover:text-red-500 transition"
    >
      <Trash2 size={16} />
    </button>
  </div>
))}

</div>

        </div>

        {/* --- CARD 2: AD BANNERS --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[550px]">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <ImageIcon size={20} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-gray-800">Banners</h3>
                <p className="text-xs text-slate-500">Manage App Slides</p>
             </div>
          </div>
          
          <div className="space-y-3 mb-4">
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Select Slot</label>
               <div className="relative">
                  <span className="absolute left-3 top-3 text-blue-400"><Layers size={14}/></span>
                  <select 
                    name="slot" 
                    value={bannerForm.slot} 
                    onChange={handleBannerInput}
                    className="w-full pl-9 border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm bg-white cursor-pointer"
                  >
                    <option>Banner Slot 1</option>
                    <option>Banner Slot 2</option>
                    <option>Popup</option>
                  </select>
               </div>
             </div>

             <input 
                type="text" name="title" value={bannerForm.title} onChange={handleBannerInput}
                placeholder="Banner Title"
                className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
             />
             
             <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><LinkIcon size={14}/></span>
                <input 
                    type="text" name="link" value={bannerForm.link} onChange={handleBannerInput}
                    placeholder="Target Link"
                    className="w-full pl-9 border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-mono text-slate-600"
                />
             </div>

            <div className="border border-dashed border-blue-200 rounded-xl h-14 flex flex-col items-center justify-center bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2 text-blue-500">
                    <UploadCloud size={16}/> <span className="text-xs font-medium">Upload Image</span>
                </div>
            </div>

            <button onClick={addBanner} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm shadow-sm">
                Add Banner
            </button>
          </div>

          <div className="border-t border-dashed border-gray-200 my-2"></div>

          <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
             {bannersList.map((b) => (
                <div key={b.id} className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <div className="flex-1 mr-2 overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">{b.slot}</span>
                        <p className="font-medium text-gray-700 text-sm mt-1 truncate">{b.title}</p>
                    </div>
                    <button onClick={() => removeBanner(b.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  )
}