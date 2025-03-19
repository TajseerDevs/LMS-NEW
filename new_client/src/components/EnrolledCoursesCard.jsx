import React from 'react'
import courseCardImage from "../assets/course_card_image.png"
import { FaStar, FaAngleRight } from "react-icons/fa"
import { CiBookmark , CiCalendar } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';




const EnrolledCoursesCard = ({course}) => {

  const baseUrl = "http://localhost:5500"

  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/course/main-page/${course?.courseId}`)
  }


  return (
    <div className="max-w-[360px] mb-4 cursor-pointer h-[366px] rounded-3xl bg-[#f3f3f3] relative">
        
      <div className='relative'>
                
        <img src={courseCardImage} alt="Course" className="w-full object-fill" />
                
        <div className='absolute z-50 top-4 right-4 flex items-center gap-4'>
        
          <span className='p-3 rounded-full' style={{background: "radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)"}}>
            <CiBookmark  size={24} className='text-white font-semibold'/>
          </span>
        
        </div>
              
      </div>

      <div className="absolute z-1 top-2/4 left-1/2 -translate-x-1/2 p-3 bg-white w-[94%] text-primary-text-dark text-left rounded-3xl">

        <h1 className="font-bold mb-3 text-[#002147] capitalize text-lg max-w-[250px] tracking-wide">{course?.courseName}</h1>

        <div className="mt-2 flex items-center gap-4">
          
          <div className="w-[60%] bg-gray-200 rounded-full h-1">
            <div className="bg-[#6555BC] h-1 rounded-full" style={{ width:course?.progress  }}></div>
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