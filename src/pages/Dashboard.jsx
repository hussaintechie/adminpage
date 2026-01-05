import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import RatingStars from '../components/RatingStars'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ShoppingBasket, DollarSign, Clock, AlertTriangle, Package, User, Calendar, ChevronRight, TrendingUp, ArrowUpRight } from 'lucide-react'
import { MOCK_RECENT_ORDERS } from '../data/mockData'
// --- INTERNAL MOCK DATA (To prevent white screen) ---

// --- CUSTOM TOOLTIP COMPONENT ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-sm">
        <p className="font-medium mb-1 opacity-70">{label}</p>
        <p className="font-bold text-lg flex items-center gap-1">
          ₹{payload[0].value.toLocaleString()}
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-2">+4.2%</span>
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN COMPONENT ---
const Dashboard = () => {
  // Using internal data defaults
  const navigate = useNavigate();
  const [orderCount, setOrdercount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [totpendingorder, setPendingorder] = useState(0);
  const [lowstockcnt, setLowstkcnt] = useState(0);

  const [orderTrend, setOrderTrend] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState(0);
  const [pendingTrend, setPendingTrend] = useState(0);
  const [lowStockTrend, setLowStockTrend] = useState(0);



  const recentOrders = MOCK_RECENT_ORDERS;
  const [chartPeriod, setChartPeriod] = useState('Week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [revenueData, setRevenuedata] = useState([]);
  const [lowstockData, setLowstockstkdata] = useState([]);
  const [revenutotal, setTotalrevenue] = useState(0);
  const API_URL = "http://localhost:5000/product/getDashboardDatas";
  const Chartapi_URL = "http://localhost:5000/product/getChartdetails";

  const calculateTrend = (today, yesterday) => {
    if (!yesterday || yesterday === 0) return 0;
    return Number((((today - yesterday) / yesterday) * 100).toFixed(1));
  };


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const resetDashboard = () => {
    setOrdercount(0);
    setRevenue(0);
    setPendingorder(0);
    setLowstkcnt(0);
  };

  const handleDashboard = async () => {
    const formattedDate = formatDate(selectedDate)

    try {
      const res = await axios.post(API_URL, {
        date: formattedDate,
        chartmode: chartPeriod,
      })

      const apiData = res.data?.data?.data

      if (res.data?.status === 1 && apiData) {
        const { summary, lowstockdetailsres } = apiData

        const todayOrders = Number(summary?.today_orders || 0)
        const yesterdayOrders = Number(summary?.yesterday_orders || 0)

        const todayRevenue = Number(summary?.today_revenue || 0)
        const yesterdayRevenue = Number(summary?.yesterday_revenue || 0)

        const todayPending = Number(summary?.today_pending || 0)
        const yesterdayPending = Number(summary?.yesterday_pending || 0)

        setOrdercount(todayOrders)
        setRevenue(todayRevenue)
        setPendingorder(todayPending)
        setLowstkcnt(lowstockdetailsres?.length || 0)
        setLowstockstkdata(lowstockdetailsres);

        console.log(lowstockdetailsres, "lowstockdetailsreslowstockdetailsreslowstockdetailsres");
        // setChartData(chartres || [])
        //setLowStockItems(lowstockdetailsres || [])

        setOrderTrend(calculateTrend(todayOrders, yesterdayOrders))
        setRevenueTrend(calculateTrend(todayRevenue, yesterdayRevenue))
        setPendingTrend(calculateTrend(todayPending, yesterdayPending))
      } else {
        resetDashboard()
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      resetDashboard()
    }
  }
  const handleChartdetails = async () => {
    try {
      const res = await axios.post(Chartapi_URL, {
        chartmode: chartPeriod, // "Week" | "Month" | "Year"
      });

      const chartArray = res.data?.data?.data; // ✅ correct path

      var totchartrev = 0;
      if (Array.isArray(chartArray)) {
        setRevenuedata(
          chartArray.map(item => ({
            name: item.name,
            sales: Number(item.sales || 0),
          }))
        );
        const totalSales = chartArray
          .filter(item => Number(item.sales) > 0)
          .reduce((sum, item) => sum + Number(item.sales || 0), 0);

        setTotalrevenue(totalSales);
        console.log("Total Sales:", totalSales);
      } else {
        setRevenuedata([]);
      }
    } catch (err) {
      console.error("Chart fetch error:", err);
      setRevenuedata([]);
    }
  };



  useEffect(() => {
    handleDashboard();
  }, [selectedDate]);

  useEffect(() => {
    handleChartdetails();
  }, [chartPeriod]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time updates for Wake Up Servicios</p>
        </div>
        {/* <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
           <Calendar size={14} /> 
           <span>Today: Dec 09, 2025</span>
        </div> */}
        <div className="hidden md:flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Calendar size={14} className="text-slate-500" />

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMM yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"

            className="outline-none text-slate-600 cursor-pointer w-[120px]"
            calendarClassName="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={orderCount} icon={ShoppingBasket} color="bg-blue-500" trend={orderTrend} />
        <StatCard title="Total Revenue" value={`₹${revenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" trend={revenueTrend} />
        <StatCard title="Pending Orders" value={totpendingorder} icon={Clock} color="bg-amber-500" trend={pendingTrend} />
        <StatCard title="Low Stock Items" value={lowstockcnt} icon={AlertTriangle} color="bg-red-500" trend={lowStockTrend} />
      </div>

      {/* Charts & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- CREATIVE REVENUE CHART --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Chart Header */}
          <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold text-slate-900">₹{revenutotal.toLocaleString()}</span>
                <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={14} className="mr-1" /> +12.5%
                </span>
              </div>
            </div>

            {/* Period Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-center">
              {['Week', 'Month', 'Year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${chartPeriod === period
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-[300px] w-full px-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- LOW STOCK ALERT --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-lg text-red-500">
                <AlertTriangle size={18} />
              </div>
              Low Stock
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700" onClick={() => navigate("/inventory?tab=low_stock")}>View All</button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {lowstockData.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors group">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0 shadow-sm text-slate-400 font-medium">
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">{item.name}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-red-600 mb-1">{item.stock} left</p>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors flex items-center justify-end gap-1">
                    Restock <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
          <button className="flex items-center text-sm text-emerald-600 font-bold hover:text-emerald-700 group">
            View All Orders <ChevronRight size={16} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                        {order.customer.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">{order.items} items</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{order.amount}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{order.deliveryTime}</td>
                  <td className="px-6 py-4 flex justify-center"><RatingStars rating={order.rating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {recentOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID {order.id}</span>
                  <div className="font-bold text-slate-800 text-lg mt-0.5">{order.amount}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 py-3 border-t border-b border-slate-50 my-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold border border-slate-100">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{order.customer}</p>
                  <p className="text-xs text-slate-500">{order.items} Items • {order.deliveryTime}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <RatingStars rating={order.rating} />
                <button className="text-sm font-bold text-blue-600 flex items-center">Details <ChevronRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard