import { createSlice } from "@reduxjs/toolkit";


const loadCartFromLocalStorage = () => {

  const cart = localStorage.getItem("cart")
  const total = localStorage.getItem("total")
  const subTotal = localStorage.getItem("subTotal")
  const coupon = localStorage.getItem("coupon")
  const isCouponApplied = localStorage.getItem("isCouponApplied") === 'true'

  return {
    cart: cart ? JSON.parse(cart) : [],
    total: total ? parseFloat(total) : 0,
    subTotal: subTotal ? parseFloat(subTotal) : 0,
    coupon: coupon ? JSON.parse(coupon) : null,
    isCouponApplied: isCouponApplied,
  }

}



const saveCartToLocalStorage = (state) => {

  localStorage.setItem("cart", JSON.stringify(state.cart))
  localStorage.setItem("total", state.total.toString());
  localStorage.setItem("subTotal", state.subTotal.toString())
  localStorage.setItem("isCouponApplied", state.isCouponApplied.toString())

  if (state.coupon) {
    localStorage.setItem("coupon", JSON.stringify(state.coupon));
  } else {
    localStorage.removeItem("coupon");
  }

}



const cartSlice = createSlice({
    name: "cartSlice",
    initialState: {
      cart : [] ,
      coupon : null ,
      total : 0 , // total will be the subTotal value with any discount value if its exist
      subTotal : 0 ,
      isCouponApplied : false ,
    },
    reducers : {
      setCartItems : (state , action) => {
        state.cart = action.payload?.cartItems
        cartSlice.caseReducers.calculateTotals(state)
    },
      addToCart : (state , action) => {
        const course = action.payload.course
        const isCourseExist = state?.cart?.find(cartItem => cartItem._id === course._id)

        if (!isCourseExist) {
          state.cart.push({ ...course , quantity: 1 })
        }

        cartSlice.caseReducers.calculateTotals(state)
      },
      removeFromCart : (state , action) => {
        const courseId = action.payload.courseId
        state.cart = state?.cart?.filter((cartItem) => cartItem?._id.toString() !== courseId.toString())
        cartSlice.caseReducers.calculateTotals(state)
      },
      clearCart : (state , action) => {
        state.cart = []
        state.total = 0
        state.subTotal = 0
        state.coupon = null
      },
      getMyCoupon : (state , action) => {
        state.coupon = action.payload.coupon
      },
      applyCoupon : (state , action) => {
        state.coupon = action.payload.coupon
        state.isCouponApplied = true
        cartSlice.caseReducers.calculateTotals
      },
      removeCoupon: (state) => {
        state.coupon = null
        state.isCouponApplied = false
        cartSlice.caseReducers.calculateTotals(state)
      },
      calculateTotals : (state) => {
        state.subTotal = state?.cart?.reduce((sum, cartItem) => sum + cartItem.price , 0)
        state.total = state.isCouponApplied && state.coupon ? state.subTotal - state.subTotal * (state.coupon.discountPercentege / 100) : state.subTotal
      },
    }
})



export const { setCartItems , addToCart , removeFromCart , clearCart , getMyCoupon , applyCoupon , removeCoupon , calculateTotals} = cartSlice.actions

export {cartSlice}