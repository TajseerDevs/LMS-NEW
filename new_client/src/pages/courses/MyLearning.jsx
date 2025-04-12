import React, { useState } from 'react'
import { HiChevronLeft, HiChevronRight, HiSearch } from "react-icons/hi";
import courseImage from "../../assets/course_test_image.png"
import testImg from "../../assets/test.png"
import assigmentSvg from "../../assets/assigment-svg.svg"
import { IoBook } from "react-icons/io5"
import { FaPlayCircle } from "react-icons/fa"
import { CiEdit } from "react-icons/ci"
import { FaRegClock } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import NewTicketModal from '../../components/NewTicketModal';
import { useAddNewTicketMutation, useGetAllUserTicketsQuery } from '../../store/apis/TicketApis';
import { useSelector } from 'react-redux';
import { useGetAllCoursesCompletionPercentagePagingQuery, useGetAllCoursesCompletionPercentageQuery } from '../../store/apis/studentApis'
import YellowBtn from '../../components/YellowBtn';
import PurpleBtn from '../../components/PurpleBtn';
import { FaAngleRight } from "react-icons/fa6";
import formatDate from '../../utils/formatDate';
import contentSvg from "../../assets/content-svg.svg"
import techSvg from "../../assets/tech-svg.svg"
  


const MyLearning = () => {

  const baseUrl = `http://10.10.30.40:5500`

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.user)

  const [selectedFilter , setSelectedFilter] = useState("All Courses")
  const [openNewTicketModal , setOpenNewTicketModal] = useState(false)
  const [page , setPage] = useState(1)

  const filterMapping = {
    "All Courses": "all",
    "On Going": "ongoing",
    "Up Coming": "upcoming",
    "Completed": "completed",
  }

  const {data : coursesCompletion , isLoading} = useGetAllCoursesCompletionPercentageQuery({token , status : filterMapping[selectedFilter]})
  const {data : coursesCompletionCards , isLoading : isLoadingCompletionCards} = useGetAllCoursesCompletionPercentagePagingQuery({token , page})
  const {data : studentTickets , refetch} = useGetAllUserTicketsQuery({token})
  
  console.log(studentTickets)


  const tickets = [
    {
      id: 1,
      icon: "🛠️",
      title: "Technical Support Title",
      status: "In Progress",
      time: "3h ago",
      description: "Life season open have. Air have of light fill after .....",
      priority: "urgent",
      priorityColor: "bg-red-200 text-red-700",
    },
    {
      id: 2,
      icon: "📄",
      title: "Content Support Title",
      status: "In Progress",
      time: "3h ago",
      description: "Life season open have. Air have of light fill after .....",
      priority: "Medium",
      priorityColor: "bg-blue-200 text-blue-700",
    },
    {
      id: 3,
      icon: "📄",
      title: "Content Support Title",
      status: "Pending",
      time: "3h ago",
      description: "Life season open have. Air have of light fill after .....",
      priority: "Low",
      priorityColor: "bg-green-200 text-green-700",
    },
  ]


  const handleNextPage = () => {
    if (page < coursesCompletionCards?.totalPages) {
      setPage(prev => prev + 1);
    }
  }
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }
  

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-[#FFD7D7] text-[#990000]";
      case "medium":
        return "bg-[#60E7FF] text-[#005E8E]";
      case "low":
        return "bg-[#D7FFE6] text-[#009912]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  

  console.log(studentTickets)



  return (

    <>

      <div className="space-y-8 p-8">

        {/* First row */}
        <div className="flex justify-between items-start w-full gap-4">

            <div className="flex-grow bg-gray-50 p-6 mb-1 rounded-lg relative">

              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Continue Watching</h2>
        
              <div className="absolute top-5 right-[100px] flex gap-5 p-2">

                <button onClick={handlePrevPage} disabled={page === 1} className="bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow hover:bg-gray-200">
                  <HiChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
        
                <button onClick={handleNextPage} disabled={page === coursesCompletionCards?.totalPages} className="bg-gray-100 p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow hover:bg-gray-200">
                  <HiChevronRight className="w-5 h-5 text-gray-700" />
                </button>

              </div>
        
              <div className="relative">

                {isLoadingCompletionCards ? (

                  <p className="text-center text-xl font-semibold text-gray-500">Loading courses...</p>

                ) : coursesCompletionCards?.courses?.length === 0 ? (
                  <p className="text-center text-xl font-semibold text-gray-500">No courses found</p>
                ) : (

                  <div className="flex gap-8 max-w-[1600px]">

                    {coursesCompletionCards?.courses?.map((course) => (

                      <div
                        onClick={() => navigate(`/course/main-page/${course?.courseId}`)}
                        key={course?.courseId}
                        className={`min-w-[260px] cursor-pointer bg-white shadow-md rounded-lg p-3`}
                      >

                        <img
                          src={`${baseUrl}${course?.course?.coursePic}`}
                          alt={course?.course?.title}
                          className="rounded-md w-[100%] h-32 object-cover"
                        />

                        <h3 className="text-sm text-[#000000] mr-2 capitalize font-semibold mt-2">{course?.course?.title}</h3>
                        <p className="text-xs mt-2 text-[#979797]"> Chapter 3 - part 4 </p>

                        <div className="flex items-center gap-2 mt-2">

                          <img
                            src={course?.course?.instructorId?.userObjRef?.profilePic ? `${baseUrl}${course?.course?.instructorId?.userObjRef?.profilePic}` : testImg}
                            alt={course?.course?.instructorId?.userObjRef?.firstName}
                            className="w-6 h-6 rounded-full"
                          />

                          <p className="text-xs font-semibold text-[#000000]">
                            {course?.course?.instructorId?.userObjRef?.firstName} {course?.course?.instructorId?.userObjRef?.lastName}
                            <span className="text-[#979797] font-semibold ml-2">mentor</span>
                          </p>

                          <span className='ml-auto'>
                            <FaAngleRight/>
                          </span>

                        </div>

                        <div className="relative w-full h-2 bg-gray-200 rounded-full mt-3">
                          <div className="absolute h-full bg-purple-600 rounded-full" style={{ width: `${course.progress}` }}></div>
                        </div>

                        <p className="text-md font-semibold text-right text-gray-600 mt-1">{course.progress}</p>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>
        
            <div className="w-[450px] bg-white mr-16 mt-10 shadow-md rounded-lg p-6">

              <h3 className="text-2xl font-semibold text-[#002147] mb-6">Upcoming Announcement</h3>

              <div className="space-y-4">

                {[...Array(3)].map((_, i) => (

                  <div key={i} className="shadow-md p-2 pb-4 flex items-center gap-3">

                    <img src={assigmentSvg} alt="" />

                    <div>
                      <p className="text-sm font-medium text-gray-700">Task | Title of the task</p>
                      <p className="text-xs text-gray-500">Deadline: Jan 30, 2025 | 4:30 PM</p>
                    </div>

                    <div className="ml-auto">
                      <HiChevronRight size={24} />
                    </div>

                  </div>

                ))}

              </div>
        
              <div className="mt-6 flex justify-center">
                <button className="text-sm bg-[#FFC200] p-2 px-4 rounded-md text-[#002147] transition-all duration-300 hover:scale-90">
                  See All Upcoming Announcement
                </button>

              </div>

            </div>

          </div>
        
          {/* Second row */}
          <div className="flex justify-between items-start w-full gap-4">

            <div className="flex-grow bg-gray-50 p-6 mb-1 rounded-lg relative">
              
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">My Courses</h2>
              
              <div className="flex justify-between w-[100%] items-center gap-6">

                  <div className="relative">

                      <input type="text" placeholder="Search Courses" className="p-3 w-[300px] pl-10"/>

                      <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />

                  </div>

                  <div className="flex gap-10 ml-14">

                      {['All Courses' , 'On Going' , 'Up Coming' , 'Completed'].map((filter , index) => (

                      <button key={index} className={`text-[22px] ${selectedFilter === filter ? 'text-[#FFC200] border-b-2 border-[#FFC200]' : 'text-gray-600'} focus:outline-none`} onClick={() => setSelectedFilter(filter)} >
                        {filter}
                      </button>

                      ))}

                  </div>

                  <div className='mr-16'>
                    <PurpleBtn onClick={() => navigate("/enrolled-courses")} text="Show All Courses" />
                  </div>
 
              </div>

              <div className='flex mt-6 flex-col p-4 justify-start gap-5 space-y-4'>

              {isLoading ? (
                 
                <div className="flex text-xl justify-center items-center w-full">
                  <span>Loading courses...</span> 
                </div>

              ) : (
                <>
                  {coursesCompletion?.courses?.length === 0 ? (

                    <div className="flex capitalize text-xl justify-center items-center w-full">
                      <span>No courses available.</span>
                    </div>

                  ) : (
                    coursesCompletion?.courses?.slice(0 , 4).map((course) => (

                      <div key={course?.course?._id} className="flex max-w-[1550px] bg-white p-2 items-center gap-10 space-x-28">

                        <img className="w-36 h-20" src={`${baseUrl}${course?.course?.coursePic}`} alt="" />

                        <div className="flex flex-col items-start gap-3">

                          <span className="capitalize text-lg text-[#002147] font-semibold">{course?.course?.title}</span>

                          <div className="flex items-center gap-3">

                            <img
                              className="rounded-2xl h-6 w-6"
                              src={course?.course?.instructorId?.userObjRef?.profilePic ? `${baseUrl}${course.course.instructorId.userObjRef.profilePic}` : testImg}
                              alt=""
                            />

                            <span className="text-[#AFAFAF] font-semibold">
                              {course?.course?.instructorId?.userObjRef?.firstName} {course?.course?.instructorId?.userObjRef?.lastName}
                            </span>

                          </div>

                        </div>

                        <div className="flex items-center flex-col gap-3">
                          <span className="text-[#AFAFAF] font-semibold">Duration</span>
                          <span className="text-[#002147] font-semibold">{course?.course?.duration} h</span>
                        </div>

                        <div className="flex flex-col items-center gap-5 mr-5">

                          <span className="text-[#AFAFAF] font-semibold">Progress</span>

                          <div className="relative w-[150px] h-2 bg-gray-200 rounded-full">
                            <span className="absolute h-full bg-[#6555BC] rounded-full" style={{ width: course?.progress }}></span>
                            <span className="absolute -right-10 -top-2 text-md text-[#002147] font-semibold">{course?.progress}</span>
                          </div>

                        </div>

                        <div className="flex items-center justify-center gap-8">

                          <div className="flex gap-2 items-center">
                            <IoBook className="text-[#AFAFAF]" size={22} />
                            <span className="text-[18px] mb-1 text-[#000000] font-semibold">{course?.course?.quizzes?.length}</span>
                          </div>

                          <div className="flex gap-2 items-center">
                            <FaPlayCircle className="text-[#AFAFAF]" size={22} />
                            <span className="text-[20px] mb-1 text-[#000000] font-semibold">{course?.course?.sections?.length}</span>
                          </div>

                        </div>

                        <div>
                          {course?.progress === "0%" && <YellowBtn icon={HiChevronRight} text="Start" />}
                          {course?.progress > "0%" && course?.progress < "100%" && <YellowBtn icon={HiChevronRight} text="Continue" />}
                          {course?.progress === "100%" && <YellowBtn onClick={() => navigate("/certificate")} icon={HiChevronRight} text="Get Certificate" />}
                        </div>

                      </div>

                    ))

                  )}

                </>
                
              )}
                
              </div>
            
            </div>
        
            <div className="w-[450px] bg-white mr-16 mt-10 shadow-md rounded-lg p-6">

              <div className='flex mb-4 items-center justify-between'>
                  
                <h3 onClick={() => navigate("/student-tickets")} className="text-2xl cursor-pointer font-semibold text-[#002147]">Need Help ?</h3>
                  
                <button onClick={() => setOpenNewTicketModal(true)} className='flex items-center gap-2'>
                  <CiEdit className='text-[#403685]' size={22}/>
                  <span className='text-[#403685] font-semibold'>New Ticket</span>
                </button>

              </div>

              <div className="space-y-4 p-5 bg-white">

                {studentTickets?.userTickets?.slice(0 , 3)?.map((ticket) => (

                  <div key={ticket?._id} className="bg-gray-100 p-4 rounded-lg shadow flex items-start gap-5">

                    <div className={`w-10  h-10 flex items-center justify-center rounded-lg ${ticket?.regarding === "technical" ? "bg-[#C4C1D9]" : "bg-[#FFF0BF]"}`}>

                      <img
                        src={ticket?.regarding === "content" ? contentSvg : techSvg}
                        alt={ticket?.regarding}
                        className="w-8 h-8"
                      />

                    </div>

                      <div className="flex-1">

                        <div className="flex mb-1 items-center justify-between">

                          <h2 className="font-semibold capitalize text-[14px] text-blue-900">{ticket?.subject}</h2>
                          <span className="text-gray-400 font-semibold capitalize text-sm">{ticket?.status}</span>

                        </div>

                        <p className="text-gray-500 capitalize text-[12px] mt-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '35ch' }}>
                          {ticket?.details}
                        </p>

                        <div className="flex items-center gap-2 mt-2">

                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket?.priority)}`}>
                          {ticket?.priority}
                        </span>

                          <span className="border capitalize px-3 py-1 text-xs font-medium rounded-full text-gray-700">
                            #{ticket?.ticketCode}
                          </span>

                          <div className="flex items-center ml-2 text-gray-400 text-[12px]">
                            <FaRegClock className="mr-1" />
                            {formatDate(ticket?.createdAt)}
                          </div>

                        </div>

                      </div>

                  </div>

              ))}

              <div className='flex items-end justify-end mt-2'>
                <YellowBtn onClick={() => navigate("/student-tickets")} text="view more"/>
              </div>

          </div>
        
        </div>

        </div>


      </div>
        
      {openNewTicketModal && <NewTicketModal openNewTicketModal={openNewTicketModal} setOpenNewTicketModal={setOpenNewTicketModal} />}
    
    </>

  )

}


export default MyLearning