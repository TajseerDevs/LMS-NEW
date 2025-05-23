import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const assigmentApi = createApi({
  reducerPath: "assigmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/assignment" }),
  endpoints: (builder) => ({
    createAssignment: builder.mutation({
      query: ({ courseId, formData , token }) => ({
        url: `/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
    }),
    checkAssignmentDueDate: builder.query({
      query: ({ token , assignmentId }) => ({
        url: `/check-due-date/${assignmentId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
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
    submitAssignmentSubmission: builder.mutation({
      query: ({ assignmentId, courseId, formData, token }) => ({
        url: `/${courseId}/${assignmentId}/submit`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
    }),
    updateSubmission: builder.mutation({
      query: ({ assignmentId , submissionId , formData, token }) => ({
        url: `/update-submission/${assignmentId}/${submissionId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
    }),
    getAssignmentSubmission : builder.query({
      query: ({ token , assignmentId }) => ({
        url: `/submission/${assignmentId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllStudentsSubmissions : builder.query({
      query: ({ token , assignmentId , page }) => ({
        url: `/${assignmentId}/submissions?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllStudentAssignmentsSubmissions : builder.query({
      query: ({ token , courseId , userId , page }) => ({
        url: `/student-assignments/${courseId}/submissions/${userId}?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    addMarksToSubmission : builder.mutation({
      query: ({ token , assignmentId , userId , marks , feedback }) => ({
        url: `/${assignmentId}/submissions/${userId}/marks`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body : { marks , feedback }
      }),
    }),
  }),
})



const { 
  useCreateAssignmentMutation ,
  useCheckAssignmentDueDateQuery ,
  useGetInstructorAssigmentsQuery ,
  useGetCourseLatestAssignmentsQuery ,
  useGetAssignmentDetailsQuery,
  useSubmitAssignmentSubmissionMutation ,
  useGetAssignmentSubmissionQuery ,
  useUpdateSubmissionMutation ,
  useGetAllStudentsSubmissionsQuery ,
  useGetAllStudentAssignmentsSubmissionsQuery ,
  useAddMarksToSubmissionMutation
} = assigmentApi



export {
  useCreateAssignmentMutation ,
  useCheckAssignmentDueDateQuery ,
  useGetInstructorAssigmentsQuery ,
  useGetCourseLatestAssignmentsQuery ,
  useGetAssignmentDetailsQuery ,
  useSubmitAssignmentSubmissionMutation ,
  useGetAssignmentSubmissionQuery ,
  useUpdateSubmissionMutation ,
  useGetAllStudentsSubmissionsQuery ,
  useGetAllStudentAssignmentsSubmissionsQuery ,
  useAddMarksToSubmissionMutation ,
  assigmentApi,
}
