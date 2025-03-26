import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/message" }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
        query: ({messageData , token}) => ({
          url: "/",
          method: "POST",
          headers: { Authorization : `Bearer ${token}` },
          body: messageData,
        }),
      }),
      getAllMessages: builder.query({
        query: ({token , conversationId}) => ({
          url: `/all-messages/${conversationId}`,
          method: "GET",
          headers: { Authorization : `Bearer ${token}` },
        }),
      }),
      getAllPrevMessages: builder.query({
        query: ({token , conversationId , messageId}) => ({
          url: `/prev-messages/${conversationId}/${messageId}`,
          method: "GET",
          headers: { Authorization : `Bearer ${token}` },
        }),
      }),
  }),
})



const {
  useSendMessageMutation ,
  useGetAllMessagesQuery ,
  useGetAllPrevMessagesQuery
} = messageApi



export {
  useSendMessageMutation ,
  useGetAllMessagesQuery ,
  useGetAllPrevMessagesQuery ,
  messageApi ,
}
