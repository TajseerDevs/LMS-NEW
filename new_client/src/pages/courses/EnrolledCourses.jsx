import React, { useState } from 'react'
import EnrolledCoursesCard from '../../components/EnrolledCoursesCard'
import { useSelector } from 'react-redux'
import { useGetAllCoursesCompletionPercentageQuery, useGetAllStudentCoursesQuery } from '../../store/apis/studentApis'



const EnrolledCourses = () => {

  const { token } = useSelector((state) => state.user)
  
  const [page , setPage] = useState(1)
  
  // const {data : enrolledCourses} = useGetAllStudentCoursesQuery({token}) // ! TODO make new api to match the card data view 
  const {data : enrolledCourses} = useGetAllCoursesCompletionPercentageQuery({token})

  const [search, setSearch] = useState("")
  const [selectedCourse , setSelectedCourse] = useState("")

  const courses = new Array(10).fill({
    title: "Introduction Basic Programming HTML & CSS",
    progress: 55,
    startDate: "December 11, 2024",
    endDate: "April 12, 2025",
  })
  
  console.log(enrolledCourses)

  return (

    <div className='w-full p-12'>

      <h1 className="text-3xl font-semibold text-[#002147] mb-8">Enrolled Courses</h1>

      <div className="flex gap-12 mb-16">

        <input
          type="text"
          placeholder="🔍 Search Courses"
          className="w-full text-[18px] max-w-[440px] p-3 border border-gray-300 rounded-lg"
        />

        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} name="sort" className="border px-3 w-[300px] py-2 rounded-lg">
                
          <option value="" selected disabled>Course Name</option>

          <option value="">course one</option>
          <option value="">course two</option>
          <option value="">course three</option>

        </select>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 w-full">
        {enrolledCourses?.courses?.map((course, index) => (
          <EnrolledCoursesCard key={index} course={course} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-20">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-5 py-2 rounded-lg font-medium ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          disabled={page === 1}
        >
          Previous
        </button>
            
        <span className="text-lg font-semibold">Page {page} of 1</span>

        <button className={`px-5 py-2 rounded-lg font-medium ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}>
          Next
        </button>

      </div>

    </div>

  )

}




export default EnrolledCourses