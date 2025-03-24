import React, { useState } from 'react'
import studentImg from "../../assets/laith-img.png"
import YellowBtn from '../../components/YellowBtn'
import { MdFileDownload } from "react-icons/md"
import { FaEye } from "react-icons/fa"
import { useGenerateStudentGradesExcelMutation, useGetAllStudentCoursesNoPagingQuery, useGetStudentGradesQuery } from '../../store/apis/studentApis'
import { useSelector } from 'react-redux'
import { FaFilter } from "react-icons/fa"
import { axiosObj } from '../../utils/axios'


const StudentGrades = () => {

  const {token , user} = useSelector((state) => state.user)
  
  const [currentPage , setCurrentPage] = useState(1)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [assessmentType , setAssessmentType] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  const {data : studnetGrades , isLoading} = useGetStudentGradesQuery({token , page : currentPage})
  const {data : studnetCourses} = useGetAllStudentCoursesNoPagingQuery({token})
  const [generateStudentGradesExcel] = useGenerateStudentGradesExcelMutation()


  const statusColors = {
    "Very Good": "bg-[#09FF7C] text-[#006C33]",
    "Good": "bg-[#FFDE77] text-[#E0AB00]",
    "Bad": "bg-[#FFD7D7] text-[#990000]",
  }


  const statusPriority = {
    "Very Good": 1,
    "Good": 2,
    "Bad": 3,
  }


  const handleNextPage = () => {
    if (currentPage < studnetGrades?.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }



  const resetFilters = () => {
    setSelectedCourse("")
    setAssessmentType("")
    setSearchTerm("")
    setSortOrder("")
    setCurrentPage(1)
  }


  const filteredGrades = (studnetGrades?.results || [])?.filter(
    (grade) =>
      (selectedCourse === "" || grade?.courseId === selectedCourse) &&
      (assessmentType === "" || grade?.assessmentType === assessmentType) &&
      (searchTerm === "" || grade?.course?.toLowerCase().includes(searchTerm.toLowerCase()))
  )



  const sortedGrades = [...(filteredGrades || [])]?.sort((a, b) => {

    if (!sortOrder) return 0
  
    const priorityA = statusPriority[a?.status] || 4
    const priorityB = statusPriority[b?.status] || 4
  
    return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA

  })



  const handleDownloadReport = async () => {

    try {

      const response = await axiosObj.get("/student/grades-excel-sheet-report", {
        headers : {
          "Authorization" : `Bearer ${token}`
        },  
        responseType: "blob",
      })
  
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${user?.firstName + " " + user?.lastName}_Grades.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error("Error downloading the file:", error)
    }

  }




  if(isLoading){
    return <h1 className='p-10'>Loading</h1>
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
            <p className="text-[#002147]">ID-{user?._id.slice(0 , 10)}</p>
          </div>

        </div>

        <div className="text-center md:text-left">
          <p className="text-2xl text-[#002147] font-medium">GPA</p>
          <p className="text-2xl font-semibold text-[#FFC200]">{studnetGrades?.gpa}</p>
        </div>

      </div>


      <div className="flex p-2 justify-between max-w-[100%] flex-col md:flex-row gap-6 mt-8">

        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="🔍  Search" className="w-full p-3 rounded-lg md:w-[380px]" />
        
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full p-3 rounded-lg md:w-[380px]">
          <option value="" selected disabled>Course Name</option>
          {studnetCourses?.studentCourses?.map((course) => (
            <option key={course?._id} value={course?._id}>
              {course.title}
            </option>
          ))}
        </select>
          
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full p-3 rounded-lg md:w-[380px]">
          <option selected disabled value="">Sort Grade</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        
        <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} className="w-full p-3 rounded-lg md:w-[380px]">
          <option value="" selected disabled>Assessment Type</option>
          <option value="Quiz">Quiz</option>
          <option value="Assignment">Assignment</option>
        </select>

        <YellowBtn onClick={handleDownloadReport} icon={MdFileDownload} text="Download Grade Report"  />

        <FaFilter size={30} className='text-[#403685] mt-2 cursor-pointer' onClick={resetFilters} />
 
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

          {sortedGrades?.length > 0 ? (

            sortedGrades?.map((grade, index) => (

              <tr key={index} className="border-t">

                <td className="p-4 text-[#35353A] capitalize font-semibold">{grade.course}</td>
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

            ))

          ) : (

            <tr>

              <td colSpan="6" className="p-4 text-center text-gray-500 font-semibold">
                No results found.
              </td>

            </tr>
          
          )}

          </tbody>

        </table>

      </div>

      <div className="mt-12 gap-5 flex justify-end items-center">
        
        <YellowBtn text="Previous" onClick={handlePrevPage} disabled={currentPage === 1} />

        <span className="text-gray-700 text-lg font-semibold">
          Page {currentPage} of {studnetGrades?.totalPages}
        </span>
        
        <YellowBtn text="Next" onClick={handleNextPage} disabled={currentPage === studnetGrades?.totalPages} />

      </div>

    </div>

  )

}



export default StudentGrades