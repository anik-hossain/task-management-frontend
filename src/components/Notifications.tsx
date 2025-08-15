import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/store/services/notificationApi";

const Notifications = () => {
  const navigate = useNavigate();

  // RTK Query hooks
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  if (isLoading) {
    return null; // or a loader/spinner
  }

  const unreadExists = notifications.some((n) => !n.is_read);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadExists && (
            <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 mt-4 space-y-2">
        {notifications.length === 0 ? (
          <DropdownMenuItem className="px-3 py-2 text-center text-gray-500">
            No new notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`px-3 py-2 rounded-md flex flex-col items-start w-full 
                ${n.is_read ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 transition`}
              onClick={async () => {
                if (!n.is_read) await markAsRead(n.id);
                if (n.taskId) navigate(`/tasks/${n.taskId}`);
              }}
            >
              <h3 className="font-medium text-gray-800">{n.title}</h3>
              <p className="text-sm text-gray-600 truncate w-full overflow-hidden whitespace-nowrap">
                {n.message}
              </p>
              {!n.is_read && <span className="mt-1 text-xs text-blue-600">New</span>}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
