export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  tasks?: Task[];
}

type Assignee = {
  id: number
  name: string;
  email: string
  role: string
}

type Project = {
  id: number;
  name: string
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignee: Assignee;
  startDate: string;
  dueDate: string;
  dependencies: string[];
}