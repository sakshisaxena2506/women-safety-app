import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile && !allowedRoles.includes(profile.role)) {
    const redirectMap: Record<UserRole, string> = {
      user: '/user/dashboard',
      volunteer: '/volunteer/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirectMap[profile.role]} replace />;
  }

  return <>{children}</>;
}
