import { FaStar, FaRegUser, FaRegFileAlt, FaClock, FaCircle } from "react-icons/fa"
import PropTypes from 'prop-types'
import { useSelector } from "react-redux"
import { toast } from "react-toastify";
import { useGetCartItemsQuery , useAddToCartMutation , useRemoveAllCourseItemsMutation, useCalculateCartTotalQuery } from "../store/apis/cartApis"
import { addToCart , setCartItems , removeFromCart } from "../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import { useEnrollFreeCourseMutation } from "../store/apis/studentApis";



const CourseCard = ({ data , refetchStudentNotEnrolledCourses , refetchEnrolledCourses , navigate }) => {

  const baseUrl = "http://10.10.30.40:5500";

  const {user , token} = useSelector((state) => state.user)
  const {cart} = useSelector((state) => state.cart)

  const [isCourseInCart, setIsCourseInCart] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [cartItems, setCartItems] = useState([])

  
  const dispatch = useDispatch()

  const handleCardClick = () => {
    navigate(`/courses/single-course/${data?._id}`)
  }

  const { data : cartData , isLoading, error , refetch : refetchCartItems} = useGetCartItemsQuery({token})

  const { refetch } = useCalculateCartTotalQuery({ token })

  useEffect(() => {
    if (cartData) {
        setCartItems(data.cartItems || [])
      }
  }, [cartData])

  
  const [addToCartFun] = useAddToCartMutation()
  const [removeCourseItemsFun] = useRemoveAllCourseItemsMutation()
  const [enrollFreeCourse] = useEnrollFreeCourseMutation()


  useEffect(() => {
    setIsCourseInCart(cartItems?.cartItems?.some((cartItem) => (cartItem?._id || cartItem?.course?._id?.toString()) === data?._id))
  }, [cartItems, data?._id])

  console.log(cartItems)

  const handleAddToCart = async (course) => {
    
    try {

      if (!user) {
        return toast.error("Please log in to add courses to the cart")
      }
      
      const isCourseExist = cartItems?.cartItems?.find((cartItem) => cartItem?._id === data?._id)

      if (isCourseExist) {
        return toast.error("This course is already in your cart")
      }

      const res = await addToCartFun({ token , courseId: course?._id })
      
      await refetchCartItems()
      await refetch()
      dispatch(addToCart({ course }))
      dispatch(setCartItems({ cartItems: res.data}))
      
    } catch (error) {
      const errorMessage = error?.response?.data?.msg
      toast.error(errorMessage)
    }

  }
  
  
  const handleRemoveFromCart = async (course) => {

    try {
      
      if (!user) {
        return toast.error("Please log in to add courses to the cart")
      }

      const isCourseExist = cartItems?.cartItems?.find((cartItem) => (cartItem?._id || cartItem?.course?._id?.toString()) === data?._id)

      if (!isCourseExist) {
        return toast.error("This course is not in your cart")
      }

      dispatch(removeFromCart({ courseId: course._id }))

      const res = await removeCourseItemsFun({ token, courseId: course?._id })
  
      await refetchCartItems()
      await refetch()
  
      dispatch(setCartItems({ cartItems: res.data }))

    } catch (error) {
      const errorMessage = error?.response?.data?.msg
      toast.error(errorMessage)
    }

  }


  const handleCancel = async (e) => {
    e.stopPropagation()
    setShowPopup(false)
  }



  const handleEnroll = async (e) => {

    try {
      e.stopPropagation()
      await enrollFreeCourse({token , courseId : data?._id})
      refetchStudentNotEnrolledCourses()
      refetchEnrolledCourses()
      navigate("/enrolled-courses")
    } catch (error) {
      console.log(error)
    }

    setShowPopup(false)

  }



  return (

    <div onClick={handleCardClick} className="max-w-[355px] cursor-pointer h-[366px] rounded-3xl bg-[#f3f3f3] relative">

      <img src={`${baseUrl}${data?.coursePic}`} alt="Course" className="w-full rounded-lg object-fill" />

      <div className="absolute z-1 top-2/4 left-1/2 -translate-x-1/2 p-3 bg-white w-[94%] text-primary-text-dark text-left rounded-3xl">
        
        <p className="text-primary-text-dark mb-1 flex items-center">
          <FaStar className="text-primary-normal text-[#FFC200] mr-1" /><span className="text-[#002147] font-semibold">{data?.rate}</span>
        </p>

        <h1 className="font-bold mb-2 text-[#002147] text-lg capitalize tracking-wide">{data?.title}</h1>

        <div className="flex flex-col p-1">

          <div className="flex items-center mb-2">

            <span className="flex items-center">
              <FaRegUser className="mr-2 text-[#403685]" />
              {data?.instructorId?.userObjRef?.firstName} {data?.instructorId?.userObjRef?.lastName}
            </span>

            <span className="flex items-center ml-3">
              <FaCircle className="mx-2 my-0.5 text-[0.4rem] text-[#d8d8d8]" />
              {data?.learningCategory}
            </span>

          </div>

          <div className="flex gap-3 items-center mb-2">

            <span className="flex items-center">
              <FaRegFileAlt className="mr-2 text-[#403685]" />
              {data?.sections?.length} Modules
            </span>

            <span className="flex ml-3 items-center">
              <FaClock className="mr-2 text-[#403685]" />
              Duration {data?.duration} hr
            </span>

          </div>

          <div className="flex items-center justify-between mt-1">

            {
              data?.isPaid ?
              (
                <>
                  <span className="text-[#002147] font-semibold">{data?.price}$</span>
                  
                  {isCourseInCart ?
                   <>
                    <button onClick={(e) => {e.stopPropagation() ; handleRemoveFromCart(data)}} className="text-[#403685] font-semibold capitalize">Remove</button>
                   </> 
                   : 
                   <>
                    <button onClick={(e) => {e.stopPropagation() ; handleAddToCart(data)}} className="text-[#403685] font-semibold capitalize">Add to Cart</button>
                   </>
                  }
                </>
              )
              :
              ( 
                <>                
                  <span className="text-[#002147] font-semibold">Free</span>
        
                  <button onClick={(e) => {e.stopPropagation() ; setShowPopup(true)}} className="text-[#403685] font-semibold">Enroll now</button>
                </>
              )
            }
          
          </div>

        </div>

      </div>

      {showPopup && (
        <ConfirmationPopup
          course={data}
          onConfirm={(e) => handleEnroll(e)}
          onCancel={(e) => handleCancel(e)}
        />
      )}

    </div>

  )

}


CourseCard.propTypes = {
  data: PropTypes.object.isRequired,
}

export default CourseCard
