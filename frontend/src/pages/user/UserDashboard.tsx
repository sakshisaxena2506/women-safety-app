import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Plus, Trash2, Clock, CheckCircle, AlertTriangle,
  Shield, ChevronLeft, ChevronRight, User, X
} from 'lucide-react';
import UserNavbar from '../../components/UserNavbar';
import SOSButton from '../../components/SOSButton';
import { supabase, EmergencyContact, SosAlert } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const tips = [
  { title: 'Share Your Location', body: 'Always share your live location with trusted contacts when traveling alone at night.' },
  { title: 'Trust Your Instincts', body: 'If something feels wrong, leave the situation immediately. Your safety is more important than politeness.' },
  { title: 'Emergency Numbers', body: 'Save Police (100), Women Helpline (1091), and Ambulance (108) on speed dial.' },
  { title: 'Stay in Public Areas', body: 'When feeling unsafe, move to well-lit and populated areas immediately.' },
  { title: 'Charge Your Phone', body: 'Keep your phone charged and carry a power bank when going out.' },
];

const safeZones = [
  { name: 'City Hospital', type: 'Medical', color: 'bg-blue-500', x: '20%', y: '30%' },
  { name: 'Police Station', type: 'Authority', color: 'bg-green-600', x: '55%', y: '25%' },
  { name: 'SafeGuard Hub', type: 'Community', color: 'bg-red-600', x: '70%', y: '60%' },
  { name: 'Community Center', type: 'Community', color: 'bg-orange-500', x: '35%', y: '65%' },
];

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [tipIndex, setTipIndex] = useState(0);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [loadingContact, setLoadingContact] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const [{ data: c }, { data: a }] = await Promise.all([
      supabase.from('emergency_contacts').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('sos_alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    ]);
    if (c) setContacts(c as EmergencyContact[]);
    if (a) setAlerts(a as SosAlert[]);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSOS = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('sos_alerts').insert({
        user_id: user.id,
        status: 'active',
        urgency_level: 'critical',
      });
      if (error) throw error;
      toast.success('SOS Alert Sent! Help is on the way.');
      navigate('/user/alert-active');
    } catch {
      toast.error('Failed to send SOS. Please try again.');
    }
  };

  const addContact = async () => {
    if (!user || !newContact.name || !newContact.phone) return;
    if (contacts.length >= 5) { toast.error('Maximum 5 emergency contacts allowed.'); return; }
    setLoadingContact(true);
    try {
      const { error } = await supabase.from('emergency_contacts').insert({
        user_id: user.id, ...newContact,
      });
      if (error) throw error;
      toast.success('Contact added!');
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
      fetchData();
    } catch {
      toast.error('Failed to add contact.');
    } finally {
      setLoadingContact(false);
    }
  };

  const removeContact = async (id: string) => {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
    if (!error) { toast.success('Contact removed.'); fetchData(); }
  };

  const statusConfig = {
    active: { color: 'text-red-600 bg-red-50', icon: AlertTriangle, label: 'Active' },
    responding: { color: 'text-orange-600 bg-orange-50', icon: Clock, label: 'Responding' },
    resolved: { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Resolved' },
    cancelled: { color: 'text-gray-500 bg-gray-50', icon: X, label: 'Cancelled' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            Hello, {profile?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your safety dashboard is active and monitoring.</p>
        </div>

        {/* SOS Section */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          <p className="text-red-100 text-sm font-medium mb-6 relative z-10">In an emergency? Press the button below</p>
          <div className="relative z-10 flex justify-center">
            <SOSButton onConfirm={handleSOS} />
          </div>
          <p className="text-red-200 text-xs mt-6 relative z-10">
            <Shield className="w-3 h-3 inline mr-1" />
            Alert will notify {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''} and nearby volunteers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Recent Alerts</h2>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">{alerts.length} total</span>
              </div>
              {alerts.length === 0 ? (
                <div className="px-6 py-10 text-center text-gray-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No alerts yet. Stay safe!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {alerts.map(alert => {
                        const cfg = statusConfig[alert.status];
                        const Icon = cfg.icon;
                        return (
                          <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(alert.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                alert.urgency_level === 'critical' ? 'bg-red-50 text-red-600' :
                                alert.urgency_level === 'high' ? 'bg-orange-50 text-orange-600' :
                                'bg-yellow-50 text-yellow-600'
                              }`}>
                                {alert.urgency_level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                <Icon className="w-3 h-3" />
                                {cfg.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Safe Zones Map */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Nearby Safe Zones</h2>
                <p className="text-xs text-gray-400 mt-0.5">Locations near your registered address</p>
              </div>
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 m-4 rounded-xl overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-gray-400" style={{ top: `${(i + 1) * 16.67}%` }} />
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute h-full w-px bg-gray-400" style={{ left: `${(i + 1) * 12.5}%` }} />
                  ))}
                </div>
                {/* You are here */}
                <div className="absolute" style={{ left: '47%', top: '47%' }}>
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-60" />
                    <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                  </div>
                  <span className="absolute top-5 -left-4 text-xs font-bold text-blue-700 whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-sm">You</span>
                </div>
                {/* Safe zone markers */}
                {safeZones.map((zone) => (
                  <div key={zone.name} className="absolute group cursor-pointer" style={{ left: zone.x, top: zone.y }}>
                    <div className={`w-6 h-6 ${zone.color} rounded-full border-2 border-white shadow-md flex items-center justify-center`}>
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {zone.name} ({zone.type})
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg p-2 text-xs space-y-1">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /><span className="text-gray-600">You</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-600 rounded-full" /><span className="text-gray-600">SafeGuard Hub</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-600 rounded-full" /><span className="text-gray-600">Police</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Emergency Contacts</h2>
                <span className="text-xs text-gray-400">{contacts.length}/5</span>
              </div>
              <div className="p-4 space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors group">
                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => removeContact(c.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                ))}

                {showAddContact ? (
                  <div className="p-3 rounded-xl border-2 border-red-100 bg-red-50 space-y-2">
                    <input
                      type="text" placeholder="Contact name"
                      value={newContact.name}
                      onChange={e => setNewContact(n => ({ ...n, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-50"
                    />
                    <input
                      type="tel" placeholder="Phone number"
                      value={newContact.phone}
                      onChange={e => setNewContact(n => ({ ...n, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-50"
                    />
                    <input
                      type="text" placeholder="Relationship (optional)"
                      value={newContact.relationship}
                      onChange={e => setNewContact(n => ({ ...n, relationship: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-50"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddContact(false)} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                      <button onClick={addContact} disabled={loadingContact} className="flex-1 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {loadingContact ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                ) : contacts.length < 5 && (
                  <button
                    onClick={() => setShowAddContact(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Contact
                  </button>
                )}
              </div>
            </div>

            {/* Safety Tips Carousel */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" /> Safety Tip
              </h2>
              <div className="min-h-[80px]">
                <p className="font-semibold text-gray-800 text-sm mb-2">{tips[tipIndex].title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{tips[tipIndex].body}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setTipIndex(i => (i - 1 + tips.length) % tips.length)}
                  className="w-8 h-8 rounded-full bg-white border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <div className="flex gap-1.5">
                  {tips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipIndex(i)}
                      className={`rounded-full transition-all ${i === tipIndex ? 'w-5 h-2 bg-red-600' : 'w-2 h-2 bg-red-200'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTipIndex(i => (i + 1) % tips.length)}
                  className="w-8 h-8 rounded-full bg-white border border-red-100 flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a href="tel:1091" className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors group">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Women Helpline</p>
                    <p className="text-gray-500 text-xs">1091 — Available 24/7</p>
                  </div>
                </a>
                <a href="tel:100" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Police</p>
                    <p className="text-gray-500 text-xs">100 — Emergency</p>
                  </div>
                </a>
                <a href="tel:108" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Ambulance</p>
                    <p className="text-gray-500 text-xs">108 — Emergency</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
