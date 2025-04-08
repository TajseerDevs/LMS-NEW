import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://10.10.30.40:5500/api/v1/certificate" }),
  endpoints: (builder) => ({
    getMyCertificates: builder.query({
        query: ({token , page}) => ({
          url: `/my-certificates?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
    }),
    generateCertificate: builder.mutation({
        query: ({token , courseId}) => ({
          url: `/generate-certificate/${courseId}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
    }),
  }),
})



const { 
    useGetMyCertificatesQuery ,
    useGenerateCertificateMutation
} = certificateApi



export {
    useGetMyCertificatesQuery ,
    useGenerateCertificateMutation ,
    certificateApi ,
}
