import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@pages/index'
import Login from '@pages/login'
import NotFound from '@pages/not-found'
import { JSX } from 'react'
import Dashboard from '@/pages/dashboard'
import { useAuth } from '@/hooks/useAuth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const RoleBasedRoute: React.FC<{
  element: JSX.Element;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return element;
};

function AppRoutes() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <RoleBasedRoute
            element={<Dashboard />}
            allowedRoles={['admin', 'manager', 'user']}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes