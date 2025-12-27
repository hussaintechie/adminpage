import React, { useState,useEffect} from 'react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import RatingStars from '../components/RatingStars'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ShoppingBasket, DollarSign, Clock, AlertTriangle, Calendar, ChevronRight, TrendingUp, ArrowUpRight } from 'lucide-react'
import { getDashboardData } from "../api/dashboardAPI";


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
  const LOW_STOCK_DATA = [
    { id: 1, name: "Wireless Mouse", category: "Electronics", stock: 8 },
    { id: 2, name: "Bluetooth Headphones", category: "Electronics", stock: 5 },]
    const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  revenueGraph: [],
  recentOrders: []
});

  const [chartPeriod, setChartPeriod] = useState("Month"); // ✅ MOVE UP

 useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();

      console.log("API RESPONSE:", res?.data);

      if (!res?.data || !res.data.data) {
        console.warn("No dashboard data found");
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          revenueGraph: [],
          recentOrders: []
        });
        return;
      }

      const d = res.data.data;

      setStats({
        totalOrders: Number(d.totalOrders || 0),
        totalRevenue: Number(d.totalRevenue || 0),
        pendingOrders: Number(d.pendingOrders || 0),
        revenueGraph: Array.isArray(d.revenueGraph)
          ? d.revenueGraph.map(item => ({
              label: item.label,
              sales: Number(item.value || 0)
            }))
          : [],
        recentOrders: Array.isArray(d.recentOrders) ? d.recentOrders : []
      });

    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);




  // ✅ SAFE CONDITIONAL RENDER
  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }




  return (

    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time updates for Wake Up Servicios</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
           <Calendar size={14} /> 
           <span>Today: Dec 09, 2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <StatCard 
  title="Total Orders" 
  value={stats?.totalOrders ?? 0}
 
  icon={ShoppingBasket} 
  color="bg-blue-500" 
/>

<StatCard 
  title="Total Revenue" 
  value={`₹${stats.totalRevenue}`} 
  icon={DollarSign} 
  color="bg-emerald-500" 
/>

<StatCard 
  title="Pending Orders" 
  value={stats.pendingOrders} 
  icon={Clock} 
  color="bg-amber-500" 
/>

        <StatCard title="Low Stock Items" value="12" icon={AlertTriangle} color="bg-red-500" trend={5.0} />
      </div>

      {/* --- SECTION 1: REVENUE CHART (Independent Div) --- */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chart Header */}
        <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
               <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
               <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-bold text-slate-900">₹₹{(stats?.totalRevenue ?? 0).toLocaleString()}
</span>
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
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          chartPeriod === period 
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
          {console.log("Revenue Graph:", stats.revenueGraph)}

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.revenueGraph}margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  dy={10} 
              />
              <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickFormatter={(v)=>`₹${v/1000}k`} 
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

      {/* --- SECTION 2: LOW STOCK ALERT (Independent Div) --- */}
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-lg text-red-500">
                  <AlertTriangle size={18} /> 
              </div>
              Low Stock
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        
        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
          {LOW_STOCK_DATA.map(item => (
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

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            <button className="flex items-center text-sm text-emerald-600 font-bold hover:text-emerald-700 group">
                View All Orders <ChevronRight size={16} className="ml-0.5 group-hover:translate-x-1 transition-transform"/>
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
              {stats.recentOrders.map(order => (
                <tr key={order.order_no} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{order.order_no}</td>
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                              {order.customer.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-700">{order.customer}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">{order.items} items</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{order.total_amount}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.order_status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{order.deliveryTime}</td>
                  <td className="px-6 py-4 flex justify-center"><RatingStars rating={order.rating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {stats.recentOrders.map(order => (
            <div key={order.order_no} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID {order.order_no}</span>
                    <div className="font-bold text-slate-800 text-lg mt-0.5">{order.total_amount}</div>
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