import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"



const ParentProtectedRoute = ({ children }) => {

    const { user } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (user !== null) {
            setLoading(false)
        }
    }, [user]);


    if (loading) return <div>Loading...</div>


    if (user?.role === "parent" || user?.role === "admin") {
        return children
    }


    return <Navigate to="/login" />

}


export default ParentProtectedRoute
