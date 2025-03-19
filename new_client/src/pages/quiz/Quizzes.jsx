  import React, { useEffect, useState } from 'react'
import quizSvg from "../../assets/empty-quiz-svg.svg"
import { IoAddOutline } from 'react-icons/io5'
import { useGetInstructorQuizzesQuery } from '../../store/apis/quizApis'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiShare2 } from "react-icons/fi";
import { useGetAllInstructorCoursesNoPagingQuery } from '../../store/apis/instructorApis'
import { format } from 'date-fns'
import YellowBtn from '../../components/YellowBtn'



const Quizzes = () => {

  const baseUrl = "http://localhost:5500"
  const navigate = useNavigate()

  const {token} = useSelector((state) => state.user)
  const [page , setPage] = useState(1)

  const {data : instructorCourses} = useGetAllInstructorCoursesNoPagingQuery({token})
  const {data} = useGetInstructorQuizzesQuery({token , page})
  

  const [courseId, setCourseId] = useState("")
  const [searchQuery , setSearchQuery] = useState("")
  const [selectedDate , setSelectedDate] = useState("")
  const [filteredQuizzes, setFilteredQuizzes] = useState(data?.quizzes || [])

  const handlePrev = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1)
    }
  }

  const handleNext = () => {
    if (data && page < data.totalPages) {
      setPage(prevPage => prevPage + 1)
    }
  }


  const filterQuizzes = () => {

    let filteredData = data?.quizzes || []

    if (searchQuery) {
      filteredData = filteredData.filter(quiz => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (courseId) {
      filteredData = filteredData.filter(quiz => quiz?.courseId?._id === courseId)
    }

    if (selectedDate) {

      filteredData = filteredData.filter(quiz => {
        const quizDate = format(new Date(quiz?.createdAt), 'yyyy-MM-dd')
        return quizDate === selectedDate
      })

    }

    setFilteredQuizzes(filteredData)

  }


  useEffect(() => {
    filterQuizzes()
  }, [searchQuery, courseId, selectedDate, data])



  return (
    <div className='p-6'>

      <div className='flex mb-5 w-[60%] justify-between items-center'>
              
        <h1 className='text-4xl capitalize font-semibold text-[#002147]'>Quizzes</h1>
            
      </div>

      {/* add case to not show these statment until instructor has no courses */}
      {
        data?.quizzes.length === 0 && (

          <div className='p-6 flex flex-col justify-center items-center mt-[10vw]'>

            <img src={quizSvg} alt="" className='object-contain mb-2' />
          
            <span className='text-[#002147] text-3xl font-semibold capitalize'>Start Creating Your Quiz!</span>
            <span className='text-[#797979] text-center p-2 text-lg mt-2'>Use interactive quizzes to engage, assess <br /> knowledge, and boost engagement.</span>
          
            <button onClick={() => navigate(`/instructor/create-quiz`)}  className='flex bg-[#ECEBFE] text-[#403685] font-semibold px-5 py-1 mt-4 rounded-lg items-center gap-2 transition-all duration-300 hover:scale-90 cursor-pointer'>
              <IoAddOutline className='text-[#403685] font-semibold'/>
              Add Quiz
            </button>
          
          </div>

        )
      }

      {

        data?.quizzes?.length > 0 && (

          <div className='w-[60%] mt-12'>

            <div className="flex items-center justify-between gap-4 mt-4">

              <div className='flex items-center w-[80%] gap-8'>

                <input
                  value={searchQuery}
                  name='searchQuery'
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search"
                  className="border p-2 rounded-md w-[30%] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className='border p-2 rounded-md w-[30%]' name="courseId">
                        
                  <option value="" disabled selected>Course Name</option>
                    
                  {instructorCourses?.map((course) => (
                    <option key={course?._id} value={course?._id}>{course?.title}</option>
                  ))}
                    
                </select>

                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded-md w-[30%]">

                  <option value="" disabled selected>Quiz Date</option>

                  {data && data?.quizzes?.map((quiz) => {

                    const formattedDate = format(new Date(quiz?.createdAt), 'yyyy-MM-dd')

                    return (
                      <option key={quiz?._id} value={formattedDate}>
                        {formattedDate}
                      </option>
                    )

                  })}

                </select>

              </div>

              <YellowBtn text="Create Quiz" icon={FiPlus} onClick={() => navigate("/instructor/create-quiz")} />

            </div>

            <div className="mt-6 bg-white shadow rounded-lg">
                  
              {data?.quizzes?.map((quiz) => (

                <div key={quiz.id} className="flex items-center p-6 border-b last:border-b-0">

                  <img src={`${baseUrl}${quiz?.courseId?.coursePic}`} alt={quiz.title} className="w-20 mr-6 h-16 rounded-md" />

                  <div className="ml-4 flex-grow w-[300px]">
                    <h2 className="text-lg mb-1 text-[#35353A] font-semibold">{quiz.title}</h2>
                    <span className='mt-1 text-[#6E6E71]'>{quiz.dueDate ? format(new Date(quiz.dueDate), 'MMMM dd, yyyy hh:mm a') : 'No due date'}</span>
                  </div>

                  <div className="text-center mr-20 w-24">
                    <p className="text-gray-500 mb-1 text-sm">Course</p>
                    <p className="font-semibold text-[#002147]">{quiz?.courseId?.title}</p>
                  </div>

                  <div className="text-center mr-20 w-24">
                    <p className="text-gray-500 mb-1 text-sm">Questions</p>
                    <p className="font-semibold text-[#002147]">{quiz?.questions?.length}</p>
                  </div>

                  <div className="text-center mr-20 w-44">
                    <p className="text-gray-500 mb-1 text-sm">Student Number Submitted</p>
                    <p className="font-semibold ml-2 text-center text-gray-800">{quiz?.submittedBy?.length}</p>
                  </div>

                  <div className="text-center mr-20 w-32">
                    <p className="text-gray-500 mb-1 text-sm">Time To Complete</p>
                    <p className="font-semibold ml-2 text-left text-[#002147]">
                    {
                      quiz?.duration?.value === undefined
                        ? "Default Duration"
                        : quiz?.duration?.unit === "minutes" && quiz?.duration?.value >= 60
                        ? `${Math.floor(quiz.duration.value / 60)} hours`
                        : `${quiz?.duration?.value} ${quiz?.duration?.unit}`
                    }
                    </p>
                  </div>

                  <div className="flex gap-5 mr-2 ml-4">

                    <button className="text-gray-600 hover:text-gray-800">
                      <FiEdit2 size={20} />
                    </button>

                    <button className="text-gray-600 hover:text-gray-800">
                      <FiTrash2 size={20} />
                    </button>
                    
                  </div>

                </div>

              ))}

            </div>

            <div className='mt-12 flex items-center gap-6 justify-center'>

              <YellowBtn text="Prev" disabled={page <= 1} onClick={handlePrev} />

              <span className="mx-4 text-lg font-semibold">{page}</span>

              <YellowBtn text="Next" disabled={page >= data?.totalPages} onClick={handleNext} />

            </div>

          </div>

        )

      }

    </div>

  )

}



export default Quizzes