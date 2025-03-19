const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
    code : {
        type : String ,
        unique : true ,
        required : true
    },
    discountPercentege : {
        type : Number ,
        required : true ,
        min : 0 ,
        max : 100
    },
    expireDate : {
        type : Date ,
        required : true
    },
    isActive : {
        type : Boolean ,
        default : false
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "users" ,
        required : true ,
        unique : true
    }
},  {timestamps : true})




const Coupon = mongoose.model("coupons" , couponSchema)



module.exports = Coupon