import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, ImageIcon } from "lucide-react";
import Pagination from "../components/purchsepagenation";

const ITEMS_PER_PAGE = 10;

const LowStockView = () => {
  const [lowStockItems, setLowdata] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState("low");

  /* ================= FETCH DATA ================= */
  const fetchLowlist = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://api.sribalajistores.com/product/Lowstockdetails",
        {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: search.trim(),
          filtertyp: stockFilter,
        }
      );

      if (res.data?.status === 1) {
        setLowdata(res.data.data || []);
        setTotalItems(res.data.total || 0);
      } else {
        setLowdata([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Low stock fetch failed", err);
      setLowdata([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchLowlist();
  }, [currentPage, search, stockFilter]);

  /* ================= SEARCH ================= */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  /* ================= FILTER CHANGE ================= */
  const handleFilterChange = (e) => {
    setStockFilter(e.target.value);
    setCurrentPage(1);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ALERT */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-orange-800 text-lg">
            Attention Needed
          </h3>
          <p className="text-orange-700/80 text-sm mt-1">
            You have <b>{totalItems}</b> products running low on stock.
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-800">Low Stock Items</h3>
          </div>

          <div className="flex justify-between items-center">
            <select
              value={stockFilter}
              onChange={handleFilterChange}
              className="text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 mr-[5%]"
            >
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search product..."
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : lowStockItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">
                          {item.stock}
                        </span>
                        <span className="text-xs text-slate-400">
                          units left
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.stock <= 0
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.stock <= 0 ? "Out of Stock" : "Low Stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors shadow-md shadow-slate-200">
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalItems > ITEMS_PER_PAGE && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockView;
