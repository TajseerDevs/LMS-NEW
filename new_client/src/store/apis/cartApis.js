import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/cart" }),
  endpoints: (builder) => ({
    getCartItems: builder.query({
        query: ({token , page}) => ({
          url: `/?page=${page}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
      calculateCartTotal: builder.query({
        query: ({token}) => ({
          url: `/calculate-total`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    addToCart: builder.mutation({
        query: ({token , courseId}) => ({
          url: `/${courseId}`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    removeAllCourseItems: builder.mutation({
        query: ({token , courseId}) => ({
          url: `/${courseId}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    resetCartItems: builder.mutation({
        query: ({token}) => ({
          url: `/`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
  }),
});



const { 
  useGetCartItemsQuery ,
  useCalculateCartTotalQuery ,
  useAddToCartMutation ,
  useRemoveAllCourseItemsMutation ,
  useResetCartItemsMutation
} = cartApi


    
export {
  useGetCartItemsQuery ,
  useCalculateCartTotalQuery ,
  useAddToCartMutation ,
  useRemoveAllCourseItemsMutation ,
  useResetCartItemsMutation ,
  cartApi,
}
