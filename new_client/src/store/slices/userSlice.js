import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null ,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUserSlice: (state, action) => {
      state.user = action.payload;
    },
    updateUserProfileSlice: (state, action) => {
      state.user = {...state.user , ...action.payload}
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
})



const { setUser , logout , updateUserSlice , updateUserProfileSlice } = userSlice.actions



export {userSlice , setUser , logout , updateUserSlice , updateUserProfileSlice}