import React, { useState } from "react"
import { FaChevronRight } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useGetCourseStudentDetailsQuery } from "../../store/apis/instructorApis"
import { useGetCourseByIdQuery } from "../../store/apis/courseApis"
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";



const CourseEnrolledStudnetsInsights = () => {

    const {courseId} = useParams()
    const {token} = useSelector((state) => state.user)

    console.log(courseId)

    const studentsData = Array.from({ length: 50 }, (_ , i) => ({
        id: `20250322-${i + 1}`,
        name: "Charlie Gouse",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        overallScore: "3/4",
        question: "25%",
        quiz: "25/50", 
        assignments: "5/5",
    }))

    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const studentsPerPage = 9

    const {data} = useGetCourseStudentDetailsQuery({token , courseId , page : currentPage})
    const {data : course} = useGetCourseByIdQuery({token , courseId})
    
  
    const filteredStudents = data?.students?.filter((student) =>
      student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  
      

  return (

    <div className="p-10">

        <h1 className='text-3xl mb-10 capitalize font-semibold text-[#002147]'>Student Progress  <span className="text-[#797979]">/ {course?.title}</span> </h1>
    
        <div className="mt-4 mb-4">

            <input
                type="text"
                placeholder="Search"
                className="w-[400px] p-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>

        <div className="mt-6 overflow-x-auto">

            <table className="w-[90%] bg-white shadow-md rounded-md">

                <thead>

                    <tr className="bg-white border-b-2 text-[#101018]">

                        <th className="p-4 text-left"><input type="checkbox" /></th>
                        <th className="p-4 text-left">Student Name</th>
                        <th className="p-4">Overall Score</th>
                        <th className="p-4">Question</th>

                        <th className="p-4">
                            <span className="flex items-center gap-1 justify-center"><FaChevronRight/> Quizzes</span> 
                        </th>

                        <th className="p-4">
                            <span className="flex items-center gap-1 justify-center"><FaChevronRight/> Assignments</span> 
                        </th>
                        
                    </tr>

                </thead>

                <tbody>
 
                {filteredStudents?.map((student , index) => (

                    <tr key={student?.studentId} className="border-b">

                        <td className="p-3"><input type="checkbox" /></td>

                        <td className="p-3 flex items-center gap-2">

                            {/* <img src={student.avatar} alt="Avatar" className="w-8 h-8 rounded-full" /> */}

                            <div className="flex items-center text-[#35353A] flex-col gap-1">
                                <p className="font-medium">{student?.fullName}</p>
                                <p className="text-sm text-gray-500">ID : {student?.studentId?.slice(0 , 10)}</p>
                            </div>

                        </td>

                        <td className="p-3 text-center">{student?.overallScore}</td>
                        <td className="p-3 text-center">{student.question}</td>
                        <td onClick={() => navigate(`/instructor/course/student-quizzes-progress/${courseId}/${student?.studentId}`)} className="p-3 cursor-pointer text-center">{student?.totalQuizMarks} / {student?.totalMaxQuizMarks}</td>
                        <td onClick={() => navigate(`/instructor/assigment/${student?.studentId}/${courseId}/student`)} className="p-3 cursor-pointer text-center">{student?.totalAssignments} / {student?.totalSubmittedAssignments}</td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

        <div className="mt-10 flex justify-end w-[90%] items-center gap-4">

            <button
                className="px-3 py-2 bg-gray-300 rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
                <FaLongArrowAltLeft size={20}/>
            </button>

            {[...Array(data?.totalPages || 1).keys()].map((number) => (
                <button
                    key={number + 1}
                    className={`px-5 py-1 text-lg rounded-md ${
                    currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentPage(number + 1)}
                >
                    {number + 1}
                </button>
            ))}

            <button
                className="px-3 py-2 bg-gray-300 rounded-md"
                disabled={currentPage === data?.totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, data?.totalPages))}
            >
                <FaLongArrowAltRight size={20}/>
            </button>

        </div>

    </div>

  )

}


export default CourseEnrolledStudnetsInsights