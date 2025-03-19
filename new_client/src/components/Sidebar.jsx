import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaBook, FaCertificate, FaBookmark, FaMoon, FaSignOutAlt, FaChevronDown, FaChalkboardTeacher, FaSearch } from "react-icons/fa"
import { IoAddCircleSharp } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";
import logo from "../assets/tajseer_logo.png"
import smallLogo from "../assets/tajseer_logo_small.png"
import { logout } from '../store/slices/userSlice'
import { useDispatch , useSelector } from 'react-redux'
import { MdPlayLesson } from "react-icons/md";
import { FaSheetPlastic } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { MdAssignment , MdGridView } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoCreate } from "react-icons/io5";
import { SiQuizlet } from "react-icons/si";
import { CgProfile } from "react-icons/cg";



const Sidebar = ({ openSideBar , setopenSideBar }) => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    
    const user = useSelector((state) => state.user)

    const [isCoursesOpen , setIsCoursesOpen] = useState(false)
    const [isQuizzessOpen , setIsQuizzessOpen] = useState(false)
    const [isLessonsOpen , setIsLessonsOpen] = useState(false)

    const handelLogout = () => {
        localStorage.removeItem("token")
        dispatch(logout())
        navigate("/login")
    }
    

    console.log(user.user)
    

    return (

        <div className={`${openSideBar ? "w-28" : "w-72"} transition-all duration-300 ease-in-out bg-white fixed h-full px-4 py-6 flex flex-col justify-between shadow-md`}>

            <div className="flex flex-col transition-all duration-500 ease-in-out transform">

                <div className="flex px-2 items-center justify-start mb-5">
                    <img src={openSideBar ? smallLogo : logo} alt="Logo"  className={`transition-all duration-500 ${openSideBar ? "rotate-[360deg] scale-75" : "scale-100"} ${!openSideBar ? "transition-none" : ""}`} />
                </div>

                <ul className="space-y-8 mb-3 text-gray-700 font-semibold text-[16px]">

                    {user?.user?.role === "student" ? (
                        <li onClick={() => setopenSideBar(false)} 
                            className={`rounded py-2 px-3 text-[#403685] flex items-center cursor-pointer 
                            ${location.pathname === '/dashboard' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                            
                            <FaHome className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                            {!openSideBar && <Link to="/dashboard" className="ml-3">Home</Link>}
                        </li>
                    ) : (
                        <li onClick={() => setopenSideBar(false)} 
                            className={`rounded py-2 px-3 text-[#403685] flex items-center cursor-pointer 
                            ${location.pathname === '/instructor/dashboard' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                            
                            <FaHome className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                            {!openSideBar && <Link to="/instructor/dashboard" className="ml-3">Dashboard</Link>}
                        </li>
                    )}


                    {user?.user?.role === "student" &&  <li>

                        <button className="w-full flex justify-between items-center py-2 px-3 hover:bg-gray-100 cursor-pointer text-[#403685] rounded" onClick={() => { setIsCoursesOpen(!isCoursesOpen) ; setopenSideBar(false) }}>
                            
                            <div className="flex items-center">
                                <FaBook className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                {!openSideBar && <span className="ml-3">Courses</span>}
                            </div>

                            {!openSideBar && <FaChevronDown className={`transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />}

                        </button>

                        {isCoursesOpen && !openSideBar && (

                            <ul className="pl-10 space-y-4 mt-3 duration-300 ease-in-out">

                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/my-learning' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <FaChalkboardTeacher className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/my-learning">My Learning</Link>
                                </li>

                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/explore-courses' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <MdGridView className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/explore-courses">Explore Courses</Link>
                                </li>
 
                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/enrolled-courses' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <MdGridView className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/enrolled-courses">Enrolled Courses</Link>
                                </li>

                            </ul>

                        )}

                    </li>}


                    {user?.user?.role === "instructor" &&  <li>

                        <button className="w-full flex justify-between items-center py-2 px-3 hover:bg-gray-100 cursor-pointer text-[#403685] rounded" onClick={() => { setIsCoursesOpen(!isCoursesOpen) ; setopenSideBar(false) }}>
                            
                            <div className="flex items-center">
                                <FaBook className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                {!openSideBar && <span className="ml-3">Courses</span>}
                            </div>

                            {!openSideBar && <FaChevronDown className={`transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />}

                        </button>

                        {isCoursesOpen && !openSideBar && (

                            <ul className="pl-10 space-y-4 mt-3 duration-300 ease-in-out">

                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/courses' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <FaChalkboardTeacher className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/instructor/courses">My Courses</Link>
                                </li>

                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/create-course' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <IoAddCircleSharp className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/instructor/create-course">Create Course</Link>
                                </li>

                                <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/explore-courses' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                    <MdGridView className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    <Link to="/explore-courses">Explore Courses</Link>
                                </li>

                            </ul>

                        )}

                    </li>}

                    {user?.user?.role === "student" && 
                        (
                            <>
                                <li onClick={() => setopenSideBar(false)} className={`rounded py-2 px-3 cursor-pointer text-[#403685] flex items-center ${location.pathname === '/certificate' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                                    <FaCertificate className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    {!openSideBar && <Link to="/certificate" className="ml-3">My Certificate</Link>}
                                </li>

                                <li onClick={() => {setopenSideBar(false) ; navigate("/bookmark")}} className={`rounded py-2 cursor-pointer text-[#403685] px-3 flex items-center ${location.pathname === '/bookmark' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                                    <FaBookmark className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    {!openSideBar && <Link to="/bookmark" className="ml-3">Bookmark</Link>}
                                </li>
                            
                            </>
                        )

                    }

                    {user?.user?.role === "instructor" && 
                        (
                            <>
                                <li>

                                    <button className="w-full flex justify-between items-center py-2 px-3 hover:bg-gray-100 cursor-pointer text-[#403685] rounded" onClick={() => { setIsQuizzessOpen(!isQuizzessOpen) ; setopenSideBar(false) }}>
                                        
                                        <div className="flex items-center">
                                            <MdQuiz className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                            {!openSideBar && <span className="ml-3">Quiz</span>}
                                        </div>

                                        {!openSideBar && <FaChevronDown className={`transition-transform ${isQuizzessOpen ? 'rotate-180' : ''}`} />}

                                    </button>

                                    {isQuizzessOpen && !openSideBar && (

                                        <ul className="pl-10 space-y-4 mt-3 duration-300 ease-in-out">

                                            <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/quizzes' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                                <SiQuizlet className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                                <Link to="/instructor/quizzes">All Quizzes</Link>
                                            </li>

                                            <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/create-quiz' ? 'text-yellow-500' : 'hover:text-blue-500'}`}>
                                                <IoCreate className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                                <Link to="/instructor/create-quiz">Create Quiz</Link>
                                            </li>

                                        </ul>

                                    )}

                                </li>

                                <li className='text-[16px]'>

                                    <button className="w-full flex justify-between items-center py-2 px-3 hover:bg-gray-100 cursor-pointer text-[#403685] rounded" onClick={() => { setIsLessonsOpen(!isLessonsOpen) ; setopenSideBar(false) }}>
                                        
                                        <div className="flex items-center">
                                            <MdPlayLesson className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} `} />
                                            {!openSideBar && <span className="ml-5">Lesson Management</span>}
                                        </div>

                                        {!openSideBar && <FaChevronDown className={`transition-transform ${isLessonsOpen ? 'rotate-180' : ''}`} />}

                                    </button>

                                    {isLessonsOpen && !openSideBar && (

                                        <ul className="pl-10 text-[16px] space-y-4 mt-3 duration-300 ease-in-out">

                                            <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/assigments' && 'text-yellow-500'}`}>
                                                <MdAssignment className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                                <Link to="/instructor/assigments">Assigments</Link>
                                            </li>
                                            
                                            <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/create-assigment' && 'text-yellow-500'}`}>
                                                <IoCreate className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                                <Link to="/instructor/create-assigment">Create Assigment</Link>
                                            </li>

                                            <li className={`flex items-center text-[#403685] py-2 cursor-pointer ${location.pathname === '/instructor/create-live-session' && 'text-yellow-500'}`}>
                                                <IoChatboxEllipsesSharp className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                                <Link to="/instructor/create-live-session">Create Live Session</Link>
                                            </li>

                                        </ul>

                                    )}

                                </li>

                                <li onClick={() => {setopenSideBar(false) ; navigate("/instructor/courses-tickets")}} className={`rounded py-2 cursor-pointer text-[#403685] px-3 flex items-center ${location.pathname === '/instructor/courses-tickets' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                                    <IoTicket className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    {!openSideBar && <Link to="/instructor/courses-tickets" className="ml-3">Support Tickets</Link>}
                                </li>
                                
                                <li onClick={() => {setopenSideBar(false) ; navigate("/instructor/grades")}} className={`rounded py-2 cursor-pointer text-[#403685] px-3 flex items-center ${location.pathname === '/instructor/grades' ? 'text-yellow-500' : 'hover:bg-gray-100'}`}>
                                    <FaSheetPlastic className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                                    {!openSideBar && <Link to="/instructor/grades" className="ml-3">Grades</Link>}
                                </li>
                            
                            </>
                        )

                    }

                </ul>

            </div>

            <div className="space-y-4 mb-8 text-lg">

                {user?.user?.role === "instructor" && (
                    <li onClick={() => {setopenSideBar(false) ; navigate("/instructor/profile")}} className="rounded cursor-pointer py-2 font-semibold text-[#403685] px-3 flex items-center hover:bg-gray-100">
                        <CgProfile className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                        {!openSideBar && <Link to="/instructor/profile" className="ml-3">Profile</Link>}
                    </li>
                ) }

                <li onClick={handelLogout} className="rounded cursor-pointer py-2 font-semibold text-[#403685] px-3 flex items-center hover:bg-gray-100">
                    <FaSignOutAlt className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                    {!openSideBar && <Link className="ml-3">Logout</Link>}
                </li>

                <li onClick={() => setopenSideBar(false)} className="rounded cursor-pointer py-2 px-3 font-semibold text-[#403685] flex items-center hover:bg-gray-100">
                    <FaMoon className={`${openSideBar ? "w-7 h-7" : "w-6 h-6"} mr-3`} />
                    {!openSideBar && <button className="ml-3">Dark Mode</button>}
                </li>

                <div className="h-6"></div>

            </div>

        </div>

    )

}


export default Sidebar
