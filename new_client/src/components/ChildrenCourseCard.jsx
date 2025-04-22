import React from 'react'
import cardImage from "../assets/child-course-layer.svg"
import { MdArrowForwardIos } from "react-icons/md"
import { useNavigate } from 'react-router-dom'



const ChildrenCourseCard = ({course}) => {

    const navigate = useNavigate()

  return (
    
    <div className="bg-[#FFFFFF] p-3 flex items-center gap-28 rounded-xl w-[90%] shadow mb-4">
        
        <div className="flex items-center gap-20">

            <img src={cardImage} className={`w-48 h-32 object-cover rounded-xl`} />

            <div className='flex flex-col gap-1'>

                <h2 className="text-2xl font-semibold text-[#002147]">Biology Course</h2>

                <p className="text-md flex items-center gap-4 mt-1 text-gray-600">
                 
                    <span className='text-[#000000]'>Mrs . Mohammad </span>
                    
                    <span className="text-md font-semibold text-[#002147] bg-[#99DB56] rounded rounded-r-xl rounded-l-xl px-3 py-0.5 inline-block">
                        Sarah Allen
                    </span>

                </p>

                <p className="text-md text-gray-500 mt-1">
                    Enrollment Date by :<span className="font-medium"> December 5,2024</span>
                </p>

            </div>

        </div>


        <div className="flex flex-col items-start justify-start gap-4">

            <div className="text-sm flex flex-col gap-2 items-start justify-start text-[#1f2c4c] font-semibold">
                <span className='text-2xl text-[#002147]'>Progress</span> 
                <span className="ml-2 font-semibold text-xl text-[#FFC200]">60%</span>
            </div>

            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#6555BC]" style={{ width: `60%` }}/>
            </div>
            
        </div>

        <div>
            <span className="text-md px-6 py-2 font-semibold rounded-full bg-[#FFE285] text-[#002147]">
                In Progress
            </span>
        </div>

        <div className="text-sm flex flex-col items-center">
            <span className='text-[#6E6E71] text-xl'>Upcoming Assignment & Deadline</span> 
            <br />
            <span className="text-xl font-semibold text-[#002147]">March 10,2025</span>
        </div>

        <button onClick={() => navigate(`/parent/children/course/222222`)} className="text-xl flex items-center gap-2 font-medium text-[#3b298a] hover:underline">
            View Course <MdArrowForwardIos/>
        </button>

    </div>

  )

}


export default ChildrenCourseCard