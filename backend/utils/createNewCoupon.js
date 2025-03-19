const Coupon = require("../models/Coupon")


const createNewCoupon = async (userId) => {

    try {

        const newCoupon = new Coupon({
            userId,
            code : "GIFT" + Math.random().toString(36).substring(2 , 8).toUpperCase() ,
            discountPercentege : 10 ,
            expireDate : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiration
        })

        await newCoupon.save()

        return newCoupon

    } catch (error) {
        console.log(error)    
    }

}



module.exports = createNewCoupon