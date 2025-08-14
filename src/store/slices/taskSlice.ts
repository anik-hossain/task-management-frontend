import apiService from '@/utils/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
export const fetchTasks = createAsyncThunk<
  Task[],
  { force?: boolean },
  { state: { tasks: TaskState } }
>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiService.get('/tasks');
      return res as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching tasks');
    }
  },
  {
    condition: (payload, { getState }) => {
      const { force } = payload || {};
      if (force) return true;

      const { tasks, status } = getState().tasks;
      if (status === 'loading' || (status === 'succeeded' && tasks.length > 0)) {
        return false;
      }
      return true;
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
    },
    updateTaskInStore(
      state,
      action: PayloadAction<{ taskId: string; updates: Partial<Task> }>
    ) {
      const index = state.tasks.findIndex(t => t.id === action.payload.taskId);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload.updates };
      }
    },
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

export const { clearTasks, updateTaskInStore } = taskSlice.actions;
export default taskSlice.reducer;
