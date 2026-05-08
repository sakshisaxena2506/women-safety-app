import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, MapPin, Filter } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase, SosAlert } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AlertRow extends SosAlert {
  profiles?: { full_name: string };
}

const mockAlerts: AlertRow[] = [
  { id: 'a1', user_id: 'u1', status: 'active', latitude: null, longitude: null, address: 'Bandra West, Mumbai', urgency_level: 'critical', created_at: new Date(Date.now() - 180000).toISOString(), resolved_at: null },
  { id: 'a2', user_id: 'u2', status: 'responding', latitude: null, longitude: null, address: 'Andheri East, Mumbai', urgency_level: 'high', created_at: new Date(Date.now() - 420000).toISOString(), resolved_at: null },
  { id: 'a3', user_id: 'u3', status: 'resolved', latitude: null, longitude: null, address: 'Malad West, Mumbai', urgency_level: 'medium', created_at: new Date(Date.now() - 3600000).toISOString(), resolved_at: new Date(Date.now() - 2400000).toISOString() },
  { id: 'a4', user_id: 'u4', status: 'cancelled', latitude: null, longitude: null, address: 'Borivali, Mumbai', urgency_level: 'low', created_at: new Date(Date.now() - 7200000).toISOString(), resolved_at: new Date(Date.now() - 6000000).toISOString() },
  { id: 'a5', user_id: 'u5', status: 'active', latitude: null, longitude: null, address: 'Dadar, Mumbai', urgency_level: 'high', created_at: new Date(Date.now() - 600000).toISOString(), resolved_at: null },
];

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'responding' | 'resolved' | 'cancelled'>('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase.from('sos_alerts').select('*').order('created_at', { ascending: false }).limit(20);
      if (data && data.length > 0) setAlerts([...(data as AlertRow[]), ...mockAlerts]);
    };
    fetchAlerts();
  }, []);

  const resolveAlert = async (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved', resolved_at: new Date().toISOString() } : a));
    await supabase.from('sos_alerts').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id);
    toast.success('Alert marked as resolved.');
  };

  const statusConfig = {
    active: { color: 'bg-red-50 text-red-700', icon: AlertTriangle, dot: 'bg-red-500 animate-pulse' },
    responding: { color: 'bg-orange-50 text-orange-700', icon: Clock, dot: 'bg-orange-500' },
    resolved: { color: 'bg-green-50 text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
    cancelled: { color: 'bg-gray-50 text-gray-500', icon: X, dot: 'bg-gray-300' },
  };

  const urgencyColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const filtered = alerts.filter(a => filter === 'all' || a.status === filter);

  const countByStatus = (s: string) => alerts.filter(a => a.status === s).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">Alerts</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and manage all SOS alerts in real-time.</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { status: 'active', label: 'Active', color: 'border-red-300 bg-red-50', text: 'text-red-700' },
              { status: 'responding', label: 'Responding', color: 'border-orange-300 bg-orange-50', text: 'text-orange-700' },
              { status: 'resolved', label: 'Resolved', color: 'border-green-300 bg-green-50', text: 'text-green-700' },
              { status: 'cancelled', label: 'Cancelled', color: 'border-gray-200 bg-gray-50', text: 'text-gray-600' },
            ].map(({ status, label, color, text }) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`p-4 rounded-2xl border-2 ${color} ${filter === status ? 'ring-2 ring-offset-1 ring-red-400' : ''} text-left transition-all hover:shadow-sm`}
              >
                <p className={`text-2xl font-black ${text}`}>{countByStatus(status)}</p>
                <p className={`text-xs font-semibold mt-0.5 ${text}`}>{label}</p>
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'active', 'responding', 'resolved', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === f ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-green-500" />
                <p className="text-sm">No alerts in this category.</p>
              </div>
            ) : (
              filtered.map(alert => {
                const cfg = statusConfig[alert.status];
                const Icon = cfg.icon;
                return (
                  <div key={alert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${cfg.color} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                        <Icon className="w-5 h-5" />
                        <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${cfg.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-gray-900 text-sm">Alert #{alert.id.slice(-6).toUpperCase()}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${urgencyColors[alert.urgency_level]}`}>
                            {alert.urgency_level}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cfg.color}`}>
                            {alert.status}
                          </span>
                        </div>
                        {alert.address && (
                          <p className="text-gray-500 text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {alert.address}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.created_at).toLocaleString('en-IN')}
                          {alert.resolved_at && <> · Resolved {new Date(alert.resolved_at).toLocaleString('en-IN')}</>}
                        </p>
                      </div>
                      {(alert.status === 'active' || alert.status === 'responding') && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
