import React, { useState } from 'react'
import courseImg from "../../assets/hd-course-image.jpg"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGetAllInstructorCoursesNoPagingQuery, useGetAllInstructorCoursesQuery } from '../../store/apis/instructorApis'
import { FaAngleRight, FaStar } from "react-icons/fa";
import { format } from 'date-fns'
import { IoMdTime } from "react-icons/io";
import YellowBtn from '../../components/YellowBtn'



const Grades = () => {

  const baseUrl = `http://localhost:5500`

  const {token} = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [selectedCourse , setSelectedCourse] = useState("")
  const [page , setPage] = useState(1)

  const {data} = useGetAllInstructorCoursesQuery({token , page})
  const {data : instructorCourses} = useGetAllInstructorCoursesNoPagingQuery({token})

  console.log(data)

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }
  
  const handlePrev = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1)
    }
  }

  const handleNext = () => {
    if (data?.courses && page < data?.totalPages) {
      setPage(prevPage => prevPage + 1)
    }
  }


  return (
    <div className='w-[90%] p-10'>

      <h3 className='text-[#002147] font-semibold text-3xl'>Grade Courses</h3>

      <div className="flex items-center justify-between mt-8 mb-8 w-[75%]">

        <div className='flex items-center gap-8'>

            <input
                value={search}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search"
                className="border px-3 w-[300px] py-2 rounded-lg focus:outline-none"
            />

            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} name="sort" className="border px-3 w-[300px] py-2 rounded-lg">
                
                <option value="" selected disabled>Course Name</option>

                {instructorCourses?.map((course) => (
                    <option key={course?._id} value={course?._id}>{course?.title}</option>
                ))}

            </select>

        </div>

      </div>


      <div className="mt-12 bg-white shadow flex w-[1400px] flex-col gap-4 rounded-lg">
      
        {data?.courses?.map((course) => (

          <div key={course?._id} className="flex items-center p-6 border-b last:border-b-0">

            <div>
              <img src={`${baseUrl}${course?.coursePic}`} alt={course?.title} className="w-32 h-[90px] p-2 mr-6 rounded-md" />
            </div>

            <div className="ml-4 w-[300px]">
              <h2 className="text-2xl mb-1 text-[#35353A] font-semibold capitalize">{course?.title}</h2>
              <p className='flex items-center text-lg gap-1 mb-1 text-[#002147]'><span className='text-[#002147]'></span><FaStar size={22} className='text-[#FFC200]'/> {course?.rate} <span>({course?.ratings?.length})</span> </p>
              <span className="font-semibold ml-2 text-center flex items-center gap-2 text-[#6E6E71]"><IoMdTime size={23} className='text-[#6555BC]'/> Last Updated : {course?.updatedAt ? format(new Date(course?.updatedAt), 'MMMM dd, yyyy') : 'No due date'}</span>
            </div>

            <div className="text-center mr-20 ml-6 mb-6 w-28">
              <p className="text-gray-500 mb-1 text-sm">Enrolled Students</p>
              <p className="font-semibold text-lg mt-4 text-[#002147]">{course?.studentsEnrolled?.length}</p>
            </div>

            <div className="text-center mr-20 ml-6 mb-6 w-28">
              <p className="text-gray-500 mb-1 text-sm">Total Assigments</p>
              <p className="font-semibold text-lg mt-4 text-[#002147]">{course?.assignments?.length}</p>
            </div>

            <div className="text-center mr-20 ml-6 mb-6 w-28">
              <p className="text-gray-500 mb-1 text-sm">Total Quizzes</p>
              <p className="font-semibold text-lg mt-4 text-[#002147]">{course?.quizzes?.length}</p>
            </div>

            <div className='ml-12'>
              <YellowBtn onClick={() => navigate(`/instructor/course/enrolled-students-progress/${course?._id}`)}  text="View Grade" icon={FaAngleRight}/>
            </div>

          </div>

        ))}

      </div>

      <div className='mt-12 w-[70%] flex items-center gap-6 justify-end'>

        <YellowBtn text="Prev" disabled={page <= 1} onClick={handlePrev} />

        <span className="mx-4 text-lg font-semibold">page {page}</span>

        <YellowBtn text="Next" disabled={page >= data?.totalPages} onClick={handleNext} />

      </div>

    </div>
  )

}



export default Grades