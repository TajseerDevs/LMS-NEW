import React, { useState } from 'react'
import courseCardImage from "../assets/course_card_image.png"
import { FaStar, FaAngleRight } from "react-icons/fa"
import { CiBookmark , CiCalendar } from "react-icons/ci"
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useAddToBookMarkMutation, useGetBookMarksQuery, useRemoveFromBookMarkMutation } from '../store/apis/studentApis'
import { useSelector } from 'react-redux';



const EnrolledCoursesCard = ({course , refetch : refetchEnrolledCourses , rfe}) => {

  const {user , token} = useSelector((state) => state.user)

  const [page , setPage] = useState(1)

  const {data : bookedCourses , isLoading , refetch} = useGetBookMarksQuery({token , page})
  
  const baseUrl = "http://10.10.30.40:5500"

  const navigate = useNavigate()

  const [addBookMark , {isLoading : isLoadingAddBookMark}] = useAddToBookMarkMutation()
  const [removeBookMark , {isLoading : isLoadingRemoveBookMark}] = useRemoveFromBookMarkMutation()


  const handleCardClick = () => {
    navigate(`/course/main-page/${course?.courseId}`)
  }


  const handleAddBookmark = async () => {

    try {
      await addBookMark({token , courseId : course?.courseId}).unwrap()
      await refetch() 
      await rfe() 
      await refetchEnrolledCourses() 
    } catch (error) {
      console.log(error)
    }

  }



  const handleRemoveBookmark = async () => {

    try {
      await removeBookMark({token , courseId : course?.courseId}).unwrap()
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

    <div className="max-w-[360px] mb-4 cursor-pointer h-[366px] rounded-3xl bg-[#f3f3f3] relative">
        
      <div className='relative'>
                
        <img src={courseCardImage} alt="Course" className="w-full object-fill" />
                
        <div className='absolute z-50 top-4 right-4 flex items-center gap-4'>
        
          {bookedCourses?.bookmarks?.some((item) => item?._id === course?.courseId) ? (
            <FaBookmark size={26} className='text-[#FFC200]' onClick={handleRemoveBookmark} />
              ) : (
            <CiBookmark onClick={handleAddBookmark} size={26} className="text-white font-semibold" />
          )}
        
        </div>
              
      </div>

      <div className="absolute z-1 top-2/4 left-1/2 -translate-x-1/2 p-3 bg-white w-[94%] text-primary-text-dark text-left rounded-3xl">

        <h1 className="font-bold mb-3 text-[#002147] capitalize text-lg max-w-[250px] tracking-wide">{course?.courseName}</h1>

        <div className="mt-2 flex items-center gap-4">
          
          <div className="w-[60%] bg-gray-200 rounded-full h-1">
            <div className="bg-[#6555BC] h-1 rounded-full" style={{ width : course?.progress }}></div>
          </div>

          <p className="text-sm text-[#002147] font-semibold">{course?.progress} Completed</p>
        
        </div>

        <div className='mt-3'>

          <span className='flex text-[16px] text-[#002147] font-semibold items-center gap-2'>
            <CiCalendar size={20}/>
            December 11,2024 - April 12,2025
          </span>

        </div>

        <div className='flex items-end mt-4'>
          <button onClick={handleCardClick} className='ml-auto text-[#403685] font-semibold text-[16px] flex items-center capitalize gap-1'>view more <FaAngleRight className='mt-0.5'/> </button>
        </div>

      </div>

    </div>

  )

}


export default EnrolledCoursesCard