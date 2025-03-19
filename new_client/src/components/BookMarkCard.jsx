import React from 'react'
import courseCardImage from "../assets/course_card_image.png"
import { FaStar, FaAngleRight } from "react-icons/fa"
import { IoMdShareAlt } from "react-icons/io"
import { CiBookmark , CiCalendar } from "react-icons/ci";


const BookMarkCard = () => {

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
        
        <p className="text-primary-text-dark mb-3 flex items-center">
          <FaStar className="text-primary-normal text-[#FFC200] mr-1" />
          <span className='text-[#403685] font-semibold'> <span className='text-[#002147]'>4.5</span> (200 reviews)</span>
        </p>

        <div className="flex font-semibold items-center mb-2">
          <span className='text-[#403685] font-semibold text-lg'>80$</span>
        </div>

        <h1 className="font-bold mb-3 max-w-[250px] tracking-wide">Introduction Basic Programming HTML & CSS </h1>

        <div className="flex gap-5 p-1">

            <span className='flex text-[14px] text-[#979797] items-center gap-2'>
                <CiCalendar size={20}/>
                February 20th at 11:03 pm
            </span>

            <button className='flex text-[14px] items-center gap-1 text-[#403685] font-semibold'>
                Learn more
                <FaAngleRight/> 
            </button>

        </div>

      </div>

    </div>

    )
}


export default BookMarkCard