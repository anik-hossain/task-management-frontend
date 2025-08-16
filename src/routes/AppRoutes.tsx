import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@pages/index'
import Login from '@pages/login'
import NotFound from '@pages/not-found'
import { JSX } from 'react'
import ProjecetDetails from '@/pages/project-details'
import { useAuth } from '@/hooks/useAuth'
import Register from '@/pages/register'
import TaskDetails from '@/pages/task-details'
import ProjectTimeline from '@/pages/project-timeline'
import { ProjectsPage } from '@/pages/projects'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const RoleBasedRoute: React.FC<{
  element: JSX.Element;
  allowedRoles: string[];
}> = ({ element, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center h-[70vh] flex justify-center items-center">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
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
            element={<ProjectsPage />}
            allowedRoles={['admin', 'manager', 'member']}
          />
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <RoleBasedRoute
            element={<ProjecetDetails />}
            allowedRoles={['admin', 'manager', 'member']}
          />
        }
      />
      <Route
        path="/tasks/:taskId"
        element={
          <RoleBasedRoute
            element={<TaskDetails />}
            allowedRoles={['admin', 'manager', 'member']}
          />
        }
      />
      <Route
        path="/project-timeline/:projectId"
        element={
          <RoleBasedRoute
            element={<ProjectTimeline />}
            allowedRoles={['admin', 'manager']}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes