import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import {
    Plus,
    Pencil,
    XCircle,
    Search,
    Calendar,
    Package,
} from "lucide-react";
import Pagination from "../components/purchsepagenation";

/* ---------------- CONSTANTS ---------------- */
const LIMIT = 10;
const LIST_API = "product/purchaselist";
const CANCEL_API = "product/cancelPurchase";


/* ---------------- MAIN COMPONENT ---------------- */
const PurchaseStockList = ({ onAdd, onEdit, onBack,openAdd  }) => {
    const location = useLocation();
useEffect(() => {
  if (openAdd === "true" && onAdd) {
    onAdd();
  }
}, [openAdd]);

    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    /* -------- SEARCH -------- */
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    /* -------- DATE FILTER -------- */
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    /* -------- OFFSET -------- */
    const offset = (currentPage - 1) * LIMIT;

    /* -------- FETCH DATA -------- */
    useEffect(() => {
        fetchPurchaseList();
        // eslint-disable-next-line
    }, [currentPage, search, fromDate, toDate]);

    const fetchPurchaseList = async () => {
        try {
            setLoading(true);

            const payload = {
                search: search || "",
                fromDate: fromDate || null,
                toDate: toDate || null,
                limit: LIMIT,
                offset,
            };

            const res = await API.post(LIST_API, payload);


            if (res.data.status === 1) {
                setData(res.data.data);
                setTotalCount(res.data.total);
            } else {
                setData([]);
                setTotalCount(0);
            }

            console.log(data, 'datadadhfd');
        } catch (err) {
            console.error(err);
            toast.error("Failed to load purchase list");
            setData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    /* -------- SEARCH BUTTON -------- */
    const handleSearch = () => {
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            toast.error("From date cannot be greater than To date");
            return;
        }
        setSearch(searchInput);
        setCurrentPage(1);
    };

    /* -------- RESET -------- */
    const handleReset = () => {
        setSearchInput("");
        setSearch("");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    /* -------- CANCEL WITH TOAST -------- */
    const handleCancel = (purchaseid) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-semibold">Cancel this purchase?</span>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        No
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmCancel(purchaseid);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const confirmCancel = async (purchaseid) => {
        try {
            const res = await API.post(CANCEL_API, { 'purchase_id': purchaseid });

            if (res.data.status === 1) {
                setData((prev) =>
                    prev.map((row) =>
                        row.purchaseid === purchaseid
                            ? { ...row, status: "Cancelled" }
                            : row
                    )
                );
                toast.success("Purchase cancelled successfully");
            } else {
                toast.error(res.data.message || "Cancel failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while cancelling");
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-emerald-600" />
                        Purchase / Stock List
                    </h1>
                    <button onClick={onAdd} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg">
                        <Plus size={18} /> Add Purchase
                    </button>
                </div>

                {/* FILTER BAR */}
                <div className="bg-white p-4 rounded-xl border grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                    {/* SEARCH */}
                    <div>
                        <label className="text-xs font-semibold">Search</label>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                            <Search size={16} />
                            <input
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Purchase No / Reference"
                                className="w-full outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* FROM DATE */}
                    <div>
                        <label className="text-xs font-semibold">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* TO DATE */}
                    <div>
                        <label className="text-xs font-semibold">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <button onClick={handleSearch} className="bg-emerald-600 text-white py-2 rounded-lg">
                        Search
                    </button>

                    <button onClick={handleReset} className="bg-gray-100 py-2 rounded-lg">
                        Reset
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left">S.No</th>
                                <th className="px-6 py-4 text-left">Purchase No</th>
                                <th className="px-6 py-4 text-left">Reference</th>
                                <th className="px-6 py-4 text-left">Purchase Date</th>
                                <th className="px-6 py-4 text-left">Total Amount</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                            )}

                            {!loading && data.map((row, index) => (
                                <tr key={row.purchaseid} className="border-t">
                                    <td className="px-6 py-4">{offset + index + 1}</td>
                                    <td className="px-6 py-4 font-semibold">{row.purchase_no}</td>
                                    <td className="px-6 py-4">{row.refrence || "-"}</td>
                                    <td className="px-6 py-4">{row.date}</td>
                                    <td className="px-6 py-4">{row.totamt}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {row.status !== "Cancelled" && (
                                            <>
                                                <button
                                                    onClick={() => onEdit({ purchase_id: row.purchaseid })}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleCancel(row.purchaseid)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {!loading && data.length === 0 && (
                                <tr><td colSpan="6" className="text-center py-8">No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <Pagination
                    totalItems={totalCount}
                    currentPage={currentPage}
                    itemsPerPage={LIMIT}
                    onPageChange={setCurrentPage}
                />

            </div>
        </div>
    );
};

export default PurchaseStockList;
