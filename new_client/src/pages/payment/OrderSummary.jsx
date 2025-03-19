import React, { useEffect } from 'react'
import { useState } from "react";
import { FaArrowCircleRight , FaArrowCircleLeft} from "react-icons/fa";
import CourseCard from "../../components/CourseCard";
import courses from "../../data/courses";
import { IoMdPerson} from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import courseImg from "../../assets/course_test_image.png"
import { motion } from "framer-motion"
import { Link } from 'react-router-dom';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import CartItem from '../../components/CartItem';
import { useSelector } from 'react-redux';
import EmptyCartUI from '../../components/EmptyCartUI';
import { useCalculateCartTotalQuery, useGetCartItemsQuery } from '../../store/apis/cartApis';
import { useCreateCheckoutSessionMutation } from '../../store/apis/paymentApis'
import {loadStripe} from "@stripe/stripe-js"
import { useGetAllStudentCoursesQuery } from '../../store/apis/studentApis'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)



const OrderSummary = () => {

    const { token } = useSelector((state) => state.user)
    const { coupon } = useSelector((state) => state.cart)

    const { data , isLoading, error , refetch } = useGetCartItemsQuery({token})
    const {data : cartTotal} = useCalculateCartTotalQuery({token})

    const {data : enrolledCourses , refetch : refetchEnrolledCourses} = useGetAllStudentCoursesQuery({token})
    
    const [createCheckoutSession] = useCreateCheckoutSessionMutation()
    
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        if (data) {
            setCartItems(data.cartItems || [])
        }
    }, [data])



    const handleStripePayment = async () => {

        try {

            const formattedCart = cartItems.map(({ _id, title, coursePic, quantity, price }) => ({
				_id,
				title,
				coursePic,
				quantity,
				price,
			}))
            
            const stripe = await stripePromise
			const response = await createCheckoutSession({token , courses : formattedCart , couponCode : coupon ? coupon.code : null}).unwrap()
			const session = response

            const result = await stripe.redirectToCheckout({
				sessionId : session.id
			})

			if(result.error){
				console.log("error in payment")
			}

        } catch (error) {
            console.log(error)
        }

    }



    if (isLoading) return <p>Loading...</p>;
    
    if (error) return <p>Error loading cart</p>;


  return (

    <motion.div
        className='max-w-full m-auto rounded-lg p-12 px-28'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

        <div className={`flex ${cartItems?.length === 0 ? "justify-center" : "justify-between"} items-center p-2`}> 

            <div className="max-h-[500px] flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                {cartItems?.length === 0 ? (
                    <EmptyCartUI/>
                ) : (
                    <div>
                        {cartItems?.map((item) => (
                            <CartItem refetch={refetch} item={item} key={item?._id}/>
                        ))}
                    </div>
                )}

            </div>
            
            {cartItems?.length > 0 && (

                <div className="bg-gray-100 p-6 py-8 mr-24 self-start rounded-md mt-6 h-[320px] w-96">

                    <h3 className="text-2xl font-semibold mb-6">Detail Summary</h3>

                    <div className="flex text-lg font-semibold mb-2 justify-between text-gray-700">
                        <p>Sub total</p>
                        <p>${cartTotal?.totalPrice}</p>
                    </div>

                    <div className="flex text-lg font-semibold justify-between text-gray-700">
                        <p>Discount</p>
                        <p>$0</p>
                    </div>

                    <hr className="my-2" />

                    <div className="flex justify-between text-2xl mt-4 p-2 font-semibold">
                        <p>Total</p>
                        <p>${cartTotal?.totalPrice}</p>
                    </div>

                    <button onClick={handleStripePayment} className="w-full bg-yellow-500 text-[#002147] font-semibold py-2 mt-4 rounded-md flex justify-center items-center gap-2">
                        Continue to Checkout <FaArrowAltCircleRight size={18} />
                    </button>

                </div>

            ) }

        </div>
        
        {/* {
            cartItems?.length > 0 && (

                <div>

                    <h2 className="text-3xl font-bold text-gray-900 mt-20 mb-6">You might also like</h2>

                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
                        
                        {courses.map((course, index) => (
                            <CourseCard data={course}/>
                        )).slice(0 , 5)}

                    </div>

                    <div className="flex justify-center gap-10 mt-8">

                        <button disabled className="px-12 py-3 bg-[#002147] text-white font-semibold rounded-lg disabled:cursor-not-allowed transition">
                            Prev
                        </button>

                        <button className="px-12 py-3 bg-[#FFC200] text-white font-semibold rounded-lg disabled:cursor-not-allowed transition">
                            Next
                        </button>

                    </div>  

                </div>

            )

        } */}

    </motion.div>

  )

}


export default OrderSummary