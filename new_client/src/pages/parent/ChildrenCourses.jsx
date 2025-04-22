import React, { useState } from 'react'
import ChildrenCourseCard from '../../components/ChildrenCourseCard'
import { FaSearch } from 'react-icons/fa'
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';



const ChildrenCourses = () => {

    const navigate = useNavigate()
    
    const [rangeValue , setRangeValue] = useState(20)

    const handleRangeChange = (e) => {
        setRangeValue(Number(e.target.value))
    }

    const courses = [
        {
          id: 1,
          title: "Biology Course",
          teacher: "Mrs. Mohammad",
          student: "Sarah Allen",
          enrollmentDate: "December 5,2024",
          progress: 60,
          status: "In Progress",
          deadline: "March 10,2025",
          totalMark: null,
          imageBg: "bg-[#fef6ed]",
        },
        {
          id: 2,
          title: "English Course",
          teacher: "Ms. Yasmin",
          student: "Yazan Allen",
          enrollmentDate: "November 5,2024",
          progress: 100,
          status: "Completed",
          deadline: null,
          totalMark: "70%",
          imageBg: "bg-[#f3f1fd]",
        },
        {
          id: 3,
          title: "Science Course",
          teacher: "Ms. Ali",
          student: "Yazan Allen",
          enrollmentDate: "February 5,2025",
          progress: 0,
          status: "Not Started",
          deadline: "March 13,2025",
          totalMark: null,
          imageBg: "bg-[#fef9e8]",
        },
        {
          id: 4,
          title: "English Course",
          teacher: "Ms. Yasmin",
          student: "Zein Allen",
          enrollmentDate: "November 5,2024",
          progress: 70,
          status: "In Progress",
          deadline: "No Assignment",
          totalMark: null,
          imageBg: "bg-[#f3f1fd]",
        },
    ]


  return (

    <div className="p-8">

        <h1 className="text-3xl md:text-3xl font-semibold text-[#002147] mb-6">
            My Children’s Courses
        </h1>

        <div className="flex flex-wrap w-[90%] gap-32 items-center mb-6">

            <div className="relative w-full md:w-60">
                
                <FaSearch className="absolute top-3 left-3 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search"
                    className="w-[300px] pl-10 pr-3 py-2 border rounded"
                />

            </div>

            <select className="border w-[240px] px-3 py-2 rounded">
                <option>Select Student</option>
            </select>

            <div className="flex items-center gap-2">
                <span className="text-md font-semibold text-gray-600">Course Progress</span>
                <input value={rangeValue} type="range" min="0" max="100" onChange={handleRangeChange} className="accent-[#FFC200]" />
            </div>

            <div className="flex gap-5">

                <select className="border w-[230px] px-3 py-2 rounded">
                    <option>Status</option>
                </select>

                <select className="border w-[230px] px-3 py-2 rounded">
                    <option>Upcoming Deadlines</option>
                </select>

            </div>

            <button className="text-md text-[#3b298a] font-medium hover:underline">
                Reset Filter
            </button>
            
        </div>
        
        <div className='flex flex-col gap-4'>
            <ChildrenCourseCard />
            <ChildrenCourseCard />
            <ChildrenCourseCard />
            <ChildrenCourseCard />
            <ChildrenCourseCard />
        </div>

        <div className="flex w-[90%] justify-end gap-2 mt-6">

            <button className="px-3 py-1 border rounded text-gray-400" disabled>
                <FaArrowLeft size={18} />
            </button>

            <button className="px-3 py-1 border rounded bg-[#3b298a] text-white">1</button>

            <button className="px-3 py-1 border rounded">2</button>

            <span className="px-2 py-1">...</span>

            <button className="px-3 py-1 border rounded">9</button>
            <button className="px-3 py-1 border rounded">10</button>

            <button className="px-3 py-1 border rounded">
                <FaArrowRight size={18} />
            </button>

        </div>

    </div>

  )

}


export default ChildrenCourses