import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/student" }),
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
      query: ({token}) => ({
        url: `/courses-completion-percentage`,
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
    enrollFreeCourse: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/enroll-free/${courseId}`,
        method: "POST",
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
  useGetStudentProgressQuery ,
  useGetCourseCompletionPercentageQuery ,
  useCheckFeedbackStatusQuery ,
  useEnrollFreeCourseMutation
} = studentApi

 

       
export {
  useGetAllStudentCoursesQuery ,
  useCalculateStudentAttendanceQuery ,
  useGetAvgLessonsProgressQuery , 
  useGetAllCoursesCompletionPercentageQuery ,
  useGetStudentProgressQuery ,
  useGetCourseCompletionPercentageQuery ,
  useCheckFeedbackStatusQuery ,
  useEnrollFreeCourseMutation ,
  studentApi ,
}
