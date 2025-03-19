const express = require("express");
const { protectRoutes } = require("../middlewares/auth");
const { addToCart , getCartCourses, removeAllCourseItems, resetCartItems, calculateCartTotal } = require("../controllers/cart.controller");


const router = express.Router()


router.get("/" , protectRoutes , getCartCourses)

router.post("/:courseId" , protectRoutes , addToCart)

router.delete("/:courseId" , protectRoutes , removeAllCourseItems)

router.patch("/" , protectRoutes , resetCartItems)

router.get('/calculate-total' , protectRoutes , calculateCartTotal)



module.exports = router