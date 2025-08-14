import apiService from '@/utils/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch tasks from API
export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiService.get('/tasks')
      return res as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching tasks');
    }
  }
);

// Async thunk to create a new task
export const createTask = createAsyncThunk<Task, Partial<Task>>(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await apiService.post('/tasks', taskData);
      return res as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error creating task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks(state) {
      state.tasks = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
