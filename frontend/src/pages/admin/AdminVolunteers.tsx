import { useState } from 'react';
import { Search, BadgeCheck, Ban, UserCheck, Star } from 'lucide-react';

import toast from 'react-hot-toast';

interface VolunteerRow {
  id: string;
  name: string;
  phone: string;
  area: string;
  skills: string[];
  responses: number;
  rating: number;
  status: 'verified' | 'pending' | 'suspended';
  joined: string;
}

const mockVolunteers: VolunteerRow[] = [
  { id: '1', name: 'Rajesh Kumar', phone: '9123456781', area: 'Bandra West, Mumbai', skills: ['First Aid', 'Self-Defense'], responses: 42, rating: 4.9, status: 'verified', joined: '2025-08-10' },
  { id: '2', name: 'Suresh Menon', phone: '9123456782', area: 'Andheri, Mumbai', skills: ['Counseling'], responses: 18, rating: 4.7, status: 'pending', joined: '2026-01-20' },
  { id: '3', name: 'Arun Nair', phone: '9123456783', area: 'Malad, Mumbai', skills: ['First Aid', 'Navigation'], responses: 7, rating: 4.5, status: 'pending', joined: '2026-03-01' },
  { id: '4', name: 'Vikram Singh', phone: '9123456784', area: 'Borivali, Mumbai', skills: ['Security'], responses: 0, rating: 0, status: 'suspended', joined: '2026-02-15' },
  { id: '5', name: 'Pradeep Rao', phone: '9123456785', area: 'Dadar, Mumbai', skills: ['First Aid', 'Counseling', 'Self-Defense'], responses: 31, rating: 4.8, status: 'verified', joined: '2025-11-05' },
];

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>(mockVolunteers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');

  const updateStatus = (id: string, status: VolunteerRow['status']) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    const msgs = { verified: 'Volunteer verified!', pending: 'Status reset to pending.', suspended: 'Volunteer suspended.' };
    toast.success(msgs[status]);
  };

  const statusConfig = {
    verified: { color: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    pending: { color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
    suspended: { color: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  };

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || v.status === filter)
  );

  return (
    <div className="min-h-screen bg-gray-50">
       
      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Volunteers</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and verify volunteer accounts.</p>
            </div>
            <div className="flex gap-2">
              {['verified', 'pending', 'suspended'].map(s => (
                <span key={s} className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[s as keyof typeof statusConfig].color}`}>
                  {volunteers.filter(v => v.status === s).length} {s}
                </span>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search volunteers..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'verified', 'pending', 'suspended'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    filter === f ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Volunteer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Area</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Responses</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(v => {
                    const cfg = statusConfig[v.status];
                    return (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {v.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{v.name}</p>
                              <p className="text-gray-400 text-xs flex items-center gap-1">
                                {v.rating > 0 ? <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{v.rating}</> : 'No rating yet'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{v.area}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {v.skills.slice(0, 2).map(s => (
                              <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                            {v.skills.length > 2 && (
                              <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full">+{v.skills.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{v.responses}</span>
                          <span className="text-gray-400 text-xs"> total</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {v.status !== 'verified' && (
                              <button
                                onClick={() => updateStatus(v.id, 'verified')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors"
                              >
                                <BadgeCheck className="w-3.5 h-3.5" /> Verify
                              </button>
                            )}
                            {v.status !== 'suspended' && (
                              <button
                                onClick={() => updateStatus(v.id, 'suspended')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5" /> Suspend
                              </button>
                            )}
                            {v.status === 'suspended' && (
                              <button
                                onClick={() => updateStatus(v.id, 'pending')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition-colors"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
