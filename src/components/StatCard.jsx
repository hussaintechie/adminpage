import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, icon: Icon, color = 'bg-blue-500', trend = 0 }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <div className={`flex items-center mt-2 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <TrendingUp size={14} className="mr-1" />
          <span>{trend > 0 ? '+' : ''}{trend}% from yesterday</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  )
}
