import React, { useState } from "react"
import { FaChevronRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"



const CourseEnrolledStudnetsInsights = () => {

    const studentsData = Array.from({ length: 50 }, (_, i) => ({
        id: `20250322-${i + 1}`,
        name: "Charlie Gouse",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        overallScore: "3/4",
        question: "25%", // percentage of correct questions that he provide in quizzes
        quiz: "25/50", // his all score calculation in all course quizzes
        assignments: "5/5", // his submitted assigments total from the all course assigments
    }))

    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const studentsPerPage = 9
  
    const filteredStudents = studentsData.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  
    const indexOfLastStudent = currentPage * studentsPerPage
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent) 
      

  return (
    <div className="p-10">

        <h1 className='text-3xl mb-10 capitalize font-semibold text-[#002147]'>Student Progress  <span className="text-[#797979]">/ Course Name</span> </h1>
    
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

                {currentStudents.map((student, index) => (

                    <tr key={index} className="border-b">

                        <td className="p-3"><input type="checkbox" /></td>

                        <td className="p-3 flex items-center gap-2">

                            <img src={student.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />

                            <div className="flex items-center text-[#35353A] flex-col gap-1">
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-gray-500">ID: {student.id}</p>
                            </div>

                        </td>

                        <td className="p-3 text-center">{student.overallScore}</td>
                        <td className="p-3 text-center">{student.question}</td>
                        <td onClick={() => navigate(`/instructor/course/student-quizzes-progress/2/4/2`)} className="p-3 cursor-pointer text-center">{student.quiz}</td>
                        <td onClick={() => navigate(`/instructor/assigment/${student.id}/1213214142/student`)} className="p-3 cursor-pointer text-center">{student.assignments}</td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

        <div className="mt-10 flex justify-end w-[90%] items-center gap-2">

            <button
                className="px-3 py-1 bg-gray-300 rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
            >
                &lt;

            </button>

            {[...Array(Math.ceil(filteredStudents.length / studentsPerPage)).keys()].map((number) => (
                <button
                        key={number + 1}
                        className={`px-3 py-1 rounded-md ${currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                        onClick={() => setCurrentPage(number + 1)}
                    >
                    {number + 1}
                </button>
            ))}

            <button
                className="px-3 py-1 bg-gray-300 rounded-md"
                disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
            >
                &gt;
            </button>

        </div>

    </div>

  )

}


export default CourseEnrolledStudnetsInsights