import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"



const InstructorProtectedRoute = ({ children }) => {

    const { user } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (user !== null) {
            setLoading(false)
        }
    }, [user]);


    if (loading) return <div>Loading...</div>


    if (user?.role === "instructor" || user?.role === "admin") {
        return children
    }


    return <Navigate to="/dashboard" />

}


export default InstructorProtectedRoute
