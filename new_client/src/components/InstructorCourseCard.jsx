import testImg from "../assets/hd-course-image.jpg"
import React from "react";
import { AiFillStar } from "react-icons/ai"
import { FaUserGraduate } from "react-icons/fa"
import { BsClockHistory } from "react-icons/bs"
import { RiArrowDropRightLine } from "react-icons/ri"
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";
import { CgInsights } from "react-icons/cg";
import { IoTicket } from "react-icons/io5";


const baseUrl = `http://10.10.30.40:5500`


const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#FDE497] text-[#FFC200]";
      case "rejected":
        return "bg-[#FFA8A8] text-[#C20003]";
      case "approved":
        return "bg-[#BDF9A7] text-[#007100]";
      default:
        return "bg-gray-200 text-gray-800"; 
    }
}




const InstructorCourseCard = ({course}) => {

  const navigate = useNavigate()


  return (
    <div onClick={() => navigate(`/instructor/course/structure/${course?._id}`)} className="max-w-[400px] bg-white shadow-lg rounded-xl cursor-pointer overflow-hidden border">

      <div className="relative">

        <img
          className="w-full h-48 object-cover"
          src={`${baseUrl}${course?.coursePic}`}
          alt=""
        />

      </div>

      <div className="p-3">

        <div className="flex mb-4 justify-between items-center">

          <h3 className="text-xl font-semibold text-gray-900">{course?.title}</h3>

          <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusStyles(course?.status)}`}>
            {course?.status}
          </span>

        </div>

        <div onClick={(e) => {e.stopPropagation() ; navigate(`/instructor/course/feedbacks/${course?._id}`)}} className="flex items-center text-gray-700 mt-2">
          <AiFillStar className="text-yellow-500" />
          <span className="ml-1 font-semibold">{course?.rate}</span>
          <span className="text-sm text-gray-500 ml-1">({course?.ratings?.length})</span>
        </div>

        <div className="flex items-center text-gray-700 mt-2">
          <FaUserGraduate className="text-purple-600" />
          <span className="ml-2 font-semibold">Student Enrolled: {course?.studentsEnrolled?.length}</span>
        </div>

        <div className="flex items-center text-gray-700 mt-2">
          <BsClockHistory className="text-gray-500" />
          <span className="ml-2 text-sm">Last updated: <strong>{formatDate(course?.updatedAt)}</strong></span>
        </div>

        <div className="mt-4 flex justify-between">

          <div className="flex mt-2 items-center gap-6">

            <button onClick={(e) => {e.stopPropagation() ; navigate(`/instructor/course/enrolled-students/${course?._id}`)}} className="text-[#403685] flex items-center hover:underline text-sm font-semibold">
              <PiStudentBold size={24}/>
            </button>

            <button onClick={(e) => {e.stopPropagation() ; navigate(`/instructor/course/enrolled-students-progress/${course?._id}`)}} className="text-[#403685] flex items-center hover:underline text-sm font-semibold">
              <CgInsights size={26}/>
            </button>

            <button onClick={(e) => {e.stopPropagation() ; navigate(`/instructor/course-tickets/${course?._id}`)}} className="text-[#403685] flex items-center hover:underline text-sm font-semibold">
              <IoTicket size={24}/>
            </button>

          </div>

          <button className="text-[#403685] flex items-center hover:underline text-sm font-semibold">
            See more
            <RiArrowDropRightLine size={26} />
          </button>

        </div>

      </div>

    </div>

  )

}


export default InstructorCourseCard

