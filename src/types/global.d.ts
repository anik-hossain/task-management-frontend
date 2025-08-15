export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignees: any[];
  start_date: string;
  end_date: string;
  dependencies: string[] | string;
}