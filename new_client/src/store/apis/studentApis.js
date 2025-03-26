import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/student" }),
  endpoints: (builder) => ({
    getAllStudentCourses: builder.query({
      query: ({token}) => ({
        url: ``,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    calculateStudentAttendance: builder.query({
      query: ({token}) => ({
        url: `/attendance-avg`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAvgLessonsProgress: builder.query({
      query: ({token}) => ({
        url: `/avg-lessons-progress`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllCoursesCompletionPercentage : builder.query({
      query: ({token , status}) => ({
        url: `/courses-completion-percentage?status=${status}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllCoursesCompletionPercentagePaging : builder.query({
      query: ({token , page}) => ({
        url: `/courses-completion?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getStudentProgress : builder.query({
      query: ({token}) => ({
        url: `/courses-progress`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getCourseCompletionPercentage: builder.query({
      query: ({token , courseId}) => ({
        url: `/course-completion-percentage/${courseId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    checkFeedbackStatus: builder.query({
      query: ({token , courseId}) => ({
        url: `/course/check-feedback-status/${courseId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getStudentGrades: builder.query({
      query: ({token , page}) => ({
        url: `/grades?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    generateStudentGradesExcel: builder.mutation({
      query: ({token}) => ({
        url: `/grades-excel-sheet-report`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllStudentCoursesNoPaging: builder.query({
      query: ({token}) => ({
        url: `/all-courses`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    enrollFreeCourse: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/enroll-free/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    setCourseLastProgress: builder.mutation({
      query: ({token , courseId , sectionId , itemId , attachmentId}) => ({
        url: `/set-last-progress`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body : {courseId , sectionId , itemId , attachmentId}
      }),
    }),
    getCourseLastProgress: builder.query({
      query: ({token , courseId}) => ({
        url: `/course-last-progress/${courseId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});



const { 
  useGetAllStudentCoursesQuery ,
  useCalculateStudentAttendanceQuery ,
  useGetAvgLessonsProgressQuery ,
  useGetAllCoursesCompletionPercentageQuery ,
  useGetAllCoursesCompletionPercentagePagingQuery ,
  useGetStudentProgressQuery ,
  useGetCourseCompletionPercentageQuery ,
  useCheckFeedbackStatusQuery ,
  useEnrollFreeCourseMutation ,
  useGetStudentGradesQuery ,
  useGenerateStudentGradesExcelMutation ,
  useGetAllStudentCoursesNoPagingQuery ,
  useSetCourseLastProgressMutation,
  useGetCourseLastProgressQuery
} = studentApi

 

       
export {
  useGetAllStudentCoursesQuery ,
  useCalculateStudentAttendanceQuery ,
  useGetAvgLessonsProgressQuery , 
  useGetAllCoursesCompletionPercentageQuery ,
  useGetAllCoursesCompletionPercentagePagingQuery ,
  useGetStudentProgressQuery ,
  useGetCourseCompletionPercentageQuery ,
  useCheckFeedbackStatusQuery ,
  useEnrollFreeCourseMutation ,
  useGetStudentGradesQuery ,
  useGenerateStudentGradesExcelMutation ,
  useGetAllStudentCoursesNoPagingQuery ,
  useSetCourseLastProgressMutation ,
  useGetCourseLastProgressQuery ,
  studentApi ,
}
