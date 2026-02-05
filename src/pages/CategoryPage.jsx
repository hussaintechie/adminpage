const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import React, { useState,useEffect} from 'react';
import { Image, Plus, Trash2, Edit, Search } from 'lucide-react';
import { getCategoriesAPI, addCategoryAPI } from "../api/categoryAPI";

const CategoryPage = () => {
;
const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: null });
  const [editId, setEditId] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewCategory({
      ...newCategory,
      image: URL.createObjectURL(file),
      imageFile: file,
    });
  }
};


  

 const handleAddCategory = async () => {
  if (!newCategory.name) return;

  const formData = new FormData();

  formData.append("category_name", newCategory.name);
  formData.append("sts", 1);
  formData.append("mode", editId ? 1 : 0);

  if (editId) {
    formData.append("catid", editId);
  }

  if (newCategory.imageFile) {
    formData.append("file", newCategory.imageFile);
  }

  const res = await addCategoryAPI(formData);

  if (res.data.status === 1) {
    fetchCategories();
    setEditId(null);
    setIsModalOpen(false);
    setNewCategory({ name: "", image: null });
  }
};


const deleteCategory = async (id) => {
  if (!confirm("Delete category?")) return;

  const formData = new FormData();
  formData.append("mode", 2);
  formData.append("catid", id);

  await addCategoryAPI(formData);
  fetchCategories();
};  



const fetchCategories = async () => {
  try {
    const res = await getCategoriesAPI();
    setCategories(res.data.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchCategories();
}, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600"></span>
          Category Management
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center border border-gray-100">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <p className="text-sm text-gray-500 font-medium">Total Categories: {categories.length}</p>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">SNO</th>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Category Name</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {categories.map((cat, index) => (
              <tr key={cat.categories_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.categories_name} className="h-full w-full object-cover" />
                    ) : (
                      <Image className="text-gray-400" size={20} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{cat.categories_name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                   <button
  onClick={() => {
    setEditId(cat.categories_id);
    setNewCategory({
      name: cat.categories_name,
      image: cat.image_url,
    });
    setIsModalOpen(true);
  }}
>
  <Edit size={18} />
</button>

                    <button
  onClick={() => deleteCategory(cat.categories_id)}
  className="text-red-500 hover:text-red-700"
>
  <Trash2 size={18} />
</button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Category */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Create New Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full border p-2.5 rounded-lg border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Beverages"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="file" 
                    onChange={handleImageChange}
                    className="hidden" 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {newCategory.image ? (
                      <img src={newCategory.image} className="h-20 w-20 mx-auto object-cover rounded-md" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image className="text-gray-300 mb-2" size={32} />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-md"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;