const User = require("../models/User")
const Course = require("../models/Course")
const Coupon = require("../models/Coupon")
const Order = require("../models/Order")

const createError = require("../utils/createError")
const createStripeCoupon = require("../utils/createStripeCoupon")
const createNewCoupon = require("../utils/createNewCoupon")
const stripe = require("../db/stripe")
const Student = require("../models/Student")
const Enrollment = require("../models/Enrollment")




const createCheckoutSession = async (req , res , next) => {

    try {
        
        const {courses , couponCode} = req.body

        if(!Array.isArray(courses) || courses.length === 0){
            return next(createError("empty products cart" , 400))
        }

        let coupon = null
        let totalAmount = 0

        const lineItems = courses.map((course) => {

            const productPrice = Math.round(course.price * 100) // to convert the product price to cents value format
            const productQuantity = course.quantity
            totalAmount += productPrice * productQuantity

            return{
                price_data : {
                    currency : "usd" ,
                    product_data : {
                        name : course.title ,
                        images: [`http://localhost:5500/${course.coursePic}`]  // needs check to check if i must add the uploads/images or the coursePic already have it as string
                    },
                    unit_amount : productPrice
                },
                quantity: productQuantity 
            }

        })


        if(couponCode){

            coupon = await Coupon.findOne({code : couponCode , userId : req.user._id , isActive : true})

            if(coupon){
                // apply the coupon discount lets say the totalAmount is 100 and the coupon discount is 20 the formula will be like (100 * 20/100) so the discount will be 20 then minuse the 20 from out totalAmount then it will become 80
                totalAmount -= Math.round(totalAmount * coupon.discountPercentege / 100) 
            }

        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            line_items : lineItems,
            mode : "payment" ,
            success_url : `${process.env.UI_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.UI_URL}/purchase-cancel`,
            discounts : coupon ? [{coupon : await createStripeCoupon(coupon.discountPercentege)}] : [] ,
            // Metadata: The session stores metadata such as userId, couponCode, and the serialized products list, which will be used later in the order creation process.
            metadata : { 
                userId : req.user._id.toString() , 
                couponCode : couponCode || "" ,
                courses: JSON.stringify(courses.map((course) => ({
                    id: course._id,
                    quantity: course.quantity,
                    price: course.price
                })))
            }
        })

        // if the user buy with more than 200 dollars (20000) in cents format we will create a discount coupon for him to the next purchase operation and save the coupon in the db
        if(totalAmount > 20000){
            await createNewCoupon(req.user._id)
        }

        res.status(200).json({id : session.id , totalAmount : totalAmount / 100}) // to get the totalAmount in dollars format we divide it with 100 (convert from cents to dollar format)

    } catch (error) {
        next(error)
    }

}




const checkOrderSuccess = async (req , res , next) => {

    try {
        
        const {sessionId} = req.body

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        // the keys inside the metadata will be set when we create our session id when create new order
        if(session.payment_status === "paid"){

            if(session.metadata.couponCode){
                await Coupon.findByIdAndUpdate({userId : session.metadata.userId , code : session.metadata.couponCode} , {isActive : false} , {new : true})
            }

            const courses = JSON.parse(session.metadata.courses)

            const newOrder = new Order({
                user : session.metadata.userId ,
                courses : courses.map((course) => ({
                    product : course.id ,
                    quantity : course.quantity ,
                    price : course.price
                })),
                totalAmount : session.amount_total / 100,
                stripeSessionId : session.id
            })

            const studentUserDoc = await Student.findOne({userObjRef : req.user._id})

            if(!studentUserDoc){
                return next(createError("Student not exist" , 404))
            }

            const courseIds = courses.map((course) => course.id)

            const newCourses = courseIds.filter((courseId) => !studentUserDoc.coursesEnrolled.includes(courseId))

            if (newCourses.length > 0) {
                studentUserDoc.coursesEnrolled = [
                    ...studentUserDoc.coursesEnrolled,
                    ...newCourses, 
                ]
            }

            for (const courseId of newCourses) {

                const newEnrollment = new Enrollment({
                  studentId: studentUserDoc._id ,
                  courseId: courseId ,
                  enrollmentDate: new Date() ,
                  status: 'active'
                })

                await newEnrollment.save()

            }

            await Course.updateMany(
                { _id: { $in: newCourses } },  
                { $push: { studentsEnrolled: studentUserDoc._id } }  
            )

            await studentUserDoc.save()

            await newOrder.save()

            res.status(200).json({
                message : "Paymeny successful , order created " ,
                orderId : newOrder._id
            })

        }else {
            return next(createError("Payment not completed or failed" , 400))
        }

    } catch (error) {
        next(error)
    }

}






module.exports = {createCheckoutSession , checkOrderSuccess}