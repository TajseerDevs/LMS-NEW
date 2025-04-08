import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineWatchLater } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi"
import { CiHeart } from "react-icons/ci"
import testImg from "../../assets/test.png"
import correctIcon from "../../assets/correct-icon.svg"
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { VscRemoteExplorer } from "react-icons/vsc";
import { Link , useNavigate } from 'react-router-dom';
import sections from '../../data/sections';
import { FaAngleDown } from "react-icons/fa";
import { FaPlayCircle, FaFileAlt, FaImage, FaTasks , FaRegStar , FaVideo  } from "react-icons/fa"
import { VscPreview } from "react-icons/vsc"
import { MdPeople } from "react-icons/md"
import reviews from '../../data/reviews';
import { useGetCourseByIdQuery } from '../../store/apis/courseApis';
import { useDispatch, useSelector } from 'react-redux';
import getTotalTime from '../../utils/getTotalTime';
import { formatTimeWithLabels } from '../../utils/formatTime';
import YellowBtn from "../../components/YellowBtn"
import { useAddToCartMutation, useCalculateCartTotalQuery, useGetCartItemsQuery, useRemoveAllCourseItemsMutation } from '../../store/apis/cartApis';
import { useEnrollFreeCourseMutation } from '../../store/apis/studentApis';
import { toast } from "react-toastify";
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import ConfirmationPopup from '../../components/ConfirmationPopup';



