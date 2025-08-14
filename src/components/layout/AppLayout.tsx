import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="app-layout min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            ProjectManager
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                {(user?.role === "admin" || user?.role === "manager") && (
                  <Link
                    to="/project-timeline"
                    className="px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    Project Timeline
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>

      <Toaster />
    </div>
  );
}

export default AppLayout;
