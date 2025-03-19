import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const quizzes = Array(10).fill({
  title: "Quiz: Intro to Science",
  questions: 5,
  overallScore: 5,
  answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
})



const CourseEnrolledStudnetQuizzesProgress = () => {

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = 10
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }



  return (

    <div className="p-10">

      <h1 className='text-3xl mb-6 capitalize font-semibold text-[#002147]'>
        Student Progress <span className="text-gray-500">/ Science / Charlie Gouse / Quizzes</span>
      </h1>

      <div className="relative w-1/4 mb-4">

        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 w-[380px] px-4 py-2 pl-10 rounded-lg"
          value={searchQuery}
          onChange={handleSearch}
        />

        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

      </div>

      <div className="overflow-x-auto mt-10 bg-white shadow-md rounded-lg">

        <table className="w-full h-[700px] text-left border-collapse">

          <thead>

            <tr className="bg-white border-b-2 text-[#101018]  uppercase text-sm">

              <th className="p-4">Quiz Title</th>
              <th className="p-4 ">Questions</th>
              <th className="p-5">Overall Score</th>

              {Array.from({ length: 10 }).map((_, i) => (
                <th key={i} className="px-4 py-3">Question {i + 1}</th>
              ))}

            </tr>

          </thead>

          <tbody>

            {quizzes.map((quiz, index) => (

              <tr key={index} className="border-b">

                <td className="px-4 font-semibold py-2">{quiz.title}</td>
                <td className="px-4 py-2">{quiz.questions}</td>
                <td className="px-4 py-2">{quiz.overallScore}</td>

                {quiz.answers.map((answer, i) => (
                  <td key={i} className="px-4 py-2">{answer}</td>
                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="mt-8 flex items-center justify-end gap-2">

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>

        )).slice(0, 2)}

        <span className="text-gray-500">...</span>

        <button
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === totalPages ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {totalPages}
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          &gt;
        </button>

      </div>

    </div>

    )
}


export default CourseEnrolledStudnetQuizzesProgress