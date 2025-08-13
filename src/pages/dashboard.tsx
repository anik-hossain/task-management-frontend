import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TaskCard from '@components/TaskCard';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateTask from '@/components/CreateTask';

const Dashboard: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateTask = (taskId: string, updates: Partial<{
    title: string;
    description: string;
    priority: string;
    status: string;
  }>) => {
    console.log(taskId, updates);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Users online: 3
        </p>
        <Button type="submit" className="cursor-pointer" onClick={()=>setIsOpen(true)}>Add Task</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            usersOnline={['user1', 'user2', 'user3']}
          />
        ))}
      </div>
      <CreateTask isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Dashboard;
