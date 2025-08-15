// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './services/taskApi';
import { notificationApi } from './services/notificationApi';

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware, notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
