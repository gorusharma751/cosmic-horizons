'use client'
import { useState } from 'react'
import { Users, Phone, ShoppingBag, TrendingUp, Star, Wallet, ArrowUpRight, ArrowDownRight, Activity, UserCheck, Radio } from 'lucide-react'

const STATS = [
  { label: 'Total Users', value: '1,24,582', change: '+12.5%', up: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Active Pandits', value: '486', change: '+8', up: true, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Consultations Today', value: '3,241', change: '+18.2%', up: true, icon: Phone, color: 'text-saffron-400', bg: 'bg-saffron-500/10' },
  { label: "Today's Revenue", value: '₹2,84,500', change: '+22.4%', up: true, icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-500/10' },
  { label: 'Orders Today', value: '142', change: '-5', up: false, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Wallet Transactions', value: '₹98,240', change: '+15.1%', up: true, icon: Wallet, color: 'text-teal-400', bg: 'bg-teal-500/10' },
]

const RECENT_CONSULTATIONS = [
  { id: 'C001', user: 'Priya Sharma', pandit: 'Pt. Rajesh', type: 'Call', duration: '12 min', amount: 420, status: 'completed' },
  { id: 'C002', user: 'Rahul Gupta', pandit: 'Acharya Deepak', type: 'Chat', duration: '8 min', amount: 160, status: 'active' },
  { id: 'C003', user: 'Sunita Devi', pandit: 'Pt. Trivedi', type: 'Video', duration: '25 min', amount: 2500, status: 'completed' },
  { id: 'C004', user: 'Amit Kumar', pandit: 'Priya Devi', type: 'Call', duration: '5 min', amount: 175, status: 'completed' },
  { id: 'C005', user: 'Meena Joshi', pandit: 'Pt. Vijay', type: 'Chat', duration: '15 min', amount: 450, status: 'cancelled' },
]

const PENDING_PANDITS = [
  { name: 'Acharya Sunil Verma', expertise: 'Kundli, Numerology', experience: 8, joined: '2 hours ago' },
  { name: 'Pt. Ravi Shankar', expertise: 'Vastu, Lal Kitab', experience: 12, joined: '5 hours ago' },
  { name: 'Jyotishi Kavita', expertise: 'Tarot, Angel Cards', experience: 4, joined: '1 day ago' },
]

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                period === p ? 'bg-saffron-500 text-white' : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="glass-card p-5 hover:border-gold-400/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Consultations */}
        <div className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Consultations</h3>
            <Activity className="w-4 h-4 text-saffron-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-400/10">
                  <th className="text-left py-2 text-gray-400 font-medium">ID</th>
                  <th className="text-left py-2 text-gray-400 font-medium">User</th>
                  <th className="text-left py-2 text-gray-400 font-medium hidden md:table-cell">Pandit</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-2 text-gray-400 font-medium hidden sm:table-cell">Amount</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_CONSULTATIONS.map(c => (
                  <tr key={c.id} className="border-b border-gold-400/5 hover:bg-white/3 transition-colors">
                    <td className="py-2.5 text-gray-500 font-mono text-xs">{c.id}</td>
                    <td className="py-2.5 text-white">{c.user}</td>
                    <td className="py-2.5 text-gray-300 hidden md:table-cell">{c.pandit}</td>
                    <td className="py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400">{c.type}</span>
                    </td>
                    <td className="py-2.5 text-green-400 font-medium hidden sm:table-cell">₹{c.amount}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        c.status === 'active' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Live now */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-red-400" />
              <h3 className="font-semibold text-white text-sm">Live Right Now</h3>
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
            </div>
            <div className="space-y-3">
              {[
                { pandit: 'Pt. Rajesh Sharma', viewers: 2341, topic: 'Daily Rashifal' },
                { pandit: 'Acharya Deepak', viewers: 892, topic: 'Vastu Tips' },
              ].map(s => (
                <div key={s.pandit} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white font-medium">{s.pandit}</p>
                    <p className="text-xs text-gray-500">{s.topic}</p>
                  </div>
                  <span className="text-xs text-gray-400">{s.viewers.toLocaleString()} 👁</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Pandit Approvals */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm">Pending Approvals</h3>
              <span className="text-xs bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 px-2 py-0.5 rounded-full">
                {PENDING_PANDITS.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {PENDING_PANDITS.map(p => (
                <div key={p.name} className="text-sm border-b border-gold-400/5 pb-3 last:border-0 last:pb-0">
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.expertise} • {p.experience}yr exp</p>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-1 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue mini chart placeholder */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Revenue (7 days)</h3>
            <div className="flex items-end gap-1 h-20">
              {[40, 65, 55, 80, 72, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-saffron-gradient opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
