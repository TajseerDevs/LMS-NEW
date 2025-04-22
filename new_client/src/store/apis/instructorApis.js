import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


const instructorApi = createApi({
    reducerPath: "instructorApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1" }),
    endpoints: (builder) => ({
      createCourse: builder.mutation({

        query: ({ token , title , price , isPaid , duration , coursePic , extraInfo ,  tags , description , category , learningCategory , level}) => {
          
          const tagsString = JSON.stringify(tags)

          const formData = new FormData()

          formData.append("title", title)
          formData.append("isPaid", isPaid)
          formData.append("duration", duration)
          formData.append("description", description)
          formData.append("category", category)
          formData.append("learningCategory", learningCategory)
          formData.append("level", level)
          formData.append("tags", tagsString)
          formData.append("extraInfo", extraInfo)

          if (coursePic) {
            formData.append("coursePic" , coursePic)
          }

          return {
            url: `/instructor/create-course`,
            method: "POST",
            headers: {Authorization: `Bearer ${token}`} ,
            body: formData,
          }

        },
      }),
      getAllInstructorCourses: builder.query({
        query: ({token , page}) => ({
          url: `/instructor/all-instructor-courses?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        }),
      }),
      getAllInstructorCoursesNoPaging: builder.query({
        query: ({token , page}) => ({
          url: `/instructor/courses`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        }),
      }),
      addSectionToCourse: builder.mutation({
        query: ({token , courseId , name , items}) => ({
          url: `/instructor/add-course-section/${courseId}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` } ,
          body : {name , items}
        }),
      }),
      addItemToSection: builder.mutation({
        query: ({token ,  courseId, sectionId, formData}) => ({
          url: `/instructor/add-section-item/${courseId}/${sectionId}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` } ,
          body : formData
        }),
      }),
      uploadScrom: builder.mutation({
        query: ({ courseId , sectionId , itemId , token , formData}) => {
          return {
            url: `/instructor/upload-scorm/${courseId}/${sectionId}/${itemId}`,
            method: "PATCH",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      uploadContentFile: builder.mutation({
        query: ({ token ,  courseId, sectionId, formData}) => {
          return {
            url: `/instructor/upload-content/${courseId}/${sectionId}`,
            method: "PATCH",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      viewCourseStudents: builder.query({
        query: ({token , courseId }) => ({
          url: `/instructor/view-students/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }),
      getDeclineReason: builder.query({
        query: ({token , courseId }) => ({
          url: `/instructor/course/decline-reason/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      changeSectionPreview: builder.mutation({
        query: ({token , courseId , sectionId }) => ({
          url: `/instructor/change-section-preview/${courseId}/${sectionId}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getInstructorInsights: builder.query({
        query: ({token}) => ({
          url: `/instructor/insights`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getInstructorUngradedSubmissions: builder.query({
        query: ({token}) => ({
          url: `/instructor/assignments-submission/insights`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getRandomInstructorCourses: builder.query({
        query: ({token}) => ({
          url: `/instructor/random-courses`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getRandomStudentsWithCompletion: builder.query({
        query: ({token}) => ({
          url: `/instructor/random-students-completion`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getTwoRandomUngradedSubmissions: builder.query({
        query: ({token}) => ({
          url: `/instructor/random-ungraded-submissions`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getCourseStudentDetails : builder.query({
        query: ({token , courseId , page}) => ({
          url: `/instructor/course/${courseId}/students/insights?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getSingleStudentUser : builder.query({
        query: ({token , userId}) => ({
          url: `/user/single-user/${userId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getInstructorContentTickets : builder.query({
        query: ({token , page}) => ({
          url: `/instructor/tickets/content?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
      getInstructorProfile : builder.query({
        query: ({token}) => ({
          url: `/instructor/profile`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` } ,
        }),
      }), 
    }),
  })




  const {  
    useCreateCourseMutation ,
    useGetAllInstructorCoursesQuery ,
    useGetAllInstructorCoursesNoPagingQuery ,
    useAddItemToSectionMutation ,
    useAddSectionToCourseMutation ,
    useUploadScromMutation ,
    useGetDeclineReasonQuery ,
    useUploadContentFileMutation ,
    useViewCourseStudentsQuery ,
    useChangeSectionPreviewMutation ,
    useGetInstructorInsightsQuery ,
    useGetInstructorUngradedSubmissionsQuery ,
    useGetRandomInstructorCoursesQuery ,
    useGetRandomStudentsWithCompletionQuery ,
    useGetTwoRandomUngradedSubmissionsQuery ,
    useGetCourseStudentDetailsQuery ,
    useGetSingleStudentUserQuery ,
    useGetInstructorContentTicketsQuery ,
    useGetInstructorProfileQuery
  } = instructorApi



  export {
    useCreateCourseMutation ,
    useGetAllInstructorCoursesQuery ,
    useGetAllInstructorCoursesNoPagingQuery ,
    useAddItemToSectionMutation ,
    useAddSectionToCourseMutation ,
    useUploadScromMutation ,
    useGetDeclineReasonQuery ,
    useUploadContentFileMutation ,
    useViewCourseStudentsQuery , 
    useChangeSectionPreviewMutation ,
    useGetInstructorInsightsQuery ,
    useGetInstructorUngradedSubmissionsQuery ,
    useGetRandomInstructorCoursesQuery ,
    useGetRandomStudentsWithCompletionQuery ,
    useGetTwoRandomUngradedSubmissionsQuery ,
    useGetCourseStudentDetailsQuery ,
    useGetSingleStudentUserQuery ,
    useGetInstructorContentTicketsQuery ,
    useGetInstructorProfileQuery , 
    instructorApi ,
  }