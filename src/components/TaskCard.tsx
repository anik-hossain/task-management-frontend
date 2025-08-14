import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignee: number[];
  start_date: string;
  end_date: string;
  dependencies?: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  usersOnline: string[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, usersOnline }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const canEdit = user && ['admin', 'manager', task.assignee].includes(user.role);

  const handleUpdate = () => {
    if (canEdit) {
      onUpdate(task.id, {
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        status: editedTask.status,
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {isEditing && canEdit ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Task Title"
          />
          <textarea
            value={editedTask.description ?? ''}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Task Description"
          />
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="cursor-pointer"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Priority:</span>{' '}
              <span
                className={
                  task.priority === 'high'
                    ? 'text-red-500'
                    : task.priority === 'medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{' '}
              {/* {task.status.charAt(0).toUpperCase() + task.status.slice(1)} */}
            </p>
            <p className="text-sm">
              <span className="font-medium">Assignee:</span> {task.assignee}
            </p>
            <p className="text-sm">
              <span className="font-medium">Start:</span> {new Date(task.start_date).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">End:</span> {new Date(task.end_date).toLocaleDateString()}
            </p>
            {task.dependencies && task.dependencies.length > 0 && (
              <p className="text-sm">
                <span className="font-medium">Dependencies:</span> {task.dependencies}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Users Viewing:</span>{' '}
              {usersOnline.includes(task.id) ? 'Multiple users' : 'None'}
            </p>
          </div>
          {canEdit && (
            <Button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer mt-4"
            >
              Edit Task
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;