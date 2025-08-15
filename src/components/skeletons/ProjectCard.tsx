import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 shadow-xs">
      {/* Project Title */}
      <Skeleton className="h-6 w-40" />

      {/* Description */}
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-3/4 mt-1" />

      {/* Status + Dates */}
      <div className="flex justify-between items-center mt-3">
        <Skeleton className="h-5 w-16 rounded-full" /> {/* Status badge */}
        <Skeleton className="h-4 w-32" /> {/* Dates */}
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
