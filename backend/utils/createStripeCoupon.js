const stripe = require("../db/stripe")


const createStripeCoupon = async (discountPercentage) => {

    const coupon = stripe.coupons.create({
        percent_off : discountPercentage ,
        duration : "once"
    })

    return coupon.id
}



module.exports = createStripeCoupon