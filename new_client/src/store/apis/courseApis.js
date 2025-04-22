import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1" }),
    endpoints: (builder) => ({
      getAllCourses: builder.query({
        query: ({token , page}) => ({
          url: `/courses?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      suggestTopRatedCourses: builder.query({
        query: ({token , page}) => ({
          url: `/courses/suggest-top-rated-courses?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getCoursesLearningCategories: builder.query({
        query: ({token , page}) => ({
          url: `/student/learning-category`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getNotEnrolledCourses: builder.query({
        query: ({token , page}) => ({
          url: `/courses/not-enrolled?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getItemAttachment: builder.query({
        query: ({token , attachmentId}) => ({
          url: `/courses/item-attachment/${attachmentId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getItemAttachment: builder.query({
        query: ({token , attachmentId}) => ({
          url: `/courses/item-attachment/${attachmentId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      startItemActivity: builder.query({
        query: ({token , attachmentId}) => ({
          url: `/courses/download/${attachmentId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      getCourseById: builder.query({
        query: ({token , courseId}) => ({
          url: `/courses/${courseId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      modifyCourseSection: builder.mutation({
        query: ({token , courseId , sectionId , name}) => ({
          url: `/courses/modify-course-section/${courseId}/${sectionId}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body : {name}
        }),
      }),
      modifyItemInSection: builder.mutation({
        query: ({token , courseId , sectionId , itemId , name , type , content}) => ({
          url: `/courses/modify-section-item/${courseId}/sections/${sectionId}/items/${itemId}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body : {name , type , content}
        }),
      }),
      deleteCourseSection: builder.mutation({
        query: ({token , courseId , sectionId }) => ({
          url: `/courses/delete-course-section/${courseId}/${sectionId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      removeItemFromSection: builder.mutation({
        query: ({token , courseId , sectionId , itemId}) => ({
          url: `/courses/remove-section-item/${courseId}/sections/${sectionId}/items/${itemId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      deleteAttachment: builder.mutation({
        query: ({token , courseId , sectionId , itemId , attachmentId}) => ({
          url: `/courses/delete-attachment/${courseId}/sections/${sectionId}/items/${itemId}/attachments/${attachmentId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      changeSectionName: builder.mutation({
        query: ({token , courseId , sectionId , name}) => ({
          url: `/courses/${courseId}/sections/${sectionId}`,
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body : {name}
        }),
      }),
      changeItemName: builder.mutation({
        query: ({token , courseId , sectionId , itemId , name}) => ({
          url: `/courses/${courseId}/sections/${sectionId}/items/${itemId}`,
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body : {name}
        }),
      }),
      incrementSectionView: builder.mutation({
        query: ({token , courseId , sectionId }) => ({
          url: `/courses/section-view/${courseId}/sections/${sectionId}/view`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      incrementAttachmentView: builder.mutation({
        query: ({token , courseId , sectionId , attachmentId }) => ({
          url: `/courses/item-view/${courseId}/sections/${sectionId}/${attachmentId}/view`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      searchCoursesByTitle: builder.query({
        query: ({token , title }) => ({
          url: `/courses/search-courses/by-title?title=${title}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    }),
  });





const { 
  useGetAllCoursesQuery ,
  useSuggestTopRatedCoursesQuery ,
  useGetCoursesLearningCategoriesQuery ,
  useGetItemAttachmentQuery ,
  useGetNotEnrolledCoursesQuery ,
  useStartItemActivityQuery ,
  useGetCourseByIdQuery ,
  useModifyCourseSectionMutation ,
  useModifyItemInSectionMutation ,
  useDeleteCourseSectionMutation ,
  useRemoveItemFromSectionMutation ,
  useChangeSectionNameMutation ,
  useChangeItemNameMutation ,
  useIncrementSectionViewMutation ,
  useDeleteAttachmentMutation ,
  useIncrementAttachmentViewMutation ,
  useSearchCoursesByTitleQuery
} = coursesApi




export {
  useGetAllCoursesQuery ,
  useSuggestTopRatedCoursesQuery ,
  useGetCoursesLearningCategoriesQuery ,
  useGetItemAttachmentQuery ,
  useGetNotEnrolledCoursesQuery ,
  useStartItemActivityQuery ,
  useGetCourseByIdQuery ,
  useModifyCourseSectionMutation ,
  useModifyItemInSectionMutation ,
  useDeleteCourseSectionMutation ,
  useRemoveItemFromSectionMutation ,
  useChangeSectionNameMutation , 
  useChangeItemNameMutation ,
  useIncrementSectionViewMutation ,
  useDeleteAttachmentMutation ,
  useIncrementAttachmentViewMutation ,
  useSearchCoursesByTitleQuery ,
  coursesApi ,
}