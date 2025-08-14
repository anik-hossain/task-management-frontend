import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectTimelineSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-8 container mx-auto">
      {/* Page title */}
      <Skeleton className="h-8 w-56" />

      {/* Chart Card */}
      <Card className="shadow border rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-24" /> {/* Timeline title */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full rounded-md" /> {/* Chart placeholder */}
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" /> {/* Task title */}
                <Skeleton className="h-5 w-16 rounded-full" /> {/* Priority badge */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-3" /> {/* Description */}
              <div className="flex -space-x-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimelineSkeleton;
