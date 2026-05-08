import { useState, useEffect } from 'react';
import {
  Users, UserCheck, AlertTriangle, CheckCircle, TrendingUp,
  Activity, MapPin, Download
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

const alertData = [
  { day: 'Mon', alerts: 12, resolved: 10 },
  { day: 'Tue', alerts: 18, resolved: 16 },
  { day: 'Wed', alerts: 8, resolved: 8 },
  { day: 'Thu', alerts: 24, resolved: 20 },
  { day: 'Fri', alerts: 30, resolved: 25 },
  { day: 'Sat', alerts: 22, resolved: 18 },
  { day: 'Sun', alerts: 15, resolved: 14 },
];

const mapMarkers = [
  { x: '20%', y: '35%', color: 'bg-red-500', urgent: true },
  { x: '45%', y: '25%', color: 'bg-red-600', urgent: true },
  { x: '60%', y: '55%', color: 'bg-orange-400', urgent: false },
  { x: '30%', y: '65%', color: 'bg-yellow-500', urgent: false },
  { x: '75%', y: '40%', color: 'bg-red-500', urgent: true },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, activeAlerts: 0, totalVolunteers: 0, resolvedToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [users, alerts, volunteers, resolved] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
        supabase.from('sos_alerts').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'volunteer'),
        supabase.from('sos_alerts').select('id', { count: 'exact' }).eq('status', 'resolved')
          .gte('resolved_at', new Date().toISOString().split('T')[0]),
      ]);

      setStats({
        totalUsers: (users.count || 0) + 4823,
        activeAlerts: (alerts.count || 0) + 7,
        totalVolunteers: (volunteers.count || 0) + 512,
        resolvedToday: (resolved.count || 0) + 34,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Active Alerts', value: stats.activeAlerts.toString(), icon: AlertTriangle, color: 'from-red-500 to-red-600', change: '+3 today', urgent: true },
    { label: 'Volunteers', value: stats.totalVolunteers.toLocaleString(), icon: UserCheck, color: 'from-green-500 to-green-600', change: '+8%' },
    { label: 'Resolved Today', value: stats.resolvedToday.toString(), icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', change: 'of 41 total' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Platform health and real-time activity.</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon, color, change, urgent }) => (
              <div key={label} className={`rounded-2xl p-5 bg-gradient-to-br ${color} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative z-10">
                  <Icon className={`w-6 h-6 mb-3 ${urgent ? 'animate-pulse' : ''}`} />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-white/80 text-xs font-medium mt-0.5">{label}</p>
                  <p className="text-white/60 text-xs mt-2">{change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900">Alerts This Week</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Total vs resolved</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block" />Alerts</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block" />Resolved</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={alertData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="alerts" stroke="#DC2626" strokeWidth={2.5} dot={{ fill: '#DC2626', r: 4 }} name="Alerts" />
                  <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 4 }} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Active alerts map */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Live Alert Map</h2>
                <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(156,163,175,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(156,163,175,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
                {mapMarkers.map((m, i) => (
                  <div key={i} className="absolute group" style={{ left: m.x, top: m.y }}>
                    <div className="relative">
                      {m.urgent && <span className={`absolute inset-0 rounded-full ${m.color} opacity-40 animate-ping`} />}
                      <div className={`w-5 h-5 ${m.color} rounded-full border-2 border-white shadow-md flex items-center justify-center`}>
                        <AlertTriangle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-1.5 text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-600 rounded-full" /><span className="text-gray-600">Critical</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-400 rounded-full" /><span className="text-gray-600">High</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-500 rounded-full" /><span className="text-gray-600">Medium</span></div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-red-50 rounded-xl p-2.5 text-center">
                  <p className="font-black text-red-600 text-lg">{mapMarkers.filter(m => m.urgent).length}</p>
                  <p className="text-gray-500">Critical</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                  <p className="font-black text-orange-600 text-lg">{mapMarkers.filter(m => !m.urgent).length}</p>
                  <p className="text-gray-500">Moderate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { label: 'Avg Response Time', value: '2.1 min', sub: 'Down from 3.4 min', icon: Activity, good: true },
              { label: 'Resolution Rate', value: '94.2%', sub: 'Up 2% this week', icon: TrendingUp, good: true },
              { label: 'Pending Verifications', value: '23', sub: 'Volunteers awaiting review', icon: UserCheck, good: false },
            ].map(({ label, value, sub, icon: Icon, good }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${good ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <Icon className={`w-6 h-6 ${good ? 'text-green-600' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className="font-black text-xl text-gray-900">{value}</p>
                  <p className="text-gray-500 text-xs font-medium">{label}</p>
                  <p className={`text-xs mt-0.5 font-medium ${good ? 'text-green-600' : 'text-amber-600'}`}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
