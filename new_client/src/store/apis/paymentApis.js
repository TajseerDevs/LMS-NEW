import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/payment" }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
        query: ({token , courses , couponCode}) => ({
          url: `/create-checkout-session`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body : {courses , couponCode}
        }),
      }),
      checkOrderSuccess: builder.mutation({
        query: ({token , sessionId}) => ({
          url: `/checkout-order-success`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body : {sessionId}
        }),
      }),
  }),
});



const { 
    useCreateCheckoutSessionMutation ,
    useCheckOrderSuccessMutation
} = paymentApi


    
export {
    useCreateCheckoutSessionMutation ,
    useCheckOrderSuccessMutation ,
    paymentApi,
}
