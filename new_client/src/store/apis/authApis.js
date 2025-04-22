import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/user" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: ({email , password}) => ({
        url: "/login",
        method: "POST",
        body: {email , password},
      }),
    }),
    getUser: builder.mutation({
      query: ({ token }) => {
        return {
          url: "",
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        };
      },
    }),
    getAllUsers: builder.query({
      query: ({ token , page }) => {
        return {
          url: `/all-users?page=${page}`,
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        };
      },
    }),
    uploadProfileImage: builder.mutation({
      query: ({ token, formData }) => ({
        url: "/upload-profile-pic",
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteProfileImg: builder.mutation({
      query: ({ token }) => ({
        url: "/delete-profile-pic",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
})



const { 
  useLoginUserMutation,
  useRegisterUserMutation ,
  useGetUserMutation ,
  useGetAllUsersQuery ,
  useUploadProfileImageMutation ,
  useDeleteProfileImgMutation
} = authApi



export {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserMutation ,
  useGetAllUsersQuery ,
  useUploadProfileImageMutation ,
  useDeleteProfileImgMutation ,
  authApi,
}
