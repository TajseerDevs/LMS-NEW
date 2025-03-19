const jwt = require("jsonwebtoken")
const createError = require("../utils/createError")
const User = require("../models/User")


const protectRoutes = async (req , res , next) => {
    
    let token
    
    try {

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token){
            return next(createError("Not authorized to access this route" , 401))
        }

        // verify the token , and get the payload object 
        jwt.verify(token , process.env.JWT_SECRET , async (err , decodedToken) => {

            if(err){
                return next(createError("Access Forbidden" , 403)) 
            }

            // create a req key called user , contain the id for logged user
            req.user = await User.findById(decodedToken.id).select("-password")
            
            next()
        
        })

    } catch (error) {
        next(error)
    }
}




const adminAuth = (req , res , next) => {
    if(req.user.role === "admin"){
        next()
    }else{
        return next(createError("Not authorized to access this route , admins only" , 401))
    }
}



module.exports = {protectRoutes , adminAuth}