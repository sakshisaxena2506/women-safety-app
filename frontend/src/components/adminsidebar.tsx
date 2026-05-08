import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Users, UserCheck, AlertTriangle,
  FileText, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Volunteers', icon: UserCheck, path: '/admin/volunteers' },
  { label: 'Alerts', icon: AlertTriangle, path: '/admin/alerts' },
  { label: 'Reports', icon: FileText, path: '/admin/reports' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-red-700">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">SafeGuard Admin</p>
          <p className="text-red-200 text-xs">Control Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-red-100 hover:bg-red-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-200 hover:bg-red-700 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-red-600 min-h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 w-64 h-full bg-red-600">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
