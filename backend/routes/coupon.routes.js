const express = require("express");
const { protectRoutes } = require("../middlewares/auth");
const { getUserCoupon, validateCoupon } = require("../controllers/coupon.controller");


const router = express.Router()


router.get("/" , protectRoutes , getUserCoupon)

router.post("/validate" , protectRoutes , validateCoupon)



module.exports = router
