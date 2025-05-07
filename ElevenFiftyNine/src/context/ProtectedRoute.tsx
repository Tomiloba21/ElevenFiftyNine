import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthService from '../context/Authservice';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectPath = '/auth',
  children
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authorization status
    const user = AuthService.getCurrentUser();
    const authorized = user && allowedRoles.some(role => user.roles.includes(role));
    setIsAuthorized(authorized);
  }, [allowedRoles, location.pathname]);

  // Show loading while checking auth status
  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!AuthService.isLoggedIn()) {
    // Save the location they were trying to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // User doesn't have required role
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}