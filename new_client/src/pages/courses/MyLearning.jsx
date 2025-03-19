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
import { useGetAllUserTicketsQuery } from '../../store/apis/TicketApis';
import { useSelector } from 'react-redux';




const MyLearning = () => {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.user);

  const [selectedFilter , setSelectedFilter] = useState("All Courses")
  const [openNewTicketModal , setOpenNewTicketModal] = useState(false)


  const courses = [
        {
          id: 1,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg, 
          },
          image: "https://via.placeholder.com/150", 
        },
        {
          id: 2,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg , 
          },
          image: "https://via.placeholder.com/150",
        },
        {
          id: 3,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg, 
          },
          image: "https://via.placeholder.com/150", 
        },
        {
          id: 4,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg, 
          },
          image: "https://via.placeholder.com/150", 
        },
        {
          id: 5,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg, 
          },
          image: "https://via.placeholder.com/150", 
        },
        {
          id: 6,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg, 
          },
          image: "https://via.placeholder.com/150",
        },
        {
          id: 7,
          title: "Beginner’s Guide to Becoming a professional Front-End Developer",
          chapter: "Chapter 4",
          part: "part 2",
          progress: 55,
          mentor: {
            name: "Eileen Schinner",
            role: "Mentor",
            avatar: testImg,
          },
          image: "https://via.placeholder.com/150", 
        },
  ]

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



  return (

    <>

      <div className="space-y-8">

        {/* First row */}
        <div className="flex justify-between items-start w-full gap-4">

            <div className="flex-grow bg-gray-50 p-6 mb-1 rounded-lg relative">

              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Continue Watching</h2>
        
              <div className="absolute top-5 right-[100px] flex gap-3 p-2">

                <button className="bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200">
                  <HiChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
        
                <button className="bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200">
                  <HiChevronRight className="w-5 h-5 text-gray-700" />
                </button>

              </div>
        
              <div className="relative">

                <div className="flex overflow-x-hidden gap-4 scrollbar-hide max-w-[1600px]">

                  {courses.map((course, index) => (

                    <div onClick={() => navigate(`/course/main-page/${course.id}`)} key={course.id} className={`min-w-[260px] cursor-pointer bg-white shadow-md rounded-lg p-3 ${index >= 5 ? 'opacity-50 transition-opacity' : ''}`}>

                      <img src={courseImage} alt={course.title} className="rounded-md w-full h-32 object-cover" />

                      <h3 className="text-sm mr-2 font-semibold mt-2">{course.title}</h3>
                      <p className="text-xs mt-2 text-gray-500">{course.chapter} - {course.part}</p>
        
                      <div className="flex items-center gap-2 mt-2">
                        <img src={course.mentor.avatar} alt={course.mentor.name} className="w-6 h-6 rounded-full" />
                        <p className="text-xs text-gray-600">{course.mentor.name} <span className="text-gray-400 ml-2">{course.mentor.role}</span></p>
                      </div>
        
                      <div className="relative w-full h-2 bg-gray-200 rounded-full mt-3">
                        <div className="absolute h-full bg-purple-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
        
                      <p className="text-xs text-right text-gray-600 mt-1">{course.progress}%</p>

                    </div>

                  ))}

                </div>

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
              
              <div className="flex items-center gap-12">

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

              </div>

              <div className='flex mt-6 flex-col p-4 justify-start gap-5 space-y-4'>

                  <div className='flex max-w-[1550px] bg-white p-2 items-center gap-10 space-x-28'>
                      
                      <img src={courseImage} alt="" />

                      <div className='flex flex-col items-start gap-3'>

                          <span>Design System Basic</span>

                          <div className='flex items-center gap-3'>
                              <img className='rounded-2xl h-6 w-6' src={testImg} alt="" />
                              <span>MR .Imad . Teacher</span>
                          </div>

                      </div>

                      <div className='flex items-center flex-col gap-3'>
                          <span>Duration</span>
                          <span>4h 32m</span>
                      </div>

                      <div className='flex flex-col items-center gap-5 mr-5'>

                          <span>Progress</span>

                          <div className="relative w-[150px] h-2 bg-gray-200 rounded-full">
                              <span className="absolute h-full bg-purple-600 rounded-full" style={{ width: "55%" }}></span>
                              <span className="absolute -right-10 -top-1 text-xs text-gray-600">55%</span>
                          </div>                    

                      </div>

                      <div className='flex items-center justify-center gap-8'>

                          <div>
                              <span className='text-[18px]'>16</span>
                              <IoBook size={20}/>
                          </div>
                        
                          <div>
                              <span className='text-[18px]'>16</span>
                              <FaPlayCircle size={20}/>
                          </div>

                      </div>

                      <div>
                          <button className="bg-[#FFC200] p-4 rounded-lg flex items-center gap-2">
                              <span className='text-[14px]'>Continue</span>
                              <HiChevronRight />
                          </button>
                      </div>

                  </div>

                  <div className='flex max-w-[1550px] bg-white p-2 items-center gap-10 space-x-28'>
                      
                      <img src={courseImage} alt="" />

                      <div className='flex flex-col items-start gap-3'>

                          <span>Design System Basic</span>

                          <div className='flex items-center gap-3'>
                              <img className='rounded-2xl h-6 w-6' src={testImg} alt="" />
                              <span>MR .Imad . Teacher</span>
                          </div>

                      </div>

                      <div className='flex items-center flex-col gap-3'>
                          <span>Duration</span>
                          <span>4h 32m</span>
                      </div>

                      <div className='flex flex-col items-center gap-5 mr-5'>

                          <span>Progress</span>

                          <div className="relative w-[150px] h-2 bg-gray-200 rounded-full">
                              <span className="absolute h-full bg-purple-600 rounded-full" style={{ width: "55%" }}></span>
                              <span className="absolute -right-10 -top-1 text-xs text-gray-600">55%</span>
                          </div>                    

                      </div>

                      <div className='flex items-center justify-center gap-8'>

                          <div>
                              <span className='text-[18px]'>16</span>
                              <IoBook size={20}/>
                          </div>
                        
                          <div>
                              <span className='text-[18px]'>16</span>
                              <FaPlayCircle size={20}/>
                          </div>

                      </div>

                      <div>
                          <button className="bg-[#FFC200] p-4 rounded-lg flex items-center gap-2">
                              <span className='text-[14px]'>Start</span>
                              <HiChevronRight />
                          </button>
                      </div>

                  </div>

                  <div className='flex max-w-[1550px] bg-white p-2 items-center gap-10 space-x-28'>
                      
                      <img src={courseImage} alt="" />

                      <div className='flex flex-col items-start gap-3'>

                          <span>Design System Basic</span>

                          <div className='flex items-center gap-3'>
                              <img className='rounded-2xl h-6 w-6' src={testImg} alt="" />
                              <span>MR .Imad . Teacher</span>
                          </div>

                      </div>

                      <div className='flex items-center flex-col gap-3'>
                          <span>Duration</span>
                          <span>4h 32m</span>
                      </div>

                      <div className='flex flex-col items-center gap-5 mr-5'>

                          <span>Progress</span>

                          <div className="relative w-[150px] h-2 bg-gray-200 rounded-full">
                              <span className="absolute h-full bg-purple-600 rounded-full" style={{ width: "55%" }}></span>
                              <span className="absolute -right-10 -top-1 text-xs text-gray-600">55%</span>
                          </div>                    

                      </div>

                      <div className='flex items-center justify-center gap-8'>

                          <div>
                              <span className='text-[18px]'>16</span>
                              <IoBook size={20}/>
                          </div>
                        
                          <div>
                              <span className='text-[18px]'>16</span>
                              <FaPlayCircle size={20}/>
                          </div>

                      </div>

                      <div>
                          <button className="bg-[#FFC200] p-4 rounded-lg flex items-center gap-2">
                              <span className='text-[12px]'>View Certificate</span>
                              <HiChevronRight />
                          </button>
                      </div>

                  </div>
                  
                
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

                {tickets.map((ticket) => (

                  <div key={ticket.id} className="bg-gray-100 p-4 rounded-lg shadow flex items-start gap-4">

                    <div className="text-3xl">{ticket.icon}</div>

                      <div className="flex-1">

                        <div className="flex mb-1 items-center justify-between">

                          <h2 className="font-semibold text-[14px] text-blue-900">{ticket.title}</h2>
                          <span className="text-gray-400 text-sm">{ticket.status}</span>

                        </div>

                        <p className="text-gray-500 text-[12px] mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          {ticket.description}
                        </p>

                        <div className="flex items-center gap-2 mt-2">

                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${ticket.priorityColor}`}>
                            {ticket.priority}
                          </span>

                          <span className="border px-3 py-1 text-xs font-medium rounded-full text-gray-700">
                            #MKDO366
                          </span>

                          <div className="flex items-center text-gray-400 text-sm">
                            <FaRegClock className="mr-1" />
                            {ticket.time}
                          </div>

                        </div>

                      </div>

                  </div>

              ))}

          </div>
        
        </div>

        </div>


      </div>
        
      {openNewTicketModal && <NewTicketModal openNewTicketModal={openNewTicketModal} setOpenNewTicketModal={setOpenNewTicketModal} />}
    
    </>

  )

}


export default MyLearning