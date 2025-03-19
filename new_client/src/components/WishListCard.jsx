import React from 'react'
import courseCardImage from "../assets/course_card_image.png"
import { FaStar, FaRegUser, FaRegFileAlt, FaClock, FaCircle , FaCartPlus , FaHeart , FaRegHeart } from "react-icons/fa"
import { IoMdShareAlt } from "react-icons/io"


const WishListCard = () => {

  return (

    <div className=" ">
      
      <div className='relative'>
        
        <img src={courseCardImage} alt="Course" className="w-full object-fill" />
        
        <div className='absolute z-50 top-4 right-4 flex items-center gap-4'>

            <span className='p-3 rounded-full' style={{background: "radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)"}}>
                <IoMdShareAlt size={24} className='text-white'/>
            </span>

            <span className='p-3 rounded-full filter' style={{background: "radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)"}}>
                <FaHeart size={24} className='text-[#FC5A5A]'/>
            </span>

        </div>
      
      </div>

      <div className="absolute z-1 top-2/4 left-1/2 -translate-x-1/2 p-3 bg-white w-[94%] text-primary-text-dark text-left rounded-3xl">
        
        <p className="text-primary-text-dark mb-3 flex items-center">
          <FaStar className="text-primary-normal mr-1" />
          4.5 (200 reviews)
        </p>

        <div className="flex font-semibold items-center mb-2">
            <span className='text-[#403685] font-semibold text-lg'>80$</span>
        </div>

        <h1 className="font-bold mb-3 max-w-[250px] tracking-wide">Introduction Basic Programming HTML & CSS </h1>

        <div className="flex flex-col p-1">

          <div className="flex gap-3 items-center mb-2">

            <span className="flex items-center">
              <FaClock className="mr-2 text-[#403685]" />
              Duration 10 hr
            </span>

          </div>

          <div className="flex items-center justify-end mt-2">
            <button className='flex bg-[#FFC200] rounded-lg px-4 font-semibold py-1 items-center capitalize gap-2'>
                <FaCartPlus className='text-[#002147]' size={18}/>
                add to cart
            </button>
          </div>

        </div>

      </div>

    </div>
    
    )
}


export default WishListCard