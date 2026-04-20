'use client'
import {
    MessageCircle,
    Phone,
    Radio,
    Star,
    TrendingUp,
    Users
} from 'lucide-react'

// ===== DASHBOARD PAGE =====
const UPCOMING = [
  { id: 1, user: 'Priya S.', type: 'Video', time: '2:30 PM', duration: '30 min' },
  { id: 2, user: 'Rahul G.', type: 'Call', time: '4:00 PM', duration: '15 min' },
  { id: 3, user: 'Sunita D.', type: 'Chat', time: '6:00 PM', duration: '20 min' },
]

function PanditDashboardContent() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-white mb-1">Jai Shri Ram! 🙏</h1>
        <p className="text-gray-400 text-sm">Aapka aaj ka dashboard</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Calls", value: '12', icon: Phone, color: 'text-saffron-400', bg: 'bg-saffron-500/10' },
          { label: "Today's Earnings", value: '₹4,280', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Avg Rating', value: '4.9★', icon: Star, color: 'text-gold-400', bg: 'bg-gold-500/10' },
          { label: 'Total Clients', value: '1,240', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Upcoming Consultations</h3>
          <div className="space-y-3">
            {UPCOMING.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 glass-card-light rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-saffron-gradient flex items-center justify-center text-white text-xs font-bold">
                    {c.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.user}</p>
                    <p className="text-xs text-gray-400">{c.type} • {c.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-saffron-400">{c.time}</p>
                  <button className="text-xs text-blue-400 hover:text-blue-300">Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings chart */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Weekly Earnings</h3>
          <div className="flex items-end gap-2 h-32 mb-2">
            {[2400, 3100, 2800, 4200, 3800, 4800, 4280].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{Math.round(val/1000)}k</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-saffron-500 to-gold-400 opacity-80 hover:opacity-100 transition-opacity"
                     style={{ height: `${(val / 4800) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
            <p className="text-xs text-gray-400">This week total</p>
            <p className="text-lg font-bold text-green-400">₹25,380</p>
            <p className="text-xs text-green-400">+18% from last week</p>
          </div>
        </div>
      </div>

      {/* Start consultation actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Start Call Session', icon: Phone, color: 'from-saffron-500 to-orange-500', waiting: 3 },
          { label: 'Start Chat Session', icon: MessageCircle, color: 'from-purple-500 to-indigo-500', waiting: 7 },
          { label: 'Go Live', icon: Radio, color: 'from-red-500 to-rose-500', waiting: 0 },
        ].map(action => (
          <button key={action.label} className={`relative p-5 rounded-2xl bg-gradient-to-br ${action.color} text-white font-semibold flex items-center justify-between hover:opacity-90 transition-opacity`}>
            <div className="flex items-center gap-3">
              <action.icon className="w-6 h-6" />
              {action.label}
            </div>
            {action.waiting > 0 && (
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                {action.waiting} waiting
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PanditDashboardPage() {
  return <PanditDashboardContent />
}
