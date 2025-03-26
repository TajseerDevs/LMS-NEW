import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const scormApi = createApi({
  reducerPath: "scormApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/scorm" }),
  endpoints: (builder) => ({
    getAllUserLogs: builder.query({
        query: ({ token }) => {
          return {
            url: `/all/logs`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
      }),
      getStudentCourseLogs: builder.query({
        query: ({ token , studentId , courseId , page}) => {
          return {
            url: `/all/student/logs/${studentId}/${courseId}?page=${page}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
      }),
      getUserAttachmentLogs: builder.query({
        query: ({ token , attachmentId }) => {
          return {
            url: `/logs/${attachmentId}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
      }),
      getUserSpecificScormLog: builder.query({
        query: ({ token , userId , courseId , sectionId , itemId , attachmentId }) => {
          return {
            url: `/${userId}/${courseId}/${sectionId}/${itemId}/${attachmentId}/log`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
      }),
      setScormLogs: builder.mutation({
        query: ({ token , userId , attachmentId , contentCmi }) => {
          return {
            url: `/${userId}/${attachmentId}/set-log`,
            method: "POST",
            headers: { Authorization: `Bearer ${token}`},
            body : {contentCmi}
          };
        },
      }),
  })
});




const {
    useGetAllUserLogsQuery ,
    useGetUserAttachmentLogsQuery ,
    useGetUserSpecificScormLogQuery ,
    useLazyGetUserSpecificScormLogQuery  ,
    useGetStudentCourseLogsQuery ,
    useSetScormLogsMutation
} = scormApi



export {
    useGetAllUserLogsQuery ,
    useGetUserAttachmentLogsQuery ,
    useGetUserSpecificScormLogQuery ,
    useLazyGetUserSpecificScormLogQuery ,
    useGetStudentCourseLogsQuery ,
    useSetScormLogsMutation ,
    scormApi,
};