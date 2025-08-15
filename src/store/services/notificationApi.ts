// store/services/notificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export interface Notification {
  id: string | number;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
  taskId?: string | number;
}


export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    // Fetch all notifications
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),

    // Create a new notification
    createNotification: builder.mutation<Notification, Partial<Notification>>({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    
    markAsRead: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});


export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
