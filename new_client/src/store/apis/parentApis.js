import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const parentApi = createApi({
  reducerPath: "parentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/parent" }),
  endpoints: (builder) => ({
    getMyStudents : builder.query({
        query : ({token}) => ({
            url : `/students/get-all-students` ,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
    }),
    assignStudentsToParent: builder.mutation({
        query: ({ token, students }) => ({
          url: `/assign-students`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}`},
          body: { students },
        }),
    }),
    getChildInfo: builder.query({
        query: ({ token , childId }) => ({
          url: `/child/${childId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}`},
        }),
    }),
  }),
})



const {
    useGetMyStudentsQuery ,
    useAssignStudentsToParentMutation,
    useGetChildInfoQuery
} = parentApi



export {
    useGetMyStudentsQuery ,
    useAssignStudentsToParentMutation ,
    useGetChildInfoQuery ,
    parentApi ,
}
