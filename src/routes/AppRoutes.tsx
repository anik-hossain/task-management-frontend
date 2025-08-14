import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@pages/index'
import Login from '@pages/login'
import NotFound from '@pages/not-found'
import { JSX } from 'react'
import Dashboard from '@/pages/dashboard'
import { useAuth } from '@/hooks/useAuth'
import Register from '@/pages/register'
import TaskDetails from '@/pages/task-details'
import ProjectTimeline from '@/pages/project-timeline'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const RoleBasedRoute: React.FC<{
  element: JSX.Element;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  console.log('user in role based route:', user);
  

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return element;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

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
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
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
      <Route
        path="/tasks/:taskId"
        element={
          <RoleBasedRoute
            element={<TaskDetails />}
            allowedRoles={['admin', 'manager', 'user']}
          />
        }
      />
      <Route
        path="/project-timeline"
        element={
          <RoleBasedRoute
            element={<ProjectTimeline />}
            allowedRoles={['admin', 'manager']}
          />
        }
      />
      {/* <Route
        path="/reports"
        element={
          <RoleBasedRoute
            element={<ProjectReports />}
            allowedRoles={['admin', 'manager']}
          />
        }
      /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes