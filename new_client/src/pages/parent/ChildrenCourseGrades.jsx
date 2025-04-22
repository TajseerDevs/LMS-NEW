import React from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import YellowBtn from '../../components/YellowBtn'
import { MdArrowForwardIos } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'


const ChildrenCourseGrades = () => {

  const navigate = useNavigate()

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

    <div className="bg-white rounded-2xl w-[90%] shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between mb-16">

      <div className="flex items-center space-x-8">

        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="w-36 h-36 rounded-full border-2 border-[#403685] shadow-md object-cover"
        />

        <div className='flex flex-col items-start gap-1'>

          <h1 className="text-2xl font-bold text-[#002147]">Sarah Allen</h1>
          <p className="text-[#403685] font-semibold text-lg">5th Grade</p>
                
          <YellowBtn text="Show Profile"/>

        </div>

      </div>

      <div className="flex gap-12 mt-6 mr-10 sm:mt-0 text-sm text-gray-700">

        <div className='flex text-lg flex-col gap-2'>
          <p className="font-semibold">Enrollment Date : <span className='text-[#6E6E71]'>September 20,2023</span></p>
          <p className="font-semibold">Educational Student Level : <span className='text-[#6E6E71]'>University</span></p>
        </div>

        <div className="border-l-2 text-lg border-gray-300 flex flex-col gap-2 pl-12">
          <p className="font-semibold">Number of Courses : <span className='text-[#6E6E71]'>6</span></p>
          <p className="font-semibold">Student special Needs : <span className='text-[#6E6E71]'>No</span></p>
        </div>

      </div>

    </div>

      <div className="flex items-center mb-4">

        <input
          type="text"
          placeholder="Search"
          className="border p-2 w-[240px] rounded mr-4"
        />

        <select className="border w-[240px] p-2 rounded">
          <option>Course name</option>
        </select>

      </div>

      <div className="bg-white w-[90%] shadow-md rounded-lg">

        <div className="grid grid-cols-6 text-xl p-4 font-semibold text-gray-600">
          <div>Course Name</div>
          <div>Number Of Quizzes</div>
          <div>Overall Grade</div>
          <div>Status</div>
          <div>Feedback</div>
          <div>Action</div>
        </div>

        {[
          { name: 'Biology Course', quizzes: 3, grade: '15/25', percentage: '80%', status: 'Good' },
          { name: 'English Course', quizzes: 5, grade: '20/25', percentage: '90%', status: 'Excellent' },
          { name: 'Arabic Course', quizzes: 4, grade: '8/25', percentage: '15%', status: 'Weak' },
        ].map((course, index) => (

          <div key={index} className="grid grid-cols-6 p-4 items-center justify-center border-t">

            <div className='font-semibold'>{course.name}</div>
            <div className='font-semibold'>{course.quizzes}</div>

            <div>

              <span className='text-center'>
                {course.grade}
              </span>

              <div className="w-[190px] bg-gray-200 rounded-full h-2.5 mt-1">

                <div className="bg-[#6555BC] h-2.5 rounded-full" style={{ width: course.percentage }}/>

              </div>

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

            <button onClick={() => navigate(`/parent/children/course/grdaes/1/2`)}  className="text-md flex items-center gap-2 font-medium text-[#3b298a] hover:underline">
              Show More <MdArrowForwardIos/>
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


export default ChildrenCourseGrades