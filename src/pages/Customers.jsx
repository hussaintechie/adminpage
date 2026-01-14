import React, { useState } from 'react';
import { Search, CheckCircle2, Mail, Phone, MapPin, X, Package, Clock, Receipt, ChevronDown, ChevronUp, CreditCard, Calendar, Filter } from 'lucide-react';
import { useEffect } from "react";
import {
  getCustomersAPI,
  getUserOrdersAPI
} from "../api/customer";   // adjust path if needed

// --- MOCK DATA ---yy


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper to generate fake order history

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100',
    out_for_delivery: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    Processing: 'bg-blue-100 text-blue-700 border-transparent',
    Cancelled: 'bg-red-100 text-red-700 border-transparent',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};
const formatDateTime = (timestamp) => {
  const dateObj = new Date(timestamp);

  return {
    date: dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

export default function Customers() {

  const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);
const [total, setTotal] = useState(0);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  useEffect(() => {
  const delay = setTimeout(() => {
    setPage(1);
  }, 400);

  return () => clearTimeout(delay);
}, [searchTerm]);

  
  // --- ORDER HISTORY STATES ---
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [historyDateFilter, setHistoryDateFilter] = useState('');
  const [historyMonthFilter, setHistoryMonthFilter] = useState('');
  const [page, setPage] = useState(1);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);
    
const indexOfFirstItem = (page - 1) * limit;
const indexOfLastItem = Math.min(page * limit, total);


  
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await getCustomersAPI({
        page,
        limit,
        search: searchTerm,
      });

      if (res.data.status === 1) {
        setCustomers(res.data.data);
        setTotal(res.data.total);
        setTotalPages(Math.ceil(res.data.total / limit));
      }
    } catch (err) {
      console.error("Customers fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, [page, searchTerm]);

  // 1. Get Base Orders
  const [customerOrders, setCustomerOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);
useEffect(() => {
  if (!selectedCustomer) return;

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);

      const res = await getUserOrdersAPI(selectedCustomer.id);

      if (res.data.status === 1) {
        setCustomerOrders(res.data.data); // orders array
      }
    } catch (err) {
      console.error("Orders fetch error", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  fetchOrders();
}, [selectedCustomer]);


  // 2. Apply Date/Month Filters
  const filteredHistory = customerOrders.filter(order => {
  const orderDateObj = new Date(order.created_at);

  if (historyDateFilter) {
    const filterDateObj = new Date(historyDateFilter);
    if (orderDateObj.toDateString() !== filterDateObj.toDateString()) {
      return false;
    }
  }

  if (historyMonthFilter !== '') {
    if (orderDateObj.getMonth() !== parseInt(historyMonthFilter)) {
      return false;
    }
  }

  return true;
});


  // 3. Apply View Limit (Show 3 or All)
  const displayedOrders = showAllOrders ? filteredHistory : filteredHistory.slice(0, 3);

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setShowAllOrders(false);
    setHistoryDateFilter('');
    setHistoryMonthFilter('');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 animate-in fade-in duration-300">
       
       {/* Header Section */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div> 
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage customer access and view detailed order history.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..." 
            className="block w-full md:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle2 size={20} />
            </div>
        </div>
      </div>

      {/* DESKTOP VIEW: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">total order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm border border-blue-100 transition-transform group-hover:scale-105">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{customer.name}</div>
                       
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                     
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={14} className="text-gray-400" /> {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">{customer.totalOrders}</div>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      

      {/* MOBILE VIEW: Card List */}
      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm border border-blue-100">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                   
                  </div>
              </div>
            </div>
            <div className="space-y-3 text-sm mb-4">
             
               <div className="flex items-center gap-2 text-gray-600">
                  <Package size={14} className="text-gray-400" /> 
                  <span>{customer.totalOrders} Orders</span>
               </div>
            </div>
            <div className="pt-3 border-t border-gray-50 text-xs text-gray-400">
               PHONE : {customer.phone}
            </div>
          </div>
        ))}
      </div>
      {/* PAGINATION FOOTER */}
{/* PAGINATION FOOTER */}
{customers.length > 0 && (
  <div className="mt-6 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">

    {/* LEFT: Showing results */}
    <p className="text-sm text-gray-700">
      Showing{" "}
      <span className="font-semibold">
        {indexOfFirstItem + 1}
      </span>{" "}
      to{" "}
      <span className="font-semibold">
        {indexOfLastItem}
      </span>{" "}
      of{" "}
      <span className="font-semibold">{total}</span> results
    </p>

    {/* RIGHT: Pagination */}
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">

      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-3 py-2 border-r text-sm transition
          ${
            page === 1
              ? "text-gray-300 cursor-not-allowed bg-gray-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        ‹
      </button>

      {/* Page 1 */}
      <button
        className={`px-4 py-2 text-sm border-r
          ${
            page === 1
              ? "bg-slate-900 text-white font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        onClick={() => setPage(1)}
      >
        1
      </button>

      {/* Page 2 (only if exists) */}
      {totalPages >= 2 && (
        <button
          className={`px-4 py-2 text-sm border-r
            ${
              page === 2
                ? "bg-slate-900 text-white font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          onClick={() => setPage(2)}
        >
          2
        </button>
      )}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-3 py-2 text-sm transition
          ${
            page === totalPages
              ? "text-gray-300 cursor-not-allowed bg-gray-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        ›
      </button>
    </div>
  </div>
)}


      
      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 scale-100 border border-gray-100 h-[95vh] md:h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-lg text-gray-800">Customer Details</h3>
              <button 
                onClick={handleCloseModal} 
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20}/>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Profile & Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner shrink-0">
                        {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            
                        </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">Total Order</p>
                            <p className="text-xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                        </div>
                     
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100 h-fit">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                   
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-400 border border-gray-200 shrink-0"><Phone size={14} /></div>
                    <span className="font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-400 border border-gray-200 shrink-0"><MapPin size={14} /></div>
                    <span className="font-medium leading-snug">{selectedCustomer.full_address}</span>
                    </div>
                  </div>
              </div>

              {/* DETAILED ORDER HISTORY SECTION WITH FILTERS */}
              <div className="pt-4 border-t border-dashed border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Receipt size={16} className="text-blue-500"/> Order History
                        <span className="text-xs font-medium text-gray-400">({filteredHistory.length})</span>
                    </h4>
                    
                    {/* FILTERS UI */}
                    <div className="flex gap-2">
                        {/* Month Select */}
                        <select 
                            value={historyMonthFilter}
                            onChange={(e) => setHistoryMonthFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-200"
                        >
                            <option value="">All Months</option>
                            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>

                        {/* Date Input */}
                        <div className="relative">
                            <input 
                                type="date"
                                value={historyDateFilter}
                                onChange={(e) => setHistoryDateFilter(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg pl-2 pr-1 py-1.5 outline-none focus:ring-1 focus:ring-blue-200"
                            />
                        </div>
                        
                        {(historyDateFilter || historyMonthFilter) && (
                            <button 
                                onClick={() => { setHistoryDateFilter(''); setHistoryMonthFilter(''); }}
                                className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg"
                            >
                                <X size={14}/>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {displayedOrders.length > 0 ? (
                        displayedOrders.map((order, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-blue-300 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">OrderID {order.order_id}</span>
                                        <StatusBadge status={order.order_status} />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                                                  {(() => {
                                          const { date, time } = formatDateTime(order.created_at);

                                          return (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                              <Calendar size={12} /> {date}
                                              <span className="text-gray-300">|</span>
                                              <Clock size={12} /> {time}
                                            </div>
                                          );
                                        })()}
                                                                            
   

                                          </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 text-base">₹{order.total_amount}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{order.items} Items</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                                <CreditCard size={12} className="text-slate-400"/>
                                <span>Paid via <span className="font-semibold text-slate-700">{order.method}</span></span>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No orders found for selected date/month.
                        </div>
                    )}
                </div>

                {/* View All Toggle - Only show if we have more results than displayed AND no specific filter active (optional logic) */}
                {filteredHistory.length > 3 && (
                    <button 
                        onClick={() => setShowAllOrders(!showAllOrders)}
                        className="w-full py-3 mt-4 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-1 border border-blue-100 bg-blue-50/30"
                    >
                        {showAllOrders ? (
                            <>Show Less <ChevronUp size={14}/></>
                        ) : (
                            <>View more Orders <ChevronDown size={14}/></>
                        )}
                    </button>
                )}
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 mt-auto shrink-0">
              <button 
                onClick={handleCloseModal} 
                className="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}