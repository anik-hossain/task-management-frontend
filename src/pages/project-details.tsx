import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateTask from '@/components/tasks/CreateTask';
import TaskCard from '@/components/tasks/TaskCard';
import TaskCardSkeleton from '@/components/skeletons/TaskCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetTasksQuery } from '@/store/services/taskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '@/types/global';
import getBadgeColor from '@/utils/getStatusBadgeClass';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project = {}, isLoading } = useGetTasksQuery(projectId || '', { skip: !projectId })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <div className='grid grid-cols-12'>
        <div className='col-span-8 p-4'>
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
            {(!project?.tasks?.length && !isLoading) && <p className="px-3 py-2 text-center text-gray-500 mt-20">
              No Task
            </p>}
            {project.tasks?.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </div>

          <CreateTask isOpen={isOpen} setIsOpen={setIsOpen} members={project.members} />
        </div>
        <div className='p-4 h-full bg-white w-full col-span-4 min-h-[60vh] border rounded-md'>
          <h3 className='font-bold text-lg text-gray-800'>{project?.name}</h3>
          <p className='mt-2 text-sm text-gray-500'>{project?.description}</p>
          <div className='w-1/2 mt-4 space-y-3'>
            <div className='grid grid-cols-2'>
              <b className='font-semibold text-gray-900 text-sm'>Status:</b>
              <p className={`text-gray-600 font-medium capitalize text-sm w-fit px-2 rounded-full ${getBadgeColor(project.status)
                }`}>{project?.status}</p>
            </div>
            <div className='grid grid-cols-2'>
              <b className='font-semibold text-gray-900 text-sm'>End Date:</b>
              <p className='text-gray-600 font-medium capitalize text-sm'>{project.endDate}</p>
            </div>
            <div className='grid grid-cols-2'>
              <b className='font-semibold text-gray-900 text-sm'>Members:</b>
              <div className='font-medium text-gray-600 text-sm'>
                {project?.members?.map((member: any) => <p key={member.id}>{member.name}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
