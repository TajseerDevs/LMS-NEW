import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const assigmentApi = createApi({
  reducerPath: "assigmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/assignment" }),
  endpoints: (builder) => ({
    createAssignment: builder.mutation({
      query: ({ courseId, formData , token }) => ({
        url: `/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
    }),
    getInstructorAssigments: builder.query({
      query: ({ token }) => ({
        url: `/instructor`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getCourseLatestAssignments : builder.query({
      query: ({ token , courseId }) => ({
        url: `/course/${courseId}/latest`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAssignmentDetails : builder.query({
      query: ({ token , assignmentId }) => ({
        url: `/${assignmentId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
})



const { 
  useCreateAssignmentMutation ,
  useGetInstructorAssigmentsQuery ,
  useGetCourseLatestAssignmentsQuery ,
  useGetAssignmentDetailsQuery
} = assigmentApi



export {
  useCreateAssignmentMutation ,
  useGetInstructorAssigmentsQuery ,
  useGetCourseLatestAssignmentsQuery ,
  useGetAssignmentDetailsQuery ,
  assigmentApi,
}
