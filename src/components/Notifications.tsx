import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppDispatch, RootState } from "@/store";
import { fetchNotifications, markAsRead } from "@/store/slices/notificationSlice";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notifications = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { notifications } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <Bell className="w-5 h-5 text-gray-700" />
                    {notifications.some(n => !n.is_read) && (
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
                    notifications.map((n, index) => (
                        <DropdownMenuItem
                            key={index}
                            className={`px-3 py-2 rounded-md flex flex-col items-start w-full 
            ${n.is_read ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`}
                            onClick={() => {
                                dispatch(markAsRead(n.id));
                                if (n.id) navigate(`/tasks/${n.taskId}`);
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
}

export default Notifications;
