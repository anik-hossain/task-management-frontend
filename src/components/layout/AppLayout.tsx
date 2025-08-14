import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchTasks } from "@/store/slices/taskSlice";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Fetch tasks to create notifications (example: tasks assigned to the user)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks({ force: false }));
    }
  }, [dispatch, isAuthenticated]);

  // Simple notification logic: show tasks assigned to the user and not completed
  useEffect(() => {
    if (user) {
      const userNotifications = tasks
        .filter(
          (task) =>
            task.assignees.some((assignee) => assignee.id === user.id) &&
            task.status !== "completed"
        )
        .map((task) => ({
          id: task.id,
          message: `Task "${task.title}" is ${task.status}`,
        }));
      setNotifications(userNotifications);
    }
  }, [tasks, user]);

  return (
    <div className="app-layout min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            ProjectManager {user?.name}
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

                {/* Notification Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-full hover:bg-gray-100">
                      <Bell className="w-5 h-5 text-gray-700" />
                      {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    {notifications.length === 0 ? (
                      <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem key={n.id}>{n.message}</DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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
