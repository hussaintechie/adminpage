import { useEffect, useState } from "react";
import axios from "axios";

const Stockreport = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState("all");
  const [reportdata, setLowdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  /* ================= FETCH DATA ================= */
  const fetcStocklist = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://api.sribalajistores.com/product/StockReport",
        {
          reporttyp: stockFilter,
        }
      );

      console.log("Response Data:", res.data);

      // Response structure: res.data = { status: 1, data: { data: [], status: 1, message: "" } }
      // We need to access res.data.data.data to get the actual array
      if (res.data?.status === 1 && res.data?.data?.data && Array.isArray(res.data.data.data)) {
        const dataArray = res.data.data.data;
        setLowdata(dataArray);
        setFilteredData(dataArray);
        setTotalItems(dataArray.length);
      } else {
        setLowdata([]);
        setFilteredData([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Stock fetch failed", err);
      setLowdata([]);
      setFilteredData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetcStocklist();
  }, [stockFilter]);

  useEffect(() => {
    if (!reportdata || reportdata.length === 0) {
      setFilteredData([]);
      return;
    }

    if (search.trim() === "") {
      setFilteredData(reportdata);
    } else {
      const filtered = reportdata.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search, reportdata]);

  /* ================= HANDLERS ================= */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStockFilter(e.target.value);
    setSearch(""); // Reset search when filter changes
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-800">Stock Report</h3>
            <p className="text-xs text-gray-500 mt-1">
              Total Items: {filteredData.length} {search && `of ${reportdata.length}`}
            </p>
          </div>

          <div className="flex justify-between items-center gap-3">
            <select
              value={stockFilter}
              onChange={handleFilterChange}
              className="text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All</option>
              <option value="in">In Stock</option>
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
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? `No items found matching "${search}"` : "No items found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">SNo</th>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Openbal Qty</th>
                  <th className="px-6 py-4">In Qty</th>
                  <th className="px-6 py-4 text-right">Out Qty</th>
                  <th className="px-6 py-4 text-right">Available Qty</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.product_id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 text-left">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-left">{item.unitname}</td>
                    <td className="px-6 py-4 text-center">{item.openbalqty}</td>
                    <td className="px-6 py-4 text-center">{item.in_qty}</td>
                    <td className="px-6 py-4 text-center">{item.out_qty}</td>
                    <td className="px-6 py-4 text-center font-semibold">
                      {item.current_stock}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stockreport;