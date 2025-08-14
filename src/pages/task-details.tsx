import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Sample tasks data
const tasks = [
  {
    id: "1",
    title: "Design",
    description: "Create UI mockups and wireframes",
    priority: "high",
    assignee: "Alice",
    status: "done",
    startDate: "2025-08-01",
    endDate: "2025-08-05",
    dependencies: [],
  },
  {
    id: "2",
    title: "Development",
    description: "Implement the features in React",
    priority: "medium",
    assignee: "Bob",
    status: "in-progress",
    startDate: "2025-08-04",
    endDate: "2025-08-10",
    dependencies: ["1"],
  },
  {
    id: "3",
    title: "Testing",
    description: "Test the application thoroughly",
    priority: "low",
    assignee: "Charlie",
    status: "todo",
    startDate: "2025-08-09",
    endDate: "2025-08-12",
    dependencies: ["2"],
  },
];

const TaskDetails: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <div className="p-6 text-center text-gray-500">
        Task not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button
        variant="outline"
        className="flex items-center gap-2 mb-4"
        onClick={() => navigate(-1)}
      >
         Back
      </Button>

      {/* Task Card */}
      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {task.title}
            <p
              className={`px-2.5 py-1 rounded-full capitalize text-xs ${
                task.priority === "high"
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

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              <strong>Assignee:</strong> {task.assignee}
            </span>
            <span>
              <strong>Status:</strong> {task.status}
            </span>
            <span>
              <strong>Start Date:</strong> {task.startDate}
            </span>
            <span>
              <strong>End Date:</strong> {task.endDate}
            </span>
          </div>

          {task.dependencies.length > 0 && (
            <div className="mt-2">
              <strong>Dependencies:</strong>{" "}
              {task.dependencies.join(", ")}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit Task
            </Button>
            <Button
              variant="default"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Mark as Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetails;
