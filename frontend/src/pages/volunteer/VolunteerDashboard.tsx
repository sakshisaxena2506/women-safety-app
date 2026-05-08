import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Bell, CheckCircle, X, MapPin, Clock, User,
  TrendingUp, AlertTriangle, LogOut, ToggleLeft, ToggleRight, Star
} from 'lucide-react';
import { supabase, SosAlert } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface AlertWithMeta extends SosAlert {
  distance: string;
  timeAgo: string;
}

const mockAlerts: AlertWithMeta[] = [
  {
    id: '1', user_id: 'u1', status: 'active', latitude: null, longitude: null,
    address: 'Bandra West, near Carter Road', urgency_level: 'critical',
    created_at: new Date(Date.now() - 180000).toISOString(), resolved_at: null,
    distance: '1.2 km', timeAgo: '3 min ago',
  },
  {
    id: '2', user_id: 'u2', status: 'active', latitude: null, longitude: null,
    address: 'Andheri East, near station', urgency_level: 'high',
    created_at: new Date(Date.now() - 420000).toISOString(), resolved_at: null,
    distance: '2.8 km', timeAgo: '7 min ago',
  },
  {
    id: '3', user_id: 'u3', status: 'active', latitude: null, longitude: null,
    address: 'Malad West, Infinity Mall area', urgency_level: 'medium',
    created_at: new Date(Date.now() - 600000).toISOString(), resolved_at: null,
    distance: '4.1 km', timeAgo: '10 min ago',
  },
];

const historyData = [
  { date: 'Apr 28', status: 'Resolved', user: 'Anonymous', time: '12 min' },
  { date: 'Apr 25', status: 'Resolved', user: 'Anonymous', time: '8 min' },
  { date: 'Apr 22', status: 'Resolved', user: 'Anonymous', time: '15 min' },
  { date: 'Apr 18', status: 'Declined', user: 'Anonymous', time: '—' },
];

export default function VolunteerDashboard() {
  const { profile, signOut } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [alerts, setAlerts] = useState<AlertWithMeta[]>(mockAlerts);
  const [activeAssignment, setActiveAssignment] = useState<AlertWithMeta | null>(null);
  const [responding, setResponding] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    const { data } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    // Supplement with mock data for demo purposes
    if (data && data.length > 0) {
      const enriched = (data as SosAlert[]).map((a, i) => ({
        ...a,
        distance: `${(Math.random() * 4 + 0.5).toFixed(1)} km`,
        timeAgo: `${Math.floor((Date.now() - new Date(a.created_at).getTime()) / 60000)} min ago`,
      }));
      setAlerts([...enriched, ...mockAlerts].slice(0, 5));
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const handleAccept = (alert: AlertWithMeta) => {
    setResponding(alert.id);
    setTimeout(() => {
      setActiveAssignment(alert);
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
      setResponding(null);
      toast.success('Alert accepted! Proceed to the location.');
    }, 800);
  };

  const handleDecline = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast('Alert declined.', { icon: '👋' });
  };

  const toggleAvailability = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    toast.success(`Status: ${next ? 'Available' : 'Busy'}`);
  };

  const urgencyConfig = {
    critical: { color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500', label: 'Critical' },
    high: { color: 'text-orange-600 bg-orange-50 border-orange-200', dot: 'bg-orange-500', label: 'High' },
    medium: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500', label: 'Medium' },
    low: { color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-400', label: 'Low' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/volunteer/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">SafeGuard</span>
            <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full ml-1">Volunteer</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Availability toggle */}
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isAvailable ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span className="hidden sm:block">{isAvailable ? 'Available' : 'Busy'}</span>
            </button>
            <button onClick={signOut} className="p-2 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Welcome, {profile?.full_name?.split(' ')[0] || 'Volunteer'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isAvailable ? 'You are active and receiving alerts.' : 'You are marked as busy. No new alerts.'}
            </p>
          </div>
          {/* Profile completion */}
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500 font-medium mb-1.5">Profile Completion</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="text-xs font-bold text-gray-700">75%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Responses', value: '24', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'This Month', value: '6', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
            { label: 'Active Alerts', value: alerts.length.toString(), icon: Bell, color: 'text-red-600 bg-red-50' },
            { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-amber-600 bg-amber-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Incoming alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active assignment */}
            {activeAssignment && (
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wide">Active Assignment</span>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">In Progress</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">Anonymous User</p>
                    <p className="text-red-200 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {activeAssignment.address || 'Location being updated...'}
                    </p>
                    <p className="text-red-200 text-sm flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" /> {activeAssignment.timeAgo} · {activeAssignment.distance}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white/10 rounded-xl p-4">
                  <div className="text-center text-sm text-white/70 mb-2">Location (Live)</div>
                  <div className="h-28 bg-white/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                      <MapPin className="relative w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveAssignment(null); toast.success('Assignment marked as resolved!'); }}
                  className="mt-4 w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Mark as Resolved
                </button>
              </div>
            )}

            {/* Incoming feed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Incoming Alerts</h2>
                {isAvailable ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Receiving alerts
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">Paused (Busy)</span>
                )}
              </div>

              {!isAvailable ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">You are currently marked as busy.</p>
                  <p className="text-xs mt-1">Toggle availability to receive alerts.</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-green-500" />
                  <p className="text-sm">No active alerts in your area right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {alerts.map(alert => {
                    const cfg = urgencyConfig[alert.urgency_level];
                    return (
                      <div key={alert.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${cfg.dot} rounded-full border-2 border-white`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-900 text-sm">Anonymous User</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${cfg.color}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {alert.address || 'Location available on acceptance'}
                            </p>
                            <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.distance}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleAccept(alert)}
                            disabled={responding === alert.id || !!activeAssignment}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-all"
                          >
                            {responding === alert.id ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(alert.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-all"
                          >
                            <X className="w-4 h-4" /> Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Response history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Response History</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {historyData.map((h, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${h.status === 'Resolved' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{h.date} · {h.user}</p>
                      <p className="text-xs text-gray-400">Response time: {h.time}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      h.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Area of operation */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">My Coverage Area</h2>
              <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(156,163,175,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(156,163,175,0.2)_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-red-400 flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-600 rounded-full" />
                    </div>
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap font-semibold">
                      5 km radius
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Coverage Area</span>
                  <span className="font-semibold text-gray-900">5 km radius</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Alerts Nearby</span>
                  <span className="font-semibold text-red-600">{alerts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Other Volunteers</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
              </div>
            </div>

            {/* Safety badge */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 p-5 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="font-bold text-gray-900 text-sm">Verified Volunteer</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Your profile is pending verification. Complete your profile to get verified.
              </p>
              <button className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-xl border border-red-200 hover:border-red-300 transition-colors w-full">
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
