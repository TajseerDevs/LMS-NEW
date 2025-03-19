import React from 'react'
import { Navigate } from "react-router-dom";
import {  useSelector } from "react-redux";


const ProtectedRoute = ({children}) => {

    const userSlice = useSelector((state) => state.user);

    const { token } = userSlice;

    if(token){
        return children
    }

    return <Navigate to="/login" replace/>
}


export default ProtectedRoute