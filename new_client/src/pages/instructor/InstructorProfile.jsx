import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import courses from '../../data/courses'
import CourseCard from '../../components/CourseCard'
import instructorImg from "../../assets/instructor_img.png"



const InstructorProfile = () => {

  const params = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (

    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Profile Section */}
      <div className="flex items-center gap-6">

        <img
          src={instructorImg}
          alt="Profile"
          className="w-36 h-36 mr-5 rounded-full object-cover"
        />

        <div>

          <h1 className="text-3xl font-bold text-[#002147]">James Donin</h1>

          <p className="text-gray-600">Instructor, Full Stack Developer</p>

          <div className="flex gap-8 mt-3 text-[#002147] font-semibold">

            <div>
              <p className="text-lg">Total Students</p>
              <p className="text-xl text-[#FFC200] font-semibold">402,291</p>
            </div>

            <div>
              <p className="text-lg">Reviews</p>
              <p className="text-xl text-[#FFC200] font-semibold">44,432</p>
            </div>
            
            <div>
              
            </div>

            <button className='bg-[#FFC200] text-[#002147] px-5 rounded-lg transition-all hover:scale-90 duration-500 cursor-pointer'>
              Message
            </button>

          </div>

        </div>

      </div>

      {/* Bio Section */}
      <div className="mt-6">

        <h2 className="text-2xl font-semibold text-[#002147]">Bio</h2>

        <p className="text-gray-700 text-xl mt-2">
          James Donin is a skilled Full Stack Developer and instructor with
          expertise in front-end and back-end technologies like JavaScript,
          Node.js, Python, and databases. With 10 years of experience,
          specializes in building scalable applications and mentoring aspiring
          developers. Passionate about hands-on learning, simplifies complex
          coding concepts through interactive teaching. Stays updated with
          industry trends, contributing to open-source projects and technical
          blogs.
        </p>

      </div>

      {/* Courses Section */}
      <div className="mt-10">

        <h2 className="text-2xl font-semibold text-[#002147]">
          My Course (6)
        </h2>

        {/* Course Cards Grid */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {courses.map((course, index) => (
            <CourseCard data={course}/>
          )).slice(0 , 6)}

        </div>

        <div className="flex justify-between mt-8">

          <button disabled className="px-8 py-2 bg-[#002147] text-white font-semibold rounded-lg disabled:cursor-not-allowed transition">
            Prev
          </button>

          <button className="px-8 py-2 bg-[#FFC200] text-white font-semibold rounded-lg disabled:cursor-not-allowed transition">
            Next
          </button>

        </div>

      </div>

    </div>

  )

}


export default InstructorProfile