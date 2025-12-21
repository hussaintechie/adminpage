import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Save, 
  Image as ImageIcon, 
  Search, 
  Package, 
  MoreVertical, 
  Download
} from 'lucide-react';

// --- MOCK DATA (Updated with MRP) ---
const EXISTING_PRODUCTS = [
  { id: 1, name: 'Amul Butter', sku: 'DAIRY-001', stock: 45, price: 54.00, mrp: 60.00, category: 'Dairy', status: 'Active' },
  { id: 2, name: 'Farm Eggs (6pcs)', sku: 'DAIRY-002', stock: 12, price: 40.00, mrp: 50.00, category: 'Dairy', status: 'Low Stock' },
  { id: 3, name: 'Whole Wheat Bread', sku: 'BAK-101', stock: 0, price: 35.00, mrp: 40.00, category: 'Bakery', status: 'Out of Stock' },
  { id: 4, name: 'Toned Milk', sku: 'DAIRY-004', stock: 20, price: 32.00, mrp: 35.00, category: 'Dairy', status: 'Active' },
  { id: 5, name: 'Curd (500g)', sku: 'DAIRY-005', stock: 15, price: 30.00, mrp: 32.00, category: 'Dairy', status: 'Active' },
];

// --- COMPONENT: MANUAL ADD FORM ---
const ManualAddForm = ({ onSave, onCancel }) => {
  // Removed bulkTiers, added mrp
  const [product, setProduct] = useState({
    name: '', brand: '', description: '', category: 'Dairy',
    unit: 'pcs', basePrice: '', mrp: '', stockQty: '', sku: '',
    status: 'Active', image: null
  });

  const handleInputChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  // Handle Image Upload Simulation
  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          setProduct({ ...product, image: URL.createObjectURL(file) });
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.basePrice || !product.mrp) {
      alert("Please fill in required fields (Name, Price, MRP)");
      return;
    }
    onSave(product);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        <div className="lg:col-span-2 p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Product Details</h3>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">General</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input name="name" value={product.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Amul Butter" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input name="brand" value={product.brand} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Amul" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input name="sku" value={product.sku} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 font-mono outline-none focus:ring-2 focus:ring-emerald-500" placeholder="GEN-SKU" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stockQty" value={product.stockQty} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={product.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Dairy</option>
                  <option>Vegetables</option>
                  <option>Bakery</option>
                  <option>Meat</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 bg-gray-50/50 p-4 md:p-6 space-y-6">
          
          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative h-32">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {product.image ? (
                    <img src={product.image} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                    <div className="text-center">
                        <div className="bg-gray-100 p-2 rounded-full inline-block mb-1"><ImageIcon size={20} className="text-gray-400"/></div>
                        <p className="text-xs text-gray-500">Tap to upload</p>
                    </div>
                )}
            </div>
          </div>

          <div className="space-y-4">
             {/* Pricing Section */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
                <input type="number" name="mrp" value={product.mrp} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="60.00" />
                <p className="text-[10px] text-gray-500 mt-1">Maximum Retail Price printed on pack.</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                <input type="number" name="basePrice" value={product.basePrice} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" />
                <p className="text-[10px] text-emerald-600 mt-1 font-medium">Your selling price to customers.</p>
             </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
             <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Save</button>
             <button type="button" onClick={onCancel} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </form>
  );
};

// --- COMPONENT: BULK UPLOAD ---
const BulkUpload = ({ onImport, onCancel }) => {
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTimeout(() => {
        setData([
            {Name: "Bulk Item 1", Price: "100", MRP: "120", Stock: "50", Category: "Dairy", SKU: "BLK-001"},
            {Name: "Bulk Item 2", Price: "250", MRP: "300", Stock: "20", Category: "Bakery", SKU: "BLK-002"},
        ]);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <div className="bg-emerald-50 p-4 rounded-full mb-4"><Upload className="text-emerald-600 w-8 h-8" /></div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Inventory File</h3>
        <p className="text-gray-500 mb-4 text-sm">Tap to upload .CSV or .XLSX</p>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv, .xlsx, .xls" />
      </div>
      {data.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Preview ({data.length})</h3>
            <div className="flex gap-2">
                <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 font-medium">Cancel</button>
                <button onClick={() => onImport(data)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Import</button>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-200">
              {data.map((row, i) => <div key={i} className="border-b border-gray-200 last:border-0 py-1">{row.Name} - SP: ₹{row.Price} / MRP: ₹{row.MRP}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN INVENTORY COMPONENT ---
const Inventory = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [inventory, setInventory] = useState(EXISTING_PRODUCTS);

  const handleSaveProduct = (newProduct) => {
    setInventory([{ ...newProduct, id: Date.now(), price: newProduct.basePrice, stock: newProduct.stockQty, status: 'Active' }, ...inventory]);
    setActiveTab('list');
  };

  const handleBulkImport = (data) => {
    const newItems = data.map((item, idx) => ({ 
        id: Date.now() + idx, name: item.Name, sku: item.SKU || 'BULK-001', category: item.Category, price: item.Price, mrp: item.MRP || item.Price, stock: item.Stock, status: 'Active' 
    }));
    setInventory([...newItems, ...inventory]);
    setActiveTab('list');
  };

  return (
    <div className="font-sans p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="text-emerald-600" size={28} /> Inventory
            </h1>
          </div>
          
          <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pt-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:p-0">
            <div className="w-full overflow-x-auto no-scrollbar">
                <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex whitespace-nowrap min-w-max">
                {[
                    { id: 'list', label: 'Inventory List' },
                    { id: 'manual', label: 'Add Product', icon: Plus },
                    { id: 'bulk', label: 'Bulk Upload', icon: FileSpreadsheet }
                ].map(tab => (
                    <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                        activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    >
                    {tab.icon && <tab.icon size={16} />} {tab.label}
                    </button>
                ))}
                </div>
            </div>
          </div>
        </div>

        {/* --- VIEWS --- */}
        {activeTab === 'list' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex gap-2 items-center shadow-sm">
              <Search className="text-gray-400 ml-1" size={20} />
              <input type="text" placeholder="Search products..." className="w-full outline-none text-sm py-1" />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                        {/* Mobile Image Placeholder */}
                        <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border border-slate-200 shrink-0">
                            {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg"/> : <ImageIcon size={20}/>}
                        </div>
                        <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">{item.sku}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-medium">{item.category}</span>
                        </div>
                        </div>
                    </div>
                    <button className="text-slate-300 p-1"><MoreVertical size={20}/></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-50 items-end">
                    <div>
                      <span className="text-xs text-slate-400 font-medium uppercase">Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl text-emerald-600">₹{item.price}</span>
                        {item.mrp && <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium uppercase block mb-1">Status</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Image</th> 
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">MRP</th> {/* New Column */}
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover"/> : <ImageIcon size={18} />}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                            <div className="text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</div>
                        </td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600">{item.category}</span></td>
                        
                        {/* MRP Column */}
                        <td className="px-6 py-4 text-slate-400 line-through text-sm">₹{item.mrp || '-'}</td>
                        
                        <td className="px-6 py-4 font-bold text-slate-700">₹{item.price}</td>
                        <td className="px-6 py-4 text-sm font-medium">{item.stock}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={18}/>
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {/* Form Views */}
        {activeTab === 'manual' && <ManualAddForm onSave={handleSaveProduct} onCancel={() => setActiveTab('list')} />}
        {activeTab === 'bulk' && <BulkUpload onImport={handleBulkImport} onCancel={() => setActiveTab('list')} />}

      </div>
    </div>
  );
};

export default Inventory;