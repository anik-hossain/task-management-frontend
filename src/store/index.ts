import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
