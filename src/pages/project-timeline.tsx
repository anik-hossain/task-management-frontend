import React, { useEffect } from "react";
import { Chart } from "react-google-charts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { fetchTasks } from "@/store/slices/taskSlice";


const ProjectTimeline: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    
const tasks = useSelector((state: RootState) => state?.tasks?.tasks);

    const chartData: any[] = [
        [
            { type: "string", label: "Task ID" },
            { type: "string", label: "Task Name" },
            { type: "date", label: "Start Date" },
            { type: "date", label: "End Date" },
            { type: "number", label: "Duration" },
            { type: "number", label: "Percent Complete" },
            { type: "string", label: "Dependencies" },
        ],
        ...tasks.map((t) => [
            t.id,
            t.title,
            new Date(t.start_date),
            new Date(t.end_date),
            null,
            t.status === "completed" ? 100 : t.status === "in-progress" ? 50 : 0,
            t.dependencies || null,
        ]),
    ];

    const chartOptions = {
        height: 400,
        gantt: {
            criticalPathEnabled: true,
            labelStyle: { fontName: "Roboto", fontSize: 14 },
            trackHeight: 30,
            barCornerRadius: 5,
            barHeight: 20,
        },
    };

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div className="p-6 space-y-8 container mx-auto">
            <h1 className="text-3xl font-bold">Project Timeline</h1>

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
                {tasks.map((task) => (
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
                            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                {task.assignees.map((user, index) => (
                                    <Avatar key={index} className="w-8 text-center h-8 border rounded-full border-gray-300" title={user.name}>
                                        <AvatarFallback className="text-[10px]">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProjectTimeline;
