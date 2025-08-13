import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string;
  startDate: string;
  endDate: string;
  dependencies?: string[];
}

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for homepage',
      priority: 'high',
      status: 'open',
      assignee: 'Alice',
      startDate: '2025-08-01',
      endDate: '2025-08-07',
      dependencies: [],
    },
    {
      id: '2',
      title: 'Setup Database',
      description: 'Install and configure PostgreSQL database',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Bob',
      startDate: '2025-08-02',
      endDate: '2025-08-05',
      dependencies: ['1'],
    },
    {
      id: '3',
      title: 'API Integration',
      description: 'Integrate backend API with frontend',
      priority: 'high',
      status: 'pending',
      assignee: 'Charlie',
      startDate: '2025-08-08',
      endDate: '2025-08-15',
      dependencies: ['2'],
    },
  ],
  status: 'succeeded',
  error: null,
};


const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    clearTasks(state) {
      state.tasks = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  // no extraReducers since no async thunks
});

export const { setTasks, addTask, updateTask, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