const SingleCourse = () => {

  const baseUrl = "http://10.10.30.40:5500"

  const params = useParams()
  
  const {user , token} = useSelector((state) => state.user)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [isCourseInCart, setIsCourseInCart] = useState(false)
  const [isWishlist , setIsWishlist] = useState(false)
  const [expandedSections , setExpandedSections] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  
  const { data : cartData , isLoading, error , refetch : refetchCartItems} = useGetCartItemsQuery({token})
  const { refetch } = useCalculateCartTotalQuery({ token })
  
  const {data : course} = useGetCourseByIdQuery({token , courseId : params.courseId})
  
  const [addToCartFun] = useAddToCartMutation()
  const [removeCourseItemsFun] = useRemoveAllCourseItemsMutation()
  const [enrollFreeCourse] = useEnrollFreeCourseMutation()
  
  
  useEffect(() => {
    window.scrollTo(0 , 0)
  }, [])


  useEffect(() => {
    setIsCourseInCart(cartData?.cartItems?.some((cartItem) => (cartItem?._id || cartItem?.course?._id?.toString()) === course?._id))
  }, [cartData, course])
  
  

  const handleAddToCart = async (course) => {

    try {
      
      if (!user) {
        return toast.error("Please log in to add courses to the cart")
      }

      const isCourseExist = cartData?.cartItems?.find((cartItem) => cartItem?._id === course?._id)

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
      
      const isCourseExist = cartData?.cartItems?.find((cartItem) => (cartItem?._id || cartItem?.course?._id?.toString()) === course?._id)
      
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
      await enrollFreeCourse({token , courseId : course?._id})
      refetchStudentNotEnrolledCourses()
      refetchEnrolledCourses()
      navigate("/enrolled-courses")
    } catch (error) {
      console.log(error)
    }

    setShowPopup(false)

  }


  

  console.log(cartData)



  const toggleSection = (sectionId) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionId)
        ? prevSections.filter((id) => id !== sectionId)
        : [...prevSections, sectionId]
    )
  }


  const getItemIcon = (type) => {
    switch (type) {
      case "Video":
        return <FaPlayCircle className="text-orange-300" size={20} />;
      case "Document":
        return <FaFileAlt className="text-blue-500" size={20} />;
      case "Image":
        return <FaImage className="text-green-500" size={20} />;
      case "Activity":
        return <FaTasks className="text-purple-500" size={20} />;
      default:
        return null;
    }
  }


  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(course?.extraInfo || "", "text/html");
  const listItems = Array.from(parsedHtml.querySelectorAll("li")).map((li) => li.textContent.trim());




  return (

    <div className="overflow-y-auto p-6 min-h-screen">

      <div className='flex gap-4 ml-2 mb-2 cursor-pointer'>

        <div onClick={() => navigate("/explore-courses")} className='flex gap-3 items-center justify-center'>
          <IoBookOutline size={20}/>
          <span className='text-lg mb-1'>Courses</span>
          <MdOutlineKeyboardArrowRight size={20}/>
        </div>

        <div onClick={() => navigate("/explore-courses")} className='flex gap-3 items-center justify-center'>
          <VscRemoteExplorer size={20}/>
          <span className='text-lg mb-1'>Explore Courses</span>
          <MdOutlineKeyboardArrowRight size={20}/>
        </div>

        <div className='flex gap-3 items-center justify-center'>
          <span className='text-lg mb-1 capitalize font-semibold text-[#FFC200]'>{course?.title}</span>
        </div>

      </div>

      {/* Header Section */}
      <div className="bg-[#403685] text-white p-8 pb-20 relative">

        <div className='flex justify-between p-8'>

          <div>

            <div className='flex items-center mb-3 gap-4'>
              <img className='rounded-full' src={course?.course?.instructorId?.userObjRef?.profilePic ? `${baseUrl}${course.course.instructorId.userObjRef.profilePic}` : testImg} alt="" />
              <span className='rounded-full capitalize text-xl'>{course?.instructorId?.userObjRef?.firstName} {course?.instructorId?.userObjRef?.lastName}</span>
            </div>
            
            <h1 className="text-3xl ml-1 capitalize font-bold">{course?.title}</h1>

            <p className="text-xl capitalize ml-1 mt-3">
              {course?.description}
            </p>

          </div>

          <div className="mt-16 mr-12 flex space-x-6">

            {course?.isPaid ? (
              isCourseInCart ? <YellowBtn onClick={(e) => {e.stopPropagation() ; handleRemoveFromCart(course)}} text="Remove from cart" /> : <YellowBtn onClick={(e) => {e.stopPropagation() ; handleAddToCart(course)}} text="Add to cart" />
            ) : (
              <YellowBtn text="Enroll now" />
            )}

            {/* <button
              className={`px-4 py-2 w-42 h-[58px] rounded-lg font-semibold shadow-md flex items-center gap-1 text-[16px] text-white`}
              onClick={() => setIsWishlist(!isWishlist)}
              style={{background: "radial-gradient(222.86% 355.83% at 0.9% 2.98%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.18) 84.54%, rgba(255, 255, 255, 0.00) 100%)"}}
            >

              <CiHeart size={22} className="text-sm" /> {isWishlist ? "Added" : "Add to Wishlist"}
                            
            </button> */}
            
          </div>

        </div>

        <div className="absolute -bottom-12 left-0 w-full flex justify-center gap-8 p-6">

          <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
            <HiDocumentText className="text-xl" /> <span className='font-semibold'>{course?.sections?.length} Modules</span>
          </div>

          <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
            <MdOutlineWatchLater className="text-xl" /> <span className='font-semibold'>{course?.duration} Hours</span>
          </div>

          <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
            <FaStar className="text-yellow-400 text-xl" /> <span className='font-semibold'>{course?.rate} ({course?.feedbacks?.length} reviews)</span>
          </div>

          <div className="bg-white text-indigo-900 px-8 py-5 rounded-lg flex items-center gap-2 shadow-md">
            <BsFillPeopleFill className="text-xl" /> <span className='font-semibold'>({course?.studentsEnrolled?.length}) already enrolled</span>
          </div>

        </div>

      </div>

      <div className='p-12 mt-2'>

        <div className='flex font-semibold gap-8 text-[#656F79] text-xl'>
          <span>About</span>
          <span>Module</span>
          <span>Instructor</span>
          <span>Reviews</span>
          <span>Recommendation</span>
        </div>

      </div>

      <div className='px-12'>

        <h3 className='text-[#002147] font-semibold text-[28px]'>Course Description</h3>

        <p className='mt-5 capitalize max-w-[1000px] text-[22px]'>
         {course?.description}
        </p>

        <div className='flex flex-col gap-5 mt-10'>

          {listItems.map((item, index) =>
            item ? (
              <div key={index} className="flex gap-2 font-mediumBold">
                <img src={correctIcon} alt="Correct Icon" />
                <span className='capitalize'>{item}</span>
              </div>
            ) : null
          )}

        </div>

      </div>

      <div className='px-12 mt-12'>

        <h3 className='text-[#002147] font-semibold text-[28px]'>Course Content</h3>

        <div className='mt-4 bg-white flex flex-col items-start max-w-[900px] gap-2'>

          {course?.sections?.map((section, index) => (

            <div key={section._id} className='bg-white border-b w-full border-gray-300 p-4'>
              
              <div onClick={() => toggleSection(section._id)} className='flex justify-between cursor-pointer items-center'>

                <div className='flex cursor-pointer flex-col gap-2'>
                
                  <span className='font-semibold capitalize text-[18px]' onClick={async () => {
                    try {
                      toggleSection(section._id)
                    } catch (error) {
                      console.log(error)
                    }
                  }}>
                    Module {index + 1} : {section.name}
                  </span>

                  <div className="section-info text-[16px] text-gray-600">
                    {formatTimeWithLabels(getTotalTime(section?.items || []))} - {section.items?.length} Lessons
                  </div>

                </div>

                <FaAngleDown className={`transition-transform duration-300 ${expandedSections.includes(section._id) ? 'transform rotate-180' : ''}`} size={25}/>
              
              </div>

              {expandedSections?.includes(section._id) && (
                
                <div className='w-full'>

                  {section?.items?.map((item , itemIndex) => (
                    
                    <div key={item._id} className='flex cursor-pointer justify-between items-center w-full mt-8 mb-4'>

                      <div className='flex items-center gap-4'>
                        {getItemIcon(item.type)}
                        <span className='font-semibold text-[16px]'>{item.name}</span>
                      </div>

                      <span className='ml-auto text-[16px] font-semibold mr-2 text-gray-600'>{formatTimeWithLabels(item?.estimatedTime)}</span>
                      
                    </div>

                  ))}

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

      <div className='mt-12 p-6 ml-12 mb-10 bg-white max-w-[900px] flex flex-col h-full'>

        <h3 className='text-[#002147] mb-6 font-semibold text-[28px]'>Course Instructor</h3>

        <div className='flex gap-8 flex-grow'>

          <div>
            <img className='w-[140px] h-[140px] rounded-full object-contain' src={course?.course?.instructorId?.userObjRef?.profilePic ? `${baseUrl}${course.course.instructorId.userObjRef.profilePic}` : testImg} alt="" />
          </div>

          <div className='flex flex-col flex-grow'>

            <span className='mb-4 text-[#FFC200] capitalize font-semibold text-3xl'>{course?.instructorId?.userObjRef?.firstName} {course?.instructorId?.userObjRef?.lastName}</span>

            <div className='flex gap-2 flex-col'>

              {/* this data will kept static until we have some huge data set */}
              <div className='flex gap-8 mb-2'>
                
                <div className='flex items-center gap-2'>
                  <VscPreview className='text-[#6555BC]' size={24}/>
                  <span className='text-lg text-[#666] font-semibold'>44,342 Reviews</span>
                </div>
 
                <div className='flex items-center gap-2'>
                  <FaRegStar className='text-[#6555BC]' size={24}/>
                  <span className='text-lg text-[#666] font-semibold'>4.5 instructor rating</span>
                </div>

              </div>

              <div className='flex gap-5 mb-2'>

                <div className='flex items-center gap-2'>
                  <MdPeople className='text-[#6555BC]' size={24}/>
                  <span className='text-lg text-[#666] font-semibold'>402,291 Students</span>
                </div>
                
                <div className='flex items-center gap-2'>
                  <FaVideo className='text-[#6555BC]' size={24}/>
                  <span className='text-lg text-[#666] font-semibold'>402,291 Students</span>
                </div>              
              
              </div>

            </div>

          </div>

        </div>

        <div className='flex gap-4 ml-auto'>
          
          <button className='px-6 py-2 bg-white text-[#403685] border-2 font-semibold border-[#403685] rounded-lg'>
            <Link to={`/instructor/${course?.instructorId?._id}`}>
              Show Profile
            </Link>
          </button>
          
          <button className='px-6 py-2 bg-[#FFC200] text-[#002147] font-semibold rounded-lg'>Message</button>
        
        </div>

      </div>
      
      {/* // ! TODO this data will kept static until we have some huge data set */}
      <div className='mt-12 px-12 mb-10'>

        <h3 className='text-[#002147] mb-6 font-semibold text-[28px]'>Learner reviews</h3>
        
        <div className="flex gap-14">

        {/* Rating Summary */}
        <div className="w-72">

          <div className="flex items-center gap-2 text-xl font-semibold">
            <FaStar className="text-yellow-400" size={24} />
            <span className="text-[#002147]">4.5</span>
            <span className="text-gray-500 text-sm">964 reviews</span>
          </div>

          {/* Rating Breakdown */}
          <div className="mt-3 space-y-4">
            {[
              { stars: 5, percent: 60 },
              { stars: 4, percent: 30 },
              { stars: 3, percent: 2.5 },
              { stars: 2, percent: 1 },
              { stars: 1, percent: 15 },
            ].map((rating, index) => (
              <div key={index} className="flex items-center gap-3">

                <span className="text-sm font-semibold min-w-fit">{rating.stars} Stars</span>

                <div className="w-full h-3 bg-gray-200 rounded-md relative">

                  <div
                    className="h-3 bg-[#6555BC] rounded-md"
                    style={{ width: `${rating.percent}%` }}
                  ></div>

                </div>

                <span className="text-sm text-gray-600">{rating.percent}%</span>

              </div>

            ))}

          </div>

        </div>

        {/* Reviews */}
        <div className="w-2/3 flex gap-4">

          {reviews.map((review) => (

            <div key={review.id} className="bg-white shadow-md rounded-lg p-6  w-1/3 flex flex-col">

              <div className="relative bg-gray-100 p-4 rounded-lg">
              
                <span className="absolute top-1 right-2 bg-yellow-400 text-sm px-3 mb-1 py-1 rounded-lg flex items-center gap-1">
                  <FaStar size={12} className="text-white" /> {review.rating}
                </span>
              
                <p className="text-gray-700 pt-4 text-[15px]">{review.review}</p>
              
                <div className="absolute bottom-[-10px] left-[200px] w-4 h-4 bg-gray-100 transform rotate-45"></div>
              
              </div>

              <div className="flex items-center justify-center mt-6">

                <img
                  src={review.avatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div className="ml-3">
                  <p className="font-semibold text-[20px]">{review.name}</p>
                  <p className="text-gray-500 text-lg">{review.date}</p>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="mt-6 mr-10 text-right">
        <button className="text-indigo-600 font-semibold ">
          View more reviews
        </button>
      </div>

      </div>

      {showPopup && (
        <ConfirmationPopup
          course={course}
          onConfirm={(e) => handleEnroll(e)}
          onCancel={(e) => handleCancel(e)}
        />
      )}

    </div>

  )

}


export default SingleCourse









