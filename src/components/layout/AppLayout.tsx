import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom"

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div className="app-layout">
      <nav className="flex items-center justify-end gap-6 p-2 border-b">
        {isAuthenticated && (
          <>
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        )}
      </nav>
      <main>{children}</main>
      <Toaster />
    </div>
  )
}

export default AppLayout