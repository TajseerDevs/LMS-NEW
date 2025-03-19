import React, { useState } from 'react';
import { HiEye, HiChat } from 'react-icons/hi'
import ReactPaginate from 'react-paginate'
import enrolledStdSvg from "../../assets/enrolled-std.svg"
import activeLearnerSvg from "../../assets/active-learner.svg"
import avgCourseSvg from "../../assets/avgCourse.svg"
import studentImage from "../../assets/student-image.png"
import courseCoverImage from "../../assets/hd-course-image.jpg"
import { IoPerson } from "react-icons/io5";
import { PiExport } from "react-icons/pi";
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'


const data = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: "Student " + (i + 1),
  studentId: i % 2 === 0 ? "123456788" : "12345678",
  rank: Math.floor(Math.random() * 120) + 1,
  enrollmentDate: "16/2/2025",
  courseName: "Science in Liquid",
  courseId: 15,
  lastLogin: i % 3 === 0 ? "17/2/2025" : "No Login"
}))



const CourseEnrolledStudnets = () => {

    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 10
  
    const handlePageClick = ({ selected }) => {
      setCurrentPage(selected)
    }

    const displayData = data.slice(currentPage * itemsPerPage , (currentPage + 1) * itemsPerPage)


  return (
    <div className="p-6 bg-gray-50 min-h-screen">

        <div className="relative overflow-hidden h-[350px] mb-8 w-full rounded-lg">

            <img src={courseCoverImage} alt="" className="w-full h-full object-cover object-top" />

            <div className="absolute capitalize top-5 left-5 bg-white text-[#403685] font-semibold text-xl px-3 py-1 rounded-md">
                Course name here
            </div>

        </div>

      <div className="flex w-full items-center justify-between gap-10 mb-6">

        <div className="p-4 flex-1 h-[120px] bg-white rounded-lg shadow flex gap-8 justify-center items-center">

          <img src={enrolledStdSvg} className='bg-[#8B77FF70] p-4 rounded-full'/>

          <div className='flex flex-col gap-2 font-semibold items-center'>
            <h2 className="text-2xl text-[#403685] font-bold">120</h2>
            <p className="text-[#262050] text-lg">Total Students Enrolled</p>
          </div>

        </div>

        <div className="p-4 flex-1 h-[120px] bg-white rounded-lg shadow flex gap-8 justify-center items-center">

            <img src={activeLearnerSvg} className='bg-[#8B77FF70] p-4 rounded-full'/>

            <div className='flex flex-col gap-2 font-semibold items-center'>
                <h2 className="text-2xl text-[#403685] font-bold">95</h2>
                <p className="text-[#262050] text-lg">Active Learner</p>
            </div>

        </div>

        <div className="p-4 flex-1 h-[120px] bg-white rounded-lg shadow flex gap-8 justify-center items-center">

            <img src={activeLearnerSvg} className='bg-[#8B77FF70] p-4 rounded-full'/>

            <div className='flex flex-col gap-2 font-semibold items-center'>
                <h2 className="text-2xl text-[#403685] font-bold">35</h2>
                <p className="text-[#262050] text-lg">Inactive Learner</p>
            </div>

        </div>

        <div className="p-4 flex-1 h-[120px] bg-white rounded-lg shadow flex gap-8 justify-center items-center">

            <img src={avgCourseSvg} className='bg-[#8B77FF70] p-4 rounded-full'/>

            <div className='flex flex-col gap-2 font-semibold items-center'>
                <h2 className="text-2xl text-[#403685] font-bold">90%</h2>
                <p className="text-[#262050] text-lg">Average Course Completion Rate</p>
            </div>

        </div>

      </div>

      <h2 className='text-[#000] font-semibold text-3xl mb-4'>Enrolled students</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">

        <div className="flex gap-6 ml-4 space-x-4">

          <input type="text" placeholder="Search" className="border p-2 rounded-md w-[300px]" />

          <select className="border p-2 w-[250px] rounded-md">
            <option>Course name</option>
          </select>

          <select className="border p-2 w-[250px] rounded-md">
            <option>Enrollment Date</option>
          </select>

        </div>

        <button className="bg-[#FFC200] text-[#002147] font-semibold py-2 px-4 mr-6 rounded-md flex items-center gap-2">
            <PiExport size={22}/> Export Data
        </button>

      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="min-w-full font-semibold text-left">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Student Rank</th>
              <th className="p-4">Enrollment Date</th>
              <th className="p-4">Course Name</th>
              <th className="p-4">Course ID</th>
              <th className="p-4">Last Login</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          <tbody>

            {displayData.map((item) => (

              <tr key={item.id} className="border-b hover:bg-gray-50">

                <td className="p-4 flex items-center gap-4">
                    <img src={studentImage} className='rounded-full ' alt="" />
                    <span>{item.name}</span>
                </td>

                <td className="p-4">{item.studentId}</td>
                <td className="p-4">{item.rank}</td>
                <td className="p-4">{item.enrollmentDate}</td>
                <td className="p-4">{item.courseName}</td>
                <td className="p-4">{item.courseId}</td>
                <td className="p-4">{item.lastLogin}</td>

                <td className="p-4 flex space-x-4">
                  <button className="text-[#FFC200]"><IoPerson size={22} /></button>
                  <button className="text-[#FFC200]"><HiChat size={22} /></button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6 flex justify-end">

        <ReactPaginate
            previousLabel={<AiOutlineLeft size={22} className="text-[#002147] font-semibold" />}
            nextLabel={<AiOutlineRight size={22} className="text-[#002147] font-semibold" />}
            breakLabel={'...'}
            pageCount={Math.ceil(data.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination flex space-x-2'}
            pageClassName={'w-10 h-10 flex items-center justify-center border rounded-md text-gray-600 hover:text-yellow-500'}
            activeClassName={'border-yellow-500 text-yellow-500 font-bold'}
            previousClassName={'w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 text-gray-500'}
            nextClassName={'w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 text-gray-500'}
            breakClassName={'w-10 h-10 flex items-center justify-center text-gray-600'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
        />

       </div>

    </div>
    
    )

}


export default CourseEnrolledStudnets