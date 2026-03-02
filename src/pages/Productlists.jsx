import { useEffect, useState } from "react";
import API from "../api/api";
import { Search, ImageIcon, Trash2, Edit, Plus, PackageOpen } from "lucide-react";
import Pagination from "../components/Pagination";
import ManualAddForm from "../pages/ManualAddForm";

const ITEMS_PER_PAGE = 15;
const API_URL = "product";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.post(`${API_URL}/Itemslist`, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
      });
      if (res.data.status === 1) {
        setItems(res.data.data);
        setTotalItems(res.data.total);
      } else {
        setItems([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.post(`${API_URL}/deleteItem`, { id });
      fetchItems();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

//  const handleSave = async (product) => {
//   try {
//     if (product.id) {
//       await API.put(`${API_URL}/updateItem/${product.id}`, product);
//     } else {
//       await API.post(`${API_URL}/addItem`, product);
//     }
//     setShowForm(false);
//     setEditItem(null);
//     fetchItems();
//   } catch {
//     alert("Save failed");
//   }
// };
const handleSave = () => {
  setShowForm(false);
  setEditItem(null);
  fetchItems();
};



  if (showForm) {
    return <ManualAddForm initialData={editItem} onSave={handleSave} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500">Manage your product stock and pricing</p>
        </div>
       
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search by product name or category..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Pricing</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-20 text-gray-400">Loading inventory...</td></tr>
            ) : items.map((item) => (
              <tr key={item.product_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={20} />}
                    </div>
                    <span className="font-semibold text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">₹{item.price}</div>
                  <div className="text-xs text-gray-400 line-through">₹{item.mrp}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit size={18} /></button>
                    {/* <button onClick={() => handleDelete(item.product_id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {loading ? (
           <div className="text-center py-10">Loading...</div>
        ) : items.map((item) => (
          <div key={item.product_id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border">
                {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg" /> : <ImageIcon className="text-gray-400" size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-bold text-blue-600">₹{item.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
               <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">{item.status}</span>
               <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md"><Edit size={14} /> Edit</button>
                  {/* <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md"><Trash2 size={14} /> Delete</button> */}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <PackageOpen size={48} className="text-gray-300 mb-2" />
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}

      <div className="pt-4">
        <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}