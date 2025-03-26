import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1" }),
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({token}) => ({
        url: "/notification",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteAllNotifications: builder.mutation({
      query: ({token}) => ({
        url: "/notification",
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteNotification: builder.mutation({
      query: ({token , notificationId}) => ({
        url: `/notification/${notificationId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});



const { 
    useGetAllNotificationsQuery,
    useDeleteAllNotificationsMutation ,
    useDeleteNotificationMutation
} = notificationApi


    
export {
    useGetAllNotificationsQuery,
    useDeleteAllNotificationsMutation ,
    useDeleteNotificationMutation ,
    notificationApi,
}
