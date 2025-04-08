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
    addReminder: builder.mutation({
      query: ({ token, courseId, reminderName, reminderType, reminderDays, reminderTime, reminderDateTime }) => ({
        url: `/reminders`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          courseId,
          reminderName,
          reminderType,
          ...(reminderType === "weekly" && { reminderDays }),
          reminderTime,
          ...(reminderType === "once" && { reminderDateTime }),
        },
      }),
    }),
    getAllReminders: builder.query({
      query: ({token , courseId , page}) => ({
        url: `/reminders/${courseId}?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}`},
      }),
    }),
    deleteReminder: builder.mutation({
      query: ({token , reminderId}) => ({
        url: `/reminders/${reminderId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
      }),
    }),
    updateReminder: builder.mutation({
      query: ({ token, reminderId, reminderName, reminderType, reminderDays, reminderTime, reminderDateTime }) => ({
        url: `/reminders/${reminderId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          reminderName,
          reminderType,
          ...(reminderType === "weekly" && { reminderDays }),
          reminderTime,
          ...(reminderType === "once" && { reminderDateTime }),
        },
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
    addNote: builder.mutation({
      query: ({token , courseId , content}) => ({
        url: `/notes/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body : {content}
      }),
    }),
    getAllNotesForCourse: builder.query({
      query: ({token , courseId , page}) => ({
        url: `/notes/${courseId}?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    updateNote: builder.mutation({
      query: ({token , courseId , noteId , content}) => ({
        url: `/notes/${courseId}/notes/${noteId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body : {content}
      }),
    }),
    deleteNote: builder.mutation({
      query: ({token , courseId , noteId}) => ({
        url: `/notes/${courseId}/notes/${noteId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getBookMarks: builder.query({
      query: ({token , page}) => ({
        url: `/bookmarks?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    addToBookMark: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/add-bookmark/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    removeFromBookMark: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/remove-bookmark/${courseId}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    addToWishlist: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/add-whishlist/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    removeFromWishlist: builder.mutation({
      query: ({token , courseId}) => ({
        url: `/remove-whishlist/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getWishlist: builder.query({
      query: ({token , page}) => ({
        url: `/whishlist?page=${page}`,
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
  useGetCourseLastProgressQuery ,
  useAddReminderMutation ,
  useGetAllRemindersQuery ,
  useUpdateReminderMutation,
  useDeleteReminderMutation ,
  useAddNoteMutation ,
  useGetAllNotesForCourseQuery ,
  useUpdateNoteMutation ,
  useDeleteNoteMutation ,
  useGetBookMarksQuery ,
  useAddToBookMarkMutation ,
  useRemoveFromBookMarkMutation ,
  useAddToWishlistMutation ,
  useRemoveFromWishlistMutation ,
  useGetWishlistQuery
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
  useAddReminderMutation ,
  useGetAllRemindersQuery ,
  useUpdateReminderMutation ,
  useDeleteReminderMutation ,
  useAddNoteMutation ,
  useGetAllNotesForCourseQuery ,
  useUpdateNoteMutation ,
  useDeleteNoteMutation ,
  useGetBookMarksQuery ,
  useAddToBookMarkMutation ,
  useRemoveFromBookMarkMutation ,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation ,
  useGetWishlistQuery ,
  studentApi ,
}
