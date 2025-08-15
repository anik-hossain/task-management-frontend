import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateTask from '@/components/CreateTask';
import TaskCard2 from '@/components/TaskCard2';
import TaskCardSkeleton from '@/components/skeletons/TaskCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetTasksQuery } from '@/store/services/taskApi'; // RTK Query API

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: tasks = [], isLoading } = useGetTasksQuery();

  const handleUpdateTask = (taskId: string, updates: Partial<{
    title: string;
    description: string | null;
    priority: string;
    status: string;
  }>) => {
    console.log(taskId, updates);
    // Here you can use RTK Query mutation if needed
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">Users online: 3</p>
        <Button type="submit" className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading && Array.from({ length: 3 }).map((_, index) => <TaskCardSkeleton key={index} />)}

        {tasks.map((task) => (
          <TaskCard2
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            usersOnline={['user1', 'user2', 'user3']}
            role={user?.role}
          />
        ))}
      </div>

      <CreateTask isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Dashboard;
