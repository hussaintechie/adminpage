import React, { useState, useEffect,useRef  } from 'react'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination' // 1. Import Pagination Component
import {
  getAdminOrdersAPI,
  getSingleOrderAPI,
  markOutForDeliveryAPI,
  printInvoiceAPI
} from "../api/orders";



import { 
  Filter, FileSpreadsheet, ChevronLeft, Printer, Calendar, Clock, Phone, Mail, MapPin, 
  ChevronRight, Package, User, X, Check, ChevronDown, FileText, Truck, Image as ImageIcon, CreditCard, RefreshCcw
} from 'lucide-react'

import toast, { Toaster } from "react-hot-toast";


const parseLocalDateTime = (str) => {
  // "2026-01-18 07:27:00"
  const [date, time] = str.split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm, ss] = time.split(":").map(Number);

  // Month is 0-based in JS
  return new Date(y, m - 1, d, hh, mm, ss);
};

const formatDeliverySlot = (startStr, endStr) => {
  if (!startStr) return "-";

  const start = new Date(startStr.replace(" ", "T"));
  const end = endStr ? new Date(endStr.replace(" ", "T")) : null;

  const dateStr = start.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const startTime = start.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // ✅ IMMEDIATE ORDER
  if (!endStr) {
    return `${dateStr} • ${startTime} (Immediate)`;
  }

  // ✅ SLOT ORDER
  const endTime = end.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr} • ${startTime} – ${endTime}`;
};





export default function Orders() {
 


  



    const [orderDetails, setOrderDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
  
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // --- FILTER STATES ---
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 

  // --- HELPER: Get Color based on Status ---
  const getStatusColor = (status) => {
    if (!status) return 'text-slate-500';
    const normalized = status.toLowerCase().replaceAll(' ', '_');

    switch (normalized) {
      case 'pending': return 'text-amber-600';
      case 'out_for_delivery': return 'text-blue-600';
      case 'delivered': return 'text-emerald-600';
      default: return 'text-slate-500';
    }
  };

  // --- ACTIONS HANDLERS ---
  const handlePrintInvoice = async (e, orderId) => {
    e.stopPropagation();
    try {
      const res = await printInvoiceAPI(orderId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const win = window.open(url);
      win.onload = () => {
        win.focus();
        win.print();
      };
    } catch (err) {
      console.error("Invoice print failed", err);
      toast.error("Unable to print invoice");
    }
  };

  const handleOutForDelivery = async (e, orderId, status) => {
    e.stopPropagation();
    if (status === "delivered") {
      toast.error("This order has already been delivered.");
      return;
    }
    const confirmAction = window.confirm("Are you sure you want to mark this order as Out for Delivery?");
    if (!confirmAction) return;

    try {
      const res = await markOutForDeliveryAPI(orderId);
      if (res.data.status === 1) {
        fetchorders(); 
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  // --- RESET FILTERS ---
  const clearFilters = () => {
      setStatusFilter('All');
      setDateFilter('');
      setMonthFilter('');
      setYearFilter('');
      setIsFilterOpen(false);
      setCurrentPage(1);
  }

  // --- FILTER LOGIC ---
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) return false;

    const orderDate = new Date(order.date || '2023-12-12'); 

    if (dateFilter) {
        const selectedDate = new Date(dateFilter);
        if (orderDate.toDateString() !== selectedDate.toDateString()) return false;
    }
    if (monthFilter !== '') {
        if (orderDate.getMonth() !== parseInt(monthFilter)) return false;
    }
    if (yearFilter !== '') {
        if (orderDate.getFullYear() !== parseInt(yearFilter)) return false;
    }
    return true;
  })

  // --- PAGINATION LOGIC (FIXED) ---
  // Since API returns exactly 'itemsPerPage' data for 'currentPage', we do NOT slice again.
  const currentItems = filteredOrders; 

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter, monthFilter, yearFilter]);

  const STATUS_OPTIONS = ['All', 'Pending', 'delivered', 'out_for_delivery'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const YEARS = ['2023', '2024', '2025']

  useEffect(()=>{
    fetchorders();
  },[currentPage]) // Fetch when page changes

  

 const fetchorders = async () => {
  try {
    setLoading(true);

    const res = await getAdminOrdersAPI(currentPage, itemsPerPage);

    console.log("ADMIN ORDERS API 👉", res.data);

    if (res.data.status === 1) {
      setOrders(
        res.data.data.map(o => ({
          id: o.order_id,
          orderNo: o.order_no,
          amount: `₹${o.total_amount}`,
          status: o.order_status,
          customer: o.name || "Guest",
          items: Number(o.item_count) || 0,
          deliveryStart: o.delivery_start,
          deliveryEnd: o.delivery_end,
        }))
      );

      // ✅ IMPORTANT
      setTotalOrders(res.data.total);
    }
  } catch (err) {
    console.error("Admin order fetch failed", err);
  } finally {
    setLoading(false);
  }
};


  const handleViewOrder = async (orderId) => {
    try {
      setDetailsLoading(true);
      const res = await getSingleOrderAPI(orderId);

      if (res.data.status !== 1) {
        throw new Error("Order not found");
      }

      const apiData = res.data.data;

      setOrderDetails({
  id: `#ORD-${orderId}`,
  status: "Pending",
  date: apiData.paydetails.pay_date,
  time: "",
  summary: {
    itemTotal: apiData.billdetails.item_total,
    handlingFee: apiData.billdetails.handling_fee,
    deliveryFee: apiData.billdetails.delivery_fee,
    discount: apiData.billdetails.discount,
    total: apiData.billdetails.total_amount,
    couponCode: apiData.billdetails.coupon_code,
  },
  customer: {
    name: apiData.customer.name || "guest",
    phone: apiData.customer.phone ||"-",
    address: apiData.address,
  },
  paydetails: { 
    pay_mode: apiData.paydetails.pay_mode,
  },
  items: apiData.itmdetails.map((itm, idx) => ({
    id: idx + 1,
    name: itm.itmname,
    price: itm.price,
    qty: itm.qty,
    total: itm.total 
  })),
});


      setSelectedOrderId(orderId);

    } catch (err) {
      console.error("Single order fetch failed", err);
      toast.error("Unable to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // --- DETAIL VIEW RENDER ---
  if (selectedOrderId) {
    if (detailsLoading) return <div className="p-10 text-center text-slate-500">Loading order details...</div>;
    if (!orderDetails) return <div className="p-10 text-center text-red-500">Failed to load order details<br /><button className="mt-4 underline" onClick={() => setSelectedOrderId(null)}>Go Back</button></div>;
  
    return (
      <div className="max-w-6xl mx-auto pb-24 md:pb-10 min-h-screen px-4 md:px-8 py-6 animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 py-3 flex items-center justify-between md:hidden shadow-sm">
          <button onClick={() => setSelectedOrderId(null)} className="flex items-center gap-1 text-slate-700 font-semibold active:text-slate-900">
              <ChevronLeft size={20} /> Back
          </button>
          <div className="scale-90 origin-right"><StatusBadge status={orderDetails.status} /></div>
        </div>
        
        <div className="hidden md:flex items-center justify-between mb-6">
          <button onClick={() => setSelectedOrderId(null)} className="flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <ChevronLeft size={20} className="mr-1" /> Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 md:mt-0">
            <div className="lg:col-span-2 space-y-6">
           
                <div className="bg-linear-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg">
                  

                  
                      
                        <div>
                            <h2 className="font-bold text-xl text-slate-800 mb-1">{orderDetails.id}</h2>
                            <p className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14} /> {orderDetails.date}  {orderDetails.time}</p>
                        </div>
                       
   <div className="space-y-3">


  {/* ITEM TOTAL */}
  <div className="flex justify-between items-center text-sm text-slate-600">
    <span>Item Total</span>
    <span className="font-semibold text-slate-800">₹{orderDetails.summary.itemTotal}</span>
  </div>

  {/* HANDLING */}
  <div className="flex justify-between items-center text-sm text-slate-600">
    <span>Handling Fee</span>
    <span className="font-semibold text-slate-800">₹{orderDetails.summary.handlingFee}</span>
  </div>

  {/* DELIVERY */}
  <div className="flex justify-between items-center text-sm text-slate-600">
    <span>Delivery Fee</span>
    <span className="font-semibold text-slate-800">₹{orderDetails.summary.deliveryFee}</span>
  </div>

  {/* COUPON */}
  {orderDetails.summary.discount > 0 && (
    <div className="flex justify-between items-center bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-green-700 text-sm font-medium">
      <span className="flex items-center gap-1">
        🎉 {orderDetails.summary.couponCode || "COUPON"}
      </span>
      <span>-₹{orderDetails.summary.discount}</span>
    </div>
  )}

  {/* Divider */}
  <div className="h-px bg-slate-200 my-3"></div>

  {/* TOTAL */}
  <div className="flex justify-between items-center text-lg font-bold text-slate-900">
    <span>Total</span>
    <span className="text-emerald-600">₹{orderDetails.summary.total}</span>
  </div>
</div>


                    
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
                      <Package size={18} className="text-slate-400"/> Order Items
                    </div>
                    <div className="divide-y divide-slate-100">
                        {orderDetails.items.map((item) => (
                        <div key={item.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                                   <ImageIcon size={20}/>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">₹{item.price} x {item.qty}</p>
                                </div>
                            </div>
                            <p className="font-bold text-slate-800 text-sm">₹{item.total}</p>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-5 h-fit">
                <div>
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3">Customer</h3>
                  <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2.5 rounded-full text-blue-600 border border-blue-100"><User size={20} /></div>
                      <div>
                          <p className="font-bold text-sm text-slate-800">{orderDetails.customer.name}</p>
                          <div className="flex gap-3 text-slate-600"> {orderDetails.customer.phone}</div>
                      </div>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                    <div className="flex gap-3 text-slate-600"><MapPin size={16} className="text-slate-400"/> {orderDetails.customer.address}</div>
                    <div className="flex gap-3 text-slate-600 items-center pt-2 border-t border-slate-50 mt-2">
                        <CreditCard size={16} className="text-slate-400"/> 
                        <span className="font-medium">
                            {orderDetails.paydetails.pay_mode}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }

  // --- MAIN LIST RENDER ---
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 p-4 md:p-6 animate-in fade-in duration-300 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Orders</h1>
                <p className="text-slate-500 text-sm mt-1">
                   {(statusFilter !== 'All' || dateFilter || monthFilter || yearFilter) 
                     ? `Found ${filteredOrders.length} results` 
                     : `All Orders (${totalOrders})`}
                </p>
            </div>
            
            <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex items-center justify-center w-10 h-10 bg-slate-800 text-white rounded-xl shadow-lg active:scale-90 transition-transform">
                <Filter size={18} />
            </button>
         </div>

         <div className="hidden md:flex gap-3 relative">
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium shadow-sm transition-all ${
                        isFilterOpen || statusFilter !== 'All' || dateFilter || monthFilter || yearFilter
                        ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-100' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <Filter size={16} /> <span>Filters</span> <ChevronDown size={14} />
                </button>
                
                {isFilterOpen && (
                    <div className="absolute top-12 right-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 p-4">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Status</h4>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-emerald-500 bg-slate-50">
                                    {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                            <div className="h-px bg-slate-100"></div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Time Period</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-medium block mb-1">Specific Date</label>
                                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-emerald-500"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-medium block mb-1">Month</label>
                                            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-emerald-500 bg-white">
                                                <option value="">Any</option>
                                                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 font-medium block mb-1">Year</label>
                                            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-slate-700 outline-none focus:border-emerald-500 bg-white">
                                                <option value="">Any</option>
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"><RefreshCcw size={14}/> Reset Filters</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* --- CREATIVE MOBILE CARDS --- */}
      <div className="md:hidden space-y-4">
        {currentItems.map((order) => (
          <div key={order.id} onClick={() => handleViewOrder(order.id)} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden active:scale-[0.98] transition-all duration-200">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(order.status)}`}></div>
            <div className="p-4 pl-5">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-800 text-lg">{order.id}</span>
                    <span className="font-bold text-emerald-600 text-lg">{order.amount}</span>
                </div>
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-200"><ImageIcon size={20} /></div>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">{order.customer}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{order.items} Items • <span className="font-medium text-slate-400">{order.status}</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={(e) => handlePrintInvoice(e, order.id)} className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100 hover:bg-slate-100"><FileText size={14} /> Invoice</button>
                    <button
                        onClick={(e) => handleOutForDelivery(e, order.id, order.status)}
                        disabled={order.status === "delivered"}
                        className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg border transition-colors ${
                            order.status === "delivered"
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                        }`}
                        >
                        <Truck size={14} /> Delivery
                    </button>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-50 border-dashed">
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-600">View Details <ChevronRight size={12} /></div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Delivery Slot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <p className="font-medium">No orders found</p>
                    <p className="text-sm text-slate-400 mt-1">Try changing filters or date range</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleViewOrder(order.id)}>
                    <td className="px-6 py-4"><div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200"><ImageIcon size={20} /></div></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{order.customer}</td>
                    <td className="px-6 py-4"><div className="font-bold text-slate-700 text-sm">{formatDeliverySlot(order.deliveryStart, order.deliveryEnd)}</div></td>
                    <td className="px-6 py-4"><span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>{order.status.replaceAll('_', ' ')}</span></td>
                    <td className="px-6 py-4 text-slate-500">{order.items}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{order.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => handlePrintInvoice(e, order.id)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Print Invoice"><FileText size={18} /></button>
                        <button
                            onClick={(e) => handleOutForDelivery(e, order.id, order.status)}
                            disabled={order.status === "delivered"}
                            className={`p-2 rounded-lg transition-colors ${
                                order.status === "delivered" ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                            }`}
                            title={order.status === "delivered" ? "Order already delivered" : "Mark Out for Delivery"}
                        >
                            <Truck size={18} />
                        </button>
                        <span className="text-slate-300 mx-1">|</span>
                        <ChevronRight size={18} className="text-slate-400" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>

      {/* --- REUSABLE PAGINATION COMPONENT --- */}
      <Pagination 
        currentPage={currentPage}
        totalItems={totalOrders} 
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* --- MOBILE FILTER SHEET --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => !loading && setIsFilterOpen(false)} />
            <div className="relative bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
                {loading && (
                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-t-3xl">
                        <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-3"></div>
                        <p className="text-sm font-medium text-slate-600">Applying filters...</p>
                    </div>
                )}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Filter Orders</h3>
                    <button disabled={loading} onClick={() => setIsFilterOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500 disabled:opacity-50"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Status</label>
                        <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map(status => (
                                <button key={status} disabled={loading} onClick={() => setStatusFilter(status)} className={`p-3 rounded-xl text-sm font-medium transition-all ${statusFilter === status ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-600'} ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-sm font-bold text-slate-700">Time Period</label>
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Specific Date</label>
                            <input type="date" value={dateFilter} disabled={loading} onChange={(e) => setDateFilter(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-50"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Month</label>
                                <select value={monthFilter} disabled={loading} onChange={(e) => setMonthFilter(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-50">
                                    <option value="">Any</option>
                                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Year</label>
                                <select value={yearFilter} disabled={loading} onChange={(e) => setYearFilter(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-50">
                                    <option value="">Any</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={clearFilters} disabled={loading} className="flex-1 py-3 text-red-500 font-bold bg-red-50 rounded-xl disabled:opacity-50">Reset</button>
                        <button disabled={loading} onClick={() => setIsFilterOpen(false)} className="  py-3 text-white font-bold bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}