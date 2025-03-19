const createError = require("../utils/createError");
const User = require("../models/User")
const Course = require("../models/Course")




const getCartCourses = async (req, res, next) => {

  try {

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const courses = await Course.find({ _id: { $in: req.user.cartItems.map(item => item.courseId)}})
    .skip(skip)
    .limit(limit)
    .populate({
      path: "instructorId",
      populate: {
        path: "userObjRef"
      }
    })      

    const totalCartCourses = await Course.countDocuments({ _id: { $in: req.user.cartItems.map(item => item.courseId)}})
  
    const cartItems = courses.map(course => ({
      ...course.toJSON(),
      quantity: 1,
    }))
  
    res.status(200).json({
      cartItems ,
      page ,
      totalCartCourses , 
      totalPages : Math.ceil(totalCartCourses / limit)
    })

  } catch (error) {
    next(error)
  }

}
  




const addToCart = async (req, res, next) => {

  try {

    const { courseId } = req.params
    const user = req.user
    
    const isCourseExistInCart = user.cartItems.some(cartItem => cartItem.courseId.toString() === courseId.toString())
  
    if (isCourseExistInCart) {
      return res.status(403).json({msg : "Course is already in the cart"})
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({msg : "Course not exist"})
    }
  
    user.cartItems.push({ courseId : courseId , quantity: 1 , course })
    
    await user.save()
  
    res.status(200).json(user.cartItems)

  } catch (error) {
    next(error)
  }

}
  




  const removeAllCourseItems = async (req, res, next) => {

    try {

      const { courseId } = req.params
      const user = req.user

      user.cartItems = user.cartItems.filter(cartItem => cartItem.courseId.toString() !== courseId.toString())
  
      await user.save()
  
      res.status(200).json(user.cartItems)

    } catch (error) {
      next(error)
    }

  }




  const resetCartItems = async (req , res , next) => {

    try {
      
      const user = req.user
      user.cartItems = []

      await user.save()
      
      res.status(200).json(user.cartItems)

    } catch (error) {
      next(error)
    }

  }



  const calculateTotal = (cartItems) => {

    let total = 0
  
    cartItems.forEach((item) => {
      if (item.course && item.course.price) {
        total += item.course.price
      }

    })
  
    return total

  }



  const calculateCartTotal = async (req , res , next) => {

    const { cartItems } = req.user

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({totalPrice : 0 })
    }
  
    try {
      const totalPrice = calculateTotal(cartItems)
      return res.json({ totalPrice })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while calculating the total' });
    }
  }
  



module.exports = {getCartCourses , addToCart , removeAllCourseItems , resetCartItems , calculateCartTotal}