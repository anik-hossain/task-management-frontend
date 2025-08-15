import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CreateTask from '@/components/CreateTask';
import TaskCard2 from '@/components/TaskCard2';
import TaskCardSkeleton from '@/components/skeletons/TaskCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetTasksQuery } from '@/store/services/taskApi';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: tasks = [], isLoading } = useGetTasksQuery();

  useEffect(()=>{
    console.log(tasks);
    
  }, [tasks])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{tasks[0]?.project?.name}</h1>
      <div className="mb-4 flex justify-end items-center">
        <Button type="submit" className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading && Array.from({ length: 3 }).map((_, index) => <TaskCardSkeleton key={index} />)}

        {tasks?.map((task) => (
          <TaskCard2
            key={task.id}
            task={task}
            role={user?.role}
          />
        ))}
      </div>

      <CreateTask isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Dashboard;
