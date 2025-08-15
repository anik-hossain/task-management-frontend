import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchTasks } from "@/store/slices/taskSlice";
import { io } from "socket.io-client";
import Notifications from "../Notifications";
import { addNotification } from "@/store/slices/notificationSlice";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);

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

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:3000', {
      query: { userId: user.id },
    });


    socket.on('taskCreated', (task) => {

      toast("New Task Assigned", {
        description: `You have been assigned a new task: ${task.title}`,
      })

      dispatch(
        addNotification({
          id: task.id,
          title: 'New Task Assigned',
          message: `You have been assigned a new task: ${task.title}`,
          is_read: false,
          createdAt: new Date().toISOString(),
          taskId: task.id,
        })
      );
    });

    socket.on('taskUpdated', (task) => {
      toast("Task status updated", {
        description: `The status of task "${task.title}" has been updated to "${task.status}"`,
      })
      dispatch(
        addNotification({
          id: task.id + '_update',
          title: 'Task status updated',
          message: `The status of task "${task.title}" has been updated to "${task.status}".`,
          is_read: false,
          createdAt: new Date().toISOString(),
          taskId: task.id,
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

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
                <Notifications />

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
