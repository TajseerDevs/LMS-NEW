import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/conversation" }),
  endpoints: (builder) => ({
    createConversation: builder.mutation({
        query: ({conversationData , token}) => ({
          url: "",
          method: "POST",
          headers: { Authorization : `Bearer ${token}` },
          body: conversationData,
        }),
      }),
    getUserConversations: builder.query({
        query: ({token}) => ({
          url: "",
          method: "GET",
          headers: { Authorization : `Bearer ${token}` },
        }),
      }),
    getUserSingleConversation: builder.query({
        query: ({token , conversationId}) => ({
          url: `/${conversationId}`,
          method: "GET",
          headers: { Authorization : `Bearer ${token}` },
        }),
      }),
  }),
})



const {
    useCreateConversationMutation ,
    useGetUserConversationsQuery ,
    useGetUserSingleConversationQuery
} = conversationApi



export {
    useCreateConversationMutation ,
    useGetUserConversationsQuery, 
    useGetUserSingleConversationQuery ,
    conversationApi ,
}
