import React, { useMemo } from "react";
import { Chart } from "react-google-charts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useParams } from "react-router-dom";
import { useGetTasksQuery } from "@/store/services/taskApi";
import { Task } from "@/types/global";
import ProjectTimelineSkeleton from "@/components/skeletons/ProjectTimeline";

const ProjectTimeline: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useGetTasksQuery(projectId || '', { skip: !projectId })

  // Prepare chart data
  const chartData = useMemo(() => [
    [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ],
    ...(project?.tasks || []).map((t: Task) => [
      t.id,
      t.title,
      new Date(t.startDate),
      new Date(t.dueDate),
      null,
      t.status === "completed" ? 100 : t.status === "in-progress" ? 50 : 0,
      t.dependencies?.length ? t.dependencies.join(",") : null,
    ]),
  ], [project]);


  const chartOptions = {
    height: 400,
    gantt: {
      criticalPathEnabled: true,
      labelStyle: { fontSize: 14 },
      trackHeight: 30,
      barCornerRadius: 5,
      barHeight: 20,
    },
  };

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold">Project Timeline</h1>
      {isLoading ? <ProjectTimelineSkeleton /> : <div className="space-y-8 mt-6">
        <Card className="shadow border rounded-lg">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              chartType="Gantt"
              width="100%"
              height="400px"
              data={chartData}
              options={chartOptions}
            />
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="grid md:grid-cols-2 gap-6">
          {(project?.tasks || []).map((task: Task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
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
              <CardContent>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <div className="flex -space-x-2">
                  <Avatar
                    className="w-8 h-8 border rounded-full border-gray-300 text-center"
                    title={task.assignee.name}
                  >
                    <AvatarFallback className="text-[10px]">
                      {task.assignee.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>}

    </div>
  );
};

export default ProjectTimeline;
