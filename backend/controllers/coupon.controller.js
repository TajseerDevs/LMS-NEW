const createError = require("../utils/createError");
const User = require("../models/User")
const Coupon = require("../models/Coupon");



const getUserCoupon = async (req , res , next) => {

    try {
        
        const user = await User.findById(req.user._id)

        if(!user){
            return next(createError("user not exist" , 404))
        }

        const userCoupon = await Coupon.findOne({userId : req.user._id , isActive : true})

        if(!userCoupon){
            return next(createError("user don't have any coupons" , 404))
        }

        res.status(200).json(userCoupon)


    } catch (error) {
        next(error)
    }
    
}





const validateCoupon = async (req , res , next) => {

    try {
        
        const {code} = req.body
        
        const user = await User.findById(req.user._id)

        if(!user){
            return next(createError("user not exist" , 404))
        }

        const coupon = await Coupon.findOne({code , userId : req.user._id , isActive : true})

        if(!coupon){
            return next(createError("Coupon not found" , 404))
        }
       
        if(coupon.expireDate < new Date()){
            coupon.isActive = false
            await coupon.save()
            return next(createError("Coupon expired" , 400))
        }

        res.status(200).json(coupon) 

    } catch (error) {
        next(error)
    }

}






module.exports = {getUserCoupon , validateCoupon}