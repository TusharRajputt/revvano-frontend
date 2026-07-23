import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import type { User } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: User['role'][];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role;
  if (roles && roles.length > 0 && (!currentRole || !roles.includes(currentRole))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}