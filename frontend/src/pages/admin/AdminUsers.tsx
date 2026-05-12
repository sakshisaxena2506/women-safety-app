import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, ChevronDown, Users } from 'lucide-react';

import { supabase, Profile } from '../../lib/supabase';
import AdminSidebar from '../../components/adminsidebar';
import toast from 'react-hot-toast';

const mockUsers: Profile[] = [
  { id: '1', full_name: 'Priya Sharma', phone: '9876543210', role: 'user', avatar_url: '', is_active: true, created_at: '2026-01-15T10:00:00Z' },
  { id: '2', full_name: 'Ananya Reddy', phone: '9876543211', role: 'user', avatar_url: '', is_active: true, created_at: '2026-02-10T10:00:00Z' },
  { id: '3', full_name: 'Kavitha Nair', phone: '9876543212', role: 'user', avatar_url: '', is_active: false, created_at: '2026-03-05T10:00:00Z' },
  { id: '4', full_name: 'Sunita Mehra', phone: '9876543213', role: 'user', avatar_url: '', is_active: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '5', full_name: 'Deepika Patel', phone: '9876543214', role: 'user', avatar_url: '', is_active: true, created_at: '2026-04-01T10:00:00Z' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*').eq('role', 'user').order('created_at', { ascending: false });
      if (data && data.length > 0) setUsers([...(data as Profile[]), ...mockUsers]);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));
    await supabase.from('profiles').update({ is_active: !currentStatus }).eq('id', id);
    toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}.`);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? u.is_active : !u.is_active);
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Users</h1>
              <p className="text-gray-500 text-sm mt-1">Manage registered users on the platform.</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
              <Users className="w-4 h-4" />
              {users.length.toLocaleString()} Total
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search users..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value as typeof filter)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm font-medium text-gray-700 bg-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
                Loading users...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.full_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{user.phone || '—'}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleStatus(user.id, user.is_active)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.is_active
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {user.is_active ? <><UserX className="w-3.5 h-3.5" />Deactivate</> : <><UserCheck className="w-3.5 h-3.5" />Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
