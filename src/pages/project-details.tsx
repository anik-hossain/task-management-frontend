import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateTask from '@/components/tasks/CreateTask';
import TaskCard from '@/components/tasks/TaskCard';
import TaskCardSkeleton from '@/components/skeletons/TaskCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetTasksQuery } from '@/store/services/taskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '@/types/global';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project = {}, isLoading } = useGetTasksQuery(projectId || '', { skip: !projectId })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <div className="mb-4 flex justify-end items-center gap-2">
        {user && ['admin', 'manager'].includes(user?.role) && <Button type="submit" className="cursor-pointer" onClick={() => navigate(`/project-timeline/${projectId}`)}>
          Timeline
        </Button>}

        <Button type="submit" className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading && Array.from({ length: 3 }).map((_, index) => <TaskCardSkeleton key={index} />)}

        {project.tasks?.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            role={user?.role}
          />
        ))}
      </div>

      <CreateTask isOpen={isOpen} setIsOpen={setIsOpen} members={project.members} />
    </div>
  );
};

export default Dashboard;
