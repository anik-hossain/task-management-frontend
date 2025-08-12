import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@pages/index'
import Login from '@pages/login'
import NotFound from '@pages/not-found'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes