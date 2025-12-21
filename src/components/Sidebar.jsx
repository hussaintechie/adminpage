import { ShoppingBasket, LayoutDashboard, Package, Users, Truck, Settings, Menu, X, LogOut, Percent, } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingBasket, label: 'Orders', path: '/orders' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Truck, label: 'Drivers', path: '/drivers' },
    {icon: Percent,label:'SuperDeals',path:'/SuperDeals'},
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <>
      {/* ================================================== */}
      {/* MOBILE TOP BAR (Fixed at top)                      */}
      {/* ================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2 text-emerald-600">
            <ShoppingBasket size={24} strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-tight">SB <span className="text-slate-700">Grocers</span></span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
           AD
        </div>
      </div>

      {/* ================================================== */}
      {/* SIDEBAR DRAWER                                     */}
      {/* ================================================== */}
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static md:h-screen md:w-64'}
      `}>
        {/* Header - Desktop */}
        <div className="hidden md:flex h-16 items-center justify-center border-b border-slate-100">
          <div className="flex items-center space-x-2 text-emerald-600">
            <ShoppingBasket size={28} strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight">SB  <span className="text-slate-700">Grocers</span></span>
          </div>
        </div>

        {/* Header - Mobile (Close Button) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100">
           <span className="font-bold text-slate-700">Menu</span>
           <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
             <X size={20} />
           </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm ring-1 ring-emerald-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-sm border border-white">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@sbgrocers.com</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}