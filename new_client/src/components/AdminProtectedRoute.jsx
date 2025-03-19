import React from 'react'
import { Navigate} from "react-router-dom";
import { useSelector } from "react-redux";



const AdminProtectedRoute = ({children}) => {

    const userSlice = useSelector((state) => state.user);

    const { user , token } = userSlice;

    if(user?.role === "admin" && token && user.isAdmin){
        return children
    }

    return <Navigate to="/" replace/>

}


export default AdminProtectedRoute