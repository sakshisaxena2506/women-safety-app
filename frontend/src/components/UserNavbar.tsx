import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserNavbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-red-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/user/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">SafeGuard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-red-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {profile?.full_name || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    to="/user/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
