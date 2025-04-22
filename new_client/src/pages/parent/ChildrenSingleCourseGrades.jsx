import React from 'react'
import PurpleBtn from '../../components/PurpleBtn'
import { MdArrowForwardIos } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'




const ChildrenSingleCourseGrades = () => {

  const navigate = useNavigate()

  return (

    <div className="p-8 bg-gray-50">
    
        <div className='px-6'>
        
            <button onClick={() => navigate(`/parent/children/course/grdaes/1`)} className="text-lg flex items-center gap-2 font-medium text-[#3b298a] hover:underline">
                <MdArrowForwardIos className='rotate-180'/> Back 
            </button>
        
        </div>

        <h2 className="text-4xl font-semibold mb-10 capitalize p-6 text-[#002147]">Course Name Course Grades</h2>

        <div className="bg-white w-[90%] shadow-md rounded-lg">
        
             <div className="grid grid-cols-5 text-xl p-4 font-semibold text-gray-600">
                <div>Quiz Tiltle</div>
                <div>Submitted Quiz</div>
                <div>Quiz Grade</div>
                <div>Status</div>
                <div>Feedback</div>
            </div>
        
            {[ 
                { name: 'Quiz 1 : BioBlast Challenge', quizzes: "Yes", grade: '15/25', percentage: '80%', status: 'Good' },
                { name: 'Quiz 2 : The Cell Showdown', quizzes: "Yes", grade: '20/25', percentage: '90%', status: 'Excellent' },
                { name: 'Quiz 3 : The Ultimate BioQuest', quizzes: "No", grade: '8/25', percentage: '15%', status: 'Weak' },
            ].map((course, index) => (
        
                <div key={index} className="grid grid-cols-5 p-4 items-center justify-center border-t">
        
                    <div className='font-semibold'>{course.name}</div>
                    <div className='font-semibold'>{course.quizzes}</div>
        
                    <div>
        
                      <span className='text-center'>
                        {course.grade}
                      </span>
        
                    </div>
        
                    <div>
        
                      <span
                        className={`px-3 py-1 font-semibold rounded-r-xl rounded-l-xl ${
                          course.status === 'Excellent'
                            ? 'bg-[#C9FF90] text-[#5CB500]'
                            : course.status === 'Good'
                            ? 'bg-[#FFF4D2] text-[#FFC200]'
                            : 'bg-[#FBC2C2] text-[#FF0909]'
                        }`}
                      >
                        {course.status}
                      </span>
        
                    </div>
        
                    <button className="border border-gray-400 w-[150px] px-3 py-1 rounded text-sm text-[#403685] font-semibold">
                      No Feedback
                    </button>
    
                </div>
        
            ))}
        
        </div>

        <div className="flex gap-4 justify-end w-[90%] mt-12">
            <button className="px-3 py-1 border rounded-l"><MdArrowForwardIos className='rotate-180'/></button>
            <button className="px-3 py-1 border">1</button>
            <button className="px-3 py-1 border">2</button>
            <button className="px-3 py-1 border rounded-r"><MdArrowForwardIos/></button>
        </div>

    </div>

  )

}


export default ChildrenSingleCourseGrades