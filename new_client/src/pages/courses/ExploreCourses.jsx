import React, { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard"
import courses from "../../data/courses"
import { useSelector } from "react-redux";
import { useGetAllCoursesQuery, useGetCoursesLearningCategoriesQuery, useGetNotEnrolledCoursesQuery, useSearchCoursesByTitleQuery } from "../../store/apis/courseApis";
import { FaFilter , FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom";



const ExploreCourses = () => {
  
  const {token} = useSelector((state) => state.user)
  const {data : learningCategories} = useGetCoursesLearningCategoriesQuery({token})
  
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  const {data , isLoading} = useSearchCoursesByTitleQuery({token , title : searchQuery , page : currentPage} , {skip : searchQuery === ""})
  const {data : allCourses , refetch : refetchStudentNotEnrolledCourses } = useGetNotEnrolledCoursesQuery({token , page : currentPage})
  
  // const {data : allCourses} = useGetAllCoursesQuery({token , page : currentPage}) // replace it with the not enrolled courses api call
  
  const [selectedFilter, setSelectedFilter] = useState("Trending")
  const [dropDownValue, setDropDownValue] = useState("Sort by - Popular Class")
  
  
  useEffect(() => {
    if(searchQuery === ""){
      console.log("call")
      setCurrentPage(1)
      refetchStudentNotEnrolledCourses()
    }
  } , [searchQuery])


  const handleNext = () => {
    const totalPages = data?.courses?.length > 0 ? data.totalPages : allCourses?.totalPages;
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleDropDownChange = (e) => {
    setDropDownValue(e.target.value)
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  
  console.log(data?.courses)

  
  return (

    <div className="px-12 py-8">

      <h2 className="text-[30px] text-[#002147] font-semibold px-4 mb-6">Explore Courses</h2>

      <div className="flex justify-between px-4 items-center mb-10">

        <div className="relative w-[300px]">

          <input
            value={searchQuery}
            onChange={handleInputChange}
            type="text"
            placeholder="Search Courses"
            className="border border-gray-300 w-full px-4 py-2 pl-10 rounded-lg"
          />

          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

        </div>

        <div className="flex text-[20px] items-center w-1/2 space-x-14">

          {learningCategories?.map((filter , index) => (
            <button key={index} onClick={() => handleFilterChange(filter)} className={`px-4 py-2 font-semibold rounded-lg ${selectedFilter === filter ? "bg-yellow-400 text-white" : "text-gray-600"}`}>
              {filter}
            </button>
          )).reverse()}

        </div>

        <div className="flex items-center gap-5">

          <FaFilter size={22} />

          <select onChange={handleDropDownChange} value={dropDownValue} className="border border-gray-300 px-3 py-2 rounded-lg">

            <option value="Sort by - Popular Class">Sort by - Popular Class</option>
            <option value="Level">Course Level - Beginner-intermediate-Advanced</option>
            <option value="Duration">Student level - k-12-University-Trainee</option>
            <option value="Price">Price - Paid-Free</option>

          </select>

        </div>

      </div>

      <div className="grid mt-[120px] grid-cols-5 gap-5 mb-14">

        {searchQuery !== "" ? (
          isLoading ? (
            <div className="text-center text-gray-500 text-lg mt-4">Loading search results...</div>
          ) : data?.courses?.length > 0 ? (
            data?.courses?.map((course) => (
              <CourseCard navigate={navigate} key={course.id} data={course} />
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg mt-4">No courses found for "{searchQuery}"</div>
          )
        ) : (
          allCourses?.courses?.length > 0 ? (
            allCourses?.courses?.map((course) => (
              <CourseCard navigate={navigate} key={course.id} data={course} />
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg mt-4">No available courses.</div>
          )
        )}

      </div>

      <div className="flex justify-center items-center mt-8">

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-6 py-3 mx-4 rounded-lg font-medium ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <span className="px-6 py-3 font-medium text-lg">
          Page {currentPage} of{" "}
          {data?.courses?.length > 0 ? data.totalPages : allCourses?.totalPages === 0 ? 1 : allCourses?.totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === (data?.courses?.length > 0 ? data.totalPages : allCourses?.totalPages)}
          className={`px-6 py-3 mx-4 rounded-lg font-medium ${
            currentPage ===
            (data?.courses?.length > 0
              ? data.totalPages
              : allCourses?.totalPages)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

    </div>

  )

}

export default ExploreCourses
