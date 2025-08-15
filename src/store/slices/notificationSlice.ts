// store/slices/notificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '@/utils/api';

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
  taskId?: string | number; // optional link to task
}

interface NotificationState {
  notifications: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const res = await apiService.get('/notifications'); // adjust endpoint
    return res as Notification[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch notifications');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<string | number>) {
      const notification = state.notifications.find(n => n.id === action.payload);
      apiService.patch(`/notifications/${action.payload}/read`, {});
      if (notification) notification.is_read = true;
    },
    markAllAsRead(state) {
      state.notifications.forEach(n => (n.is_read = true));
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'succeeded';
        state.notifications = action.payload.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch notifications';
      });
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
