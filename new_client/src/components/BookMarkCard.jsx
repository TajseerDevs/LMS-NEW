import React from 'react'
import courseCardImage from "../assets/course_card_image.png"
import { FaStar, FaAngleRight, FaBookmark } from "react-icons/fa"
import { IoMdShareAlt } from "react-icons/io"
import { CiBookmark , CiCalendar } from "react-icons/ci"
import { useNavigate } from 'react-router-dom'
import { useAddToBookMarkMutation, useGetAllCoursesCompletionPercentageQuery, useGetBookMarksQuery, useRemoveFromBookMarkMutation } from '../store/apis/studentApis'
import { useSelector } from 'react-redux'



const BookMarkCard = ({item , refetch : rfe}) => {

  const navigate = useNavigate()

  const {user , token} = useSelector((state) => state.user)

  const {data : bookedCourses , isLoading , refetch} = useGetBookMarksQuery({token})
  const {data : enrolledCourses , refetch : refetchEnrolledCourses} = useGetAllCoursesCompletionPercentageQuery({token})
  
  const [addBookMark , {isLoading : isLoadingAddBookMark}] = useAddToBookMarkMutation()
  const [removeBookMark , {isLoading : isLoadingRemoveBookMark}] = useRemoveFromBookMarkMutation()


  const handleAddBookmark = async () => {

    try {
      await addBookMark({token , courseId : item?._id}).unwrap()
      await refetch() 
      await rfe() 
      await refetchEnrolledCourses() 
    } catch (error) {
      console.log(error)
    }

  }



  const handleRemoveBookmark = async () => {

    try {
      await removeBookMark({token , courseId : item?._id}).unwrap()
      await refetch() 
      await rfe() 
      await refetchEnrolledCourses() 
    } catch (error) {
      console.log(error)
    }

  }


  if(isLoading || isLoadingAddBookMark || isLoadingRemoveBookMark){
    return <h1 className='text-xl p-10'>Loading ...</h1>
  }



  return (

    <div className="max-w-[360px] mb-4 h-[366px] rounded-3xl bg-[#f3f3f3] relative">
      
      <div className='relative'>
        
        <img src={courseCardImage} alt="Course" className="w-full object-fill" />
        
        <div className='absolute z-50 top-4 right-4 flex items-center gap-4'>

          <span className='p-3 rounded-full' style={{background: "radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)"}}>
            
            {bookedCourses?.bookmarks?.some((bookedCourse) => bookedCourse?._id === item?._id) && !isLoadingAddBookMark && !isLoadingRemoveBookMark ? (
              <FaBookmark size={26} className='text-[#FFC200]' onClick={handleRemoveBookmark} />
                ) : (
              <CiBookmark onClick={handleAddBookmark} size={26} className="text-white font-semibold" />
            )}     
                 
          </span>

        </div>
      
      </div>

      <div className="absolute z-1 top-2/4 left-1/2 -translate-x-1/2 p-3 bg-white w-[94%] text-primary-text-dark text-left rounded-3xl">
        
        <p className="text-primary-text-dark mb-3 flex items-center">
          <FaStar className="text-primary-normal text-[#FFC200] mr-1" />
          <span className='text-[#403685] font-semibold'> <span className='text-[#002147]'>{item?.rate}</span> ({item?.ratings?.length})</span>
        </p>

        <h1 className="font-bold text-xl mb-3 max-w-[250px] capitalize tracking-wide">{item?.title}</h1>

        <div className="flex font-semibold items-center mb-2">
          <span className='text-[#403685] font-semibold text-lg'>{item?.duration} hrs</span>
        </div>


        <div className="flex gap-5 p-1">

          <span className='flex text-[14px] whitespace-nowrap text-[#979797] items-center gap-2'>
            <CiCalendar size={20}/>
            {/* needs to be updated when have start , ebd date */}
            February 20th at 11:03 pm 
          </span>

          <button onClick={() => navigate(`/course/main-page/${item?._id}`)} className='flex capitalize text-[12px] items-center gap-1 text-[#403685] font-semibold'>
            complete
            <FaAngleRight/> 
          </button>

        </div>

      </div>

    </div>

  )

}


export default BookMarkCard