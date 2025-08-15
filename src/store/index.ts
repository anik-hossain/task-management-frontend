import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './services/taskApi';
import { notificationApi } from './services/notificationApi';
import { projectApi } from './services/projectApi';

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware, notificationApi.middleware, projectApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
