import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TaskCardSkeleton: FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
      {/* Left section */}
      <div>
        <Skeleton className="h-5 w-40 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-64" /> {/* Description */}
      </div>

      {/* Right section */}
      <div className="mt-4 flex gap-2 items-center h-fit">
        {/* Priority */}
        <Skeleton className="h-5 w-20 rounded-full" />
        {/* Status */}
        <Skeleton className="h-5 w-24 rounded-full" />
        {/* Avatars */}
        <div className="flex -space-x-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        {/* Days left */}
        <Skeleton className="h-4 w-16" />
        {/* Dropdown button */}
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
