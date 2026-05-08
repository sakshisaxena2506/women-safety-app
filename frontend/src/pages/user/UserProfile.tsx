import { useState, useEffect, useCallback } from 'react';
import { User, Phone, Mail, Bell, Shield, Save, Plus, Trash2 } from 'lucide-react';
import UserNavbar from '../../components/UserNavbar';
import { supabase, EmergencyContact } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    sosAlert: true, volunteerAssigned: true, resolvedAlert: true, safetyTips: false,
  });

  const fetchData = useCallback(async () => {
    if (!user || !profile) return;
    setForm({ full_name: profile.full_name, phone: profile.phone });
    const { data } = await supabase.from('emergency_contacts').select('*').eq('user_id', user.id).order('created_at');
    if (data) setContacts(data as EmergencyContact[]);
  }, [user, profile]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    if (!error) {
      toast.success('Profile updated!');
      refreshProfile();
    } else {
      toast.error('Failed to save profile.');
    }
    setSaving(false);
  };

  const addContact = async () => {
    if (!user || !newContact.name || !newContact.phone) return;
    if (contacts.length >= 5) { toast.error('Maximum 5 emergency contacts allowed.'); return; }
    const { error } = await supabase.from('emergency_contacts').insert({ user_id: user.id, ...newContact });
    if (!error) {
      toast.success('Contact added!');
      setNewContact({ name: '', phone: '', relationship: '' });
      fetchData();
    }
  };

  const removeContact = async (id: string) => {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
    if (!error) { toast.success('Contact removed.'); fetchData(); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information and safety settings.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="font-bold text-gray-900">Personal Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed after registration.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Emergency contacts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">Emergency Contacts</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">{contacts.length}/5</span>
              </div>
              <div className="p-6 space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 group hover:bg-red-50 transition-colors">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-gray-400 text-xs">{c.phone}{c.relationship ? ` · ${c.relationship}` : ''}</p>
                    </div>
                    <button
                      onClick={() => removeContact(c.id)}
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}

                {contacts.length < 5 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold text-gray-700">Add New Contact</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        type="text" placeholder="Name"
                        value={newContact.name}
                        onChange={e => setNewContact(n => ({ ...n, name: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
                      />
                      <input
                        type="tel" placeholder="Phone"
                        value={newContact.phone}
                        onChange={e => setNewContact(n => ({ ...n, phone: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
                      />
                      <input
                        type="text" placeholder="Relationship"
                        value={newContact.relationship}
                        onChange={e => setNewContact(n => ({ ...n, relationship: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
                      />
                    </div>
                    <button
                      onClick={addContact}
                      className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Contact
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <p className="font-bold text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {profile?.role}
              </span>
            </div>

            {/* Notification preferences */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-red-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Notifications</h2>
              </div>
              <div className="p-5 space-y-3">
                {Object.entries({
                  sosAlert: 'SOS Alert Sent',
                  volunteerAssigned: 'Volunteer Assigned',
                  resolvedAlert: 'Alert Resolved',
                  safetyTips: 'Daily Safety Tips',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        notifications[key as keyof typeof notifications] ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        notifications[key as keyof typeof notifications] ? 'left-5.5 translate-x-0.5' : 'left-0.5'
                      }`} style={{ left: notifications[key as keyof typeof notifications] ? '22px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-red-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">Safety Profile</h2>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Profile Complete', value: contacts.length > 0 ? 85 : 60 },
                  { label: 'Safety Score', value: 92 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600 font-medium">{label}</span>
                      <span className="text-xs font-bold text-gray-900">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
