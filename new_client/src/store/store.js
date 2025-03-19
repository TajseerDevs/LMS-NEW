import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react"

import { userSlice } from "./slices/userSlice";
import { authApi } from "./apis/authApis";
import { coursesApi } from "./apis/courseApis";
import { studentApi } from "./apis/studentApis";
import { instructorApi } from "./apis/instructorApis";
import { notificationApi } from "./apis/notificationApis";
import { paymentApi } from "./apis/paymentApis";
import { scormApi } from "./apis/scormApis";
import { cartSlice } from "./slices/cartSlice";
import { parentSlice } from "./slices/parentSlice";
import { instructorSlice } from "./slices/instructorSlice";
import { cartApi } from "./apis/cartApis";
import { ticketsApi } from "./apis/TicketApis";
import { ticketSlice } from "./slices/ticketSlice";
import { adminApi } from "./apis/adminApis";
import { messageApi } from "./apis/messageApis";
import { conversationApi } from "./apis/conversationApis";
import { quizApi } from "./apis/quizApis";
import { quizSlice } from "./slices/quizSlice";
import { assigmentApi } from "./apis/assigmentApis";


const store = configureStore({
    reducer:{
        user : userSlice.reducer,
        cart : cartSlice.reducer,
        parent : parentSlice.reducer,
        instructor : instructorSlice.reducer,
        ticket : ticketSlice.reducer,
        quiz : quizSlice.reducer,
        [authApi.reducerPath]: authApi.reducer, 
        [assigmentApi.reducerPath]: assigmentApi.reducer, 
        [adminApi.reducerPath]: adminApi.reducer, 
        [coursesApi.reducerPath]: coursesApi.reducer, 
        [studentApi.reducerPath]: studentApi.reducer, 
        [instructorApi.reducerPath]: instructorApi.reducer, 
        [notificationApi.reducerPath]: notificationApi.reducer, 
        [paymentApi.reducerPath]: paymentApi.reducer, 
        [scormApi.reducerPath]: scormApi.reducer, 
        [cartApi.reducerPath]: cartApi.reducer, 
        [ticketsApi.reducerPath]: ticketsApi.reducer, 
        [messageApi.reducerPath]: messageApi.reducer, 
        [quizApi.reducerPath]: quizApi.reducer, 
        [conversationApi.reducerPath]: conversationApi.reducer, 
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(assigmentApi.middleware)
            .concat(studentApi.middleware)
            .concat(instructorApi.middleware)
            .concat(notificationApi.middleware)
            .concat(paymentApi.middleware)
            .concat(scormApi.middleware)
            .concat(cartApi.middleware)
            .concat(ticketsApi.middleware)
            .concat(adminApi.middleware)
            .concat(messageApi.middleware)
            .concat(conversationApi.middleware)
            .concat(quizApi.middleware)
            .concat(coursesApi.middleware),
        devTools: true,
})


setupListeners(store.dispatch)


export {
    store ,
}