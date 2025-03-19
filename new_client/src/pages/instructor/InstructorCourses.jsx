import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useLocation , useNavigate } from 'react-router-dom'
import InstructorCourseCard from '../../components/InstructorCourseCard'
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa'
import { useGetAllInstructorCoursesQuery } from '../../store/apis/instructorApis'


const InstructorCourses = () => {

  const { token } = useSelector((state) => state.user)
    
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
    
  const [page , setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [dropDownValue, setDropDownValue] = useState("")
  const [filteredCourses, setFilteredCourses] = useState([])

  const { data: allCourses } = useGetAllInstructorCoursesQuery({ token, page })

  
  useEffect(() => {
    if (dropDownValue) {
      setFilteredCourses(allCourses?.courses?.filter(course => course?.status === dropDownValue) || []);
    } else {
      setFilteredCourses(allCourses?.courses)
    }
  }, [dropDownValue, allCourses]);
  

  const handleNext = () => page < allCourses?.totalPages && setPage(page + 1)
  const handlePrev = () => page > 1 && setPage(page - 1)

  console.log(allCourses?.courses)

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDropDownChange = (e) => {
    setDropDownValue(e.target.value)
  }




  return (

    <div className="min-h-screen p-12">

      <h1 className="text-3xl font-semibold text-[#002147] mb-6">My Courses</h1>

      <div className='mb-16 mt-2 flex items-center justify-between'>

        <div className="relative w-[400px]">
          
          <input
            value={searchQuery}
            onChange={handleInputChange}
            type="text"
            placeholder="Search Courses"
            className="border border-gray-300 w-full px-4 py-2 pl-10 rounded-lg"
          />
          
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          
        </div>

        <div className="flex items-center gap-5 mr-12">
        
          <FaFilter onClick={() => setDropDownValue("")} className='cursor-pointer' size={22} />
        
            <select onChange={handleDropDownChange} value={dropDownValue} className="border border-gray-300 px-1 w-[200px] py-2 rounded-lg">
        
              <option value="" disabled hidden>Sort by - Status</option>
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">pending</option>
              <option value="rejected">Rejected</option>
        
            </select>
        
            <button onClick={() => navigate("/instructor/create-course")} className='flex items-center gap-2 text-[#403685] font-semibold py-2 px-5 bg-[#FFC200] rounded-lg capitalize cursor-pointer'>
              create course
              <FaPlus/>
            </button>  

        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

        {filteredCourses && filteredCourses?.map((course) => (
          <InstructorCourseCard key={course?._id} course={course} />
        ))}

      </div>

      <div className="mt-24 flex items-center justify-center gap-4">

        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg font-medium ${
            page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#FFC200] text-[#403685]"
          }`}
        >
          Previous
        </button>

        <span className="text-lg font-semibold">Page {page} of {allCourses?.totalPages}</span>

        <button
          onClick={handleNext}
          disabled={page === allCourses?.totalPages}
          className={`px-6 py-2 rounded-lg font-medium ${
            page === allCourses?.totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#FFC200] text-[#403685]"
          }`}
        >
          Next
        </button>

      </div>

    </div>

  )

}



export default InstructorCourses

// replace each 10 number with totalPages from the api call 