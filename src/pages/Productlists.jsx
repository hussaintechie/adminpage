import { useEffect, useState } from "react";
import API from "../api/api";
import {
  Search,
  ImageIcon,
  Trash2,
  Edit,
} from "lucide-react";
import Pagination from "../components/purchsepagenation";
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

  /* ---------------- FETCH ITEMS ---------------- */
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

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await API.post(`${API_URL}/deleteItem`,{id});
      fetchItems();
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  /* ---------------- SAVE (ADD / UPDATE) ---------------- */
  const handleSave = async (product) => {
    try {
      if (product.id) {
        // UPDATE
        await API.put(`${API_URL}/updateItem/${product.id}`, product);
      } else {
        // ADD
        await API.post(`${API_URL}/addItem`, product);
      }

      setShowForm(false);
      setEditItem(null);
      fetchItems();
    } catch (err) {
      alert("Save failed");
    }
  };

  /* ---------------- CANCEL ---------------- */
  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  /* ================= FORM VIEW ================= */
  if (showForm) {
    return (
      <ManualAddForm
        initialData={editItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  /* ================= LIST VIEW ================= */
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* SEARCH */}
      <div className="bg-white rounded-xl border p-3 flex gap-2 items-center">
        <Search size={20} className="text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search products..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">MRP</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover rounded" />
                      ) : (
                        <ImageIcon size={16} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 line-through text-gray-400">
                    ₹{item.mrp || "-"}
                  </td>
                  <td className="px-6 py-4 font-bold">₹{item.price}</td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-500"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
