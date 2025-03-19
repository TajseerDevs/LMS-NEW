const express = require("express")
const { protectRoutes } = require("../middlewares/auth")
const { checkOrderSuccess , createCheckoutSession } = require("../controllers/payment.controller")



const router = express.Router()



router.post("/create-checkout-session" , protectRoutes , createCheckoutSession)

router.post("/checkout-order-success" , protectRoutes , checkOrderSuccess)



module.exports = router