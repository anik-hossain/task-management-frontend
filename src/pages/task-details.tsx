import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "@/utils/api";
import { format } from "date-fns";
import getBadgeColor from "@/utils/getStatusBadgeClass";
import TaskDetailsSkeleton from "@/components/skeletons/TaskDetailsSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { Task } from "@/types/global";

const allowedTransitions: Record<string, Record<string, string[]>> = {
  admin: {
    pending: ["in-progress", "completed"],
    "in-progress": ["pending", "completed"],
    completed: ["pending", "in-progress"],
  },
  manager: {
    pending: ["in-progress", "completed"],
    "in-progress": ["pending", "completed"],
    completed: ["pending", "in-progress"],
  },
  member: {
    pending: ["in-progress"],
    "in-progress": ["completed"],
    completed: [],
  },
};

const TaskDetails: FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTaskDetails = async () => {
    try {
      const response = (await apiService.get(`/tasks/task/${taskId}`)) as Task;
      setTask(response);
    } catch (error) {
      console.error("Failed to fetch task:", error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const handleChangeStatus = async (newStatus: "pending" | "in-progress" | "completed") => {
    if (!task) return;

    setLoadingStatus(newStatus);
    try {
      await apiService.patch(`/tasks/${task.id}/status`, { status: newStatus });
      setTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoadingStatus(null);
      fetchTaskDetails()
    }
  };

  if (!task) return <TaskDetailsSkeleton />;

  const nextStatuses = allowedTransitions[user?.role || ''][task.status] || [];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="outline" className="flex items-center gap-2 mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>

      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {task.title}
            <p
              className={`px-2.5 py-1 rounded-full capitalize text-xs ${task.priority === "high"
                  ? "bg-red-500 text-white"
                  : task.priority === "medium"
                    ? "bg-yellow-400 text-white"
                    : "bg-green-500 text-white"
                }`}
            >
              {task.priority}
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-gray-700">{task.description}</p>

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <span>
              <strong>Assignee: </strong>
              <span className="font-medium text-green-500">{task.assignee.name}</span>
            </span>
            <span>
              <strong>Status:</strong>{" "}
              <span
                className={`text-xs text-white px-2.5 h-fit font-medium rounded-full py-1 capitalize ${getBadgeColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </span>
            <span>
              <strong>Start Date:</strong> {format(new Date(task.startDate), "MMM dd, yyyy")}
            </span>
            <span>
              <strong>End Date:</strong> {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
          </div>

          {task.dependencies && (
            <div className="mt-2">
              <strong>Dependencies:</strong> {task.dependencies}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant="default"
                className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                onClick={() => handleChangeStatus(status as "pending" | "in-progress" | "completed")}
                disabled={loadingStatus === status} // disable only the button being clicked
              >
                {loadingStatus === status ? "Updating..." : `Mark as ${status}`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default TaskDetails;
