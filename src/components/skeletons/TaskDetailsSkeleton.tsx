import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Skeleton className="h-10 w-24 mb-4" />

      {/* Task Card */}
      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" /> {/* Task title */}
            <Skeleton className="h-5 w-20 rounded-full" /> {/* Priority badge */}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          {/* Assignee */}
          <Skeleton className="h-4 w-40" />

          {/* Status */}
          <Skeleton className="h-5 w-24 rounded-full" />

          {/* Dates */}
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />

          {/* Dependencies */}
          <Skeleton className="h-4 w-40" />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailsSkeleton;
