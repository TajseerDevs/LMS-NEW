import React, { useState } from 'react'
import studentImg from "../../assets/laith-img.png"
import YellowBtn from '../../components/YellowBtn';
import { MdFileDownload } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useGetStudentGradesQuery } from '../../store/apis/studentApis';
import { useSelector } from 'react-redux';



const StudentGrades = () => {

  const {token} = useSelector((state) => state.user)
  
  const [currentPage , setCurrentPage] = useState(1)
  const totalPages = 10

  const {data : studnetGrades , isLoading} = useGetStudentGradesQuery({token , page : currentPage})


  const grades = [
    {
      course: "Biology Course",
      type: "Quiz: Quiz Title",
      grade: "5/5",
      status: "Very Good",
      comment: "Keep Going!",
    },
    {
      course: "Math Course",
      type: "Assignment: Assignment Title",
      grade: "2.5/8",
      status: "Bad",
      comment: "Very bad !",
    },
    {
      course: "Math Course",
      type: "Assignment: Assignment Title",
      grade: "2.5/8",
      status: "Bad",
      comment: "Very bad !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
    {
      course: "Python",
      type: "Project: Project Title",
      grade: "4/8",
      status: "Good",
      comment: "Good !",
    },
  ]


  const statusColors = {
    "Very Good": "bg-[#09FF7C] text-[#006C33]",
    "Good": "bg-[#FFDE77] text-[#E0AB00]",
    "Bad": "bg-[#FFD7D7] text-[#990000]",
  }


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  


  return (

    <div className="px-12 py-8">

      <h2 className="text-[32px] text-[#002147] font-semibold px-4 mb-6">Student Grades</h2>

      <div className="flex max-w-xl mt-10 p-2 flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-6">
          
          <img
            src={studentImg}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          <div>
            <h2 className="text-2xl text-[#002147] font-semibold">Laith Abu Fadda</h2>
            <p className="text-[#002147]">ID-12458586</p>
          </div>

        </div>

        <div className="text-center md:text-left">
          <p className="text-2xl text-[#002147] font-medium">GPA</p>
          <p className="text-2xl font-semibold text-[#FFC200]">90%</p>
        </div>


      </div>


      <div className="flex p-2 justify-between max-w-[90%] flex-col md:flex-row gap-8 mt-8">

        <input placeholder="🔍  Search" className="w-full p-3 rounded-lg md:w-[380px]" />
        
        <select className="w-full p-3 rounded-lg md:w-[380px]">
          <option>Course Name</option>
        </select>
          
        <select className="w-full p-3 rounded-lg md:w-[380px]">
          <option>Sort Grade</option>
        </select>
        
        <select className="w-full p-3 rounded-lg md:w-[380px]">
          <option>Assessment Type</option>
        </select>

        <YellowBtn icon={MdFileDownload} text="Download Grade Report"  />
 
      </div>

      <div className="overflow-x-auto mt-12">

        <table className="w-full bg-white shadow-md rounded-lg">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Course Name</th>
              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Assessment Type</th>
              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Grades</th>
              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Status</th>
              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Instructor Comments</th>
              <th className="p-4 text-xl text-[#101018] font-semibold text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {grades.map((grade, index) => (

              <tr key={index} className="border-t">

                <td className="p-4 text-[#35353A] font-semibold">{grade.course}</td>
                <td className="p-4 text-[#35353A] font-semibold">{grade.type}</td>
                <td className="p-4 text-[#35353A] font-semibold">{grade.grade}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full font-semibold ${statusColors[grade.status]}`}>
                    {grade.status}
                  </span>
                </td>

                <td className="p-4 text-[#35353A] font-semibold">{grade.comment}</td>

                <td className="p-4 flex items-center justify-start">
                  <FaEye size={20} className="cursor-pointer text-[#35353A] font-semibold ml-4" />
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-12 gap-5 flex justify-end items-center">
        
        <YellowBtn text="Previous" onClick={handlePrevPage} disabled={currentPage === 1} />

        <span className="text-gray-700 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        
        <YellowBtn text="Next" onClick={handleNextPage} disabled={currentPage === totalPages} />

      </div>

    </div>

  )

}



export default StudentGrades