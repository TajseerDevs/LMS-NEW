import { createSlice } from "@reduxjs/toolkit";


const ticketSlice = createSlice({
    name: "ticketSlice",
    initialState: {
      cart : [] ,
      coupon : null ,
      total : 0 , // total will be the subTotal value with any discount value if its exist
      subTotal : 0 ,
      isCouponApplied : false ,
    }
})



export {ticketSlice}