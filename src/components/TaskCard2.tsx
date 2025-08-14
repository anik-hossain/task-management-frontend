import { FC } from "react";
import { differenceInDays, parseISO } from 'date-fns';
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react";

type Assignee = {
    id: number;
    name: string;
}

interface Task {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    assignees: Assignee[];
    start_date: string;
    end_date: string;
    dependencies?: string;
}

interface TaskCardProps {
    task: Task;
    onUpdate: (taskId: string, updates: Partial<Task>) => void;
    usersOnline: string[];
}

const TaskCard2: FC<TaskCardProps> = ({ task, onUpdate, usersOnline }) => {

    const priorityColors: Record<string, string> = {
        low: 'bg-green-300 text-green-800',
        medium: 'bg-yellow-300 text-yellow-800',
        high: 'bg-red-300 text-red-800',
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="mt-4 flex gap-2 h-fit">
                <p className={`text-xs px-2.5 font-medium rounded-full h-fit py-1 ${priorityColors[task.priority] || 'bg-gray-300 text-gray-800'}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </p>
                <p className="text-xs text-white bg-pink-300 px-2.5 h-fit font-medium rounded-full py-1">In Progress</p>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {task.assignees.map((user, index) => (
                        <Avatar key={index} className="w-6 h-6 border border-gray-300">
                            <AvatarFallback className="text-[10px]">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <p className="text-xs text-gray-500 font-medium h-fit mt-0.5">
                    {Math.max(differenceInDays(parseISO(task.end_date), new Date()), 0)} Days Left
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default TaskCard2;
