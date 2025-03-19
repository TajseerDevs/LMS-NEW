import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/admin" }),
  endpoints: (builder) => ({
    
  }),
})



const { 
} = adminApi



export {

    adminApi ,
}
