type Assignee = {
    id: number;
    name: string;
}


interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignees: Assignee[];
  start_date: string;
  end_date: string;
  dependencies: string;
}