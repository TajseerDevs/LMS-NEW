import React from 'react'
import bookIcon from "../assets/book-icon.png" 
import totalStudents from "../assets/total_students.svg"
import evaluation from "../assets/evaluation.svg"
import CircularProgressIcon from './CircularProgressIcon'
import courseImg from "../assets/hd-course-image.jpg"
import stdImg from "../assets/instructor_img.png"
import { BsPeopleFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import YellowBtn from './YellowBtn'
import { useGetInstructorInsightsQuery, useGetInstructorUngradedSubmissionsQuery, useGetRandomInstructorCoursesQuery, useGetRandomStudentsWithCompletionQuery, useGetTwoRandomUngradedSubmissionsQuery } from '../store/apis/instructorApis'
import { useSelector } from 'react-redux'
import formatDate from '../utils/formatDate'



const baseUrl = `http://10.10.30.40:5500`


const InstructorDashboard = () => {

    const navigate = useNavigate()

    const {token} = useSelector((state) => state.user)

    const {data} = useGetInstructorInsightsQuery({token})
    const {data : NotGradedSubmissions} = useGetInstructorUngradedSubmissionsQuery({token})
    const {data : randomCourses} = useGetRandomInstructorCoursesQuery({token})
    const {data : randomStudentsCompletion} = useGetRandomStudentsWithCompletionQuery({token})
    const {data : randomStudentsSubmissions} = useGetTwoRandomUngradedSubmissionsQuery({token})


  return (

    <div className='w-full p-10'>

        <h3 className='text-[#002147] font-semibold text-3xl'>Overview</h3>

        <div className="flex items-center justify-center md:justify-normal flex-wrap gap-12 mb-8 mt-8">

            <div className="p-4 w-[430px] bg-[#FFF] shadow rounded-lg flex justify-between items-center">

                <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#403685] font-semibold">Total Courses</h3>
                    <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#403685]">{data?.numberOfCourses}</p>
                </div>

                <CircularProgressIcon staticNumber={data?.numberOfCourses} color={"#FFC200"} icon={bookIcon} />

            </div>

            <div className="p-4 w-[430px] bg-[#FFF] shadow rounded-lg flex justify-between items-center">

                <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#403685] font-semibold">Total Student</h3>
                    <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#403685]">{data?.totalEnrolledStudents}</p>
                </div>

                <CircularProgressIcon className="mr-1" staticNumber={data?.totalEnrolledStudents} color={"#FFC200"} icon={totalStudents} />

            </div>

            <div className="p-4 w-[430px] bg-[#FFF] shadow rounded-lg flex justify-between items-center">

                <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#403685] font-semibold">Pending Evaluation</h3>
                    <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#403685]">{NotGradedSubmissions?.totalUngradedSubmissions}</p>
                </div>

                <CircularProgressIcon staticNumber={NotGradedSubmissions?.totalUngradedSubmissions} color={"#FFC200"} icon={evaluation} />

            </div>

            <div className="p-4 w-[430px] bg-[#FFF] shadow rounded-lg flex justify-between items-center">

                <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#403685] font-semibold">Unread Messages</h3>
                    <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#403685]">5</p>
                </div>

                <CircularProgressIcon staticNumber={5} color={"#FFC200"} icon={bookIcon} />

            </div>

        </div>

        <div className="grid mt-10 grid-cols-2 w-full">

            <div className=" p-4 rounded-lg">

                <div className="flex mb-4 mt-4 w-[80%] justify-between items-center">

                    <h2 className="text-2xl text-[#002147] font-semibold">Teaching Courses</h2>
                    <button onClick={() => navigate("/instructor/courses")} className="text-[#403685] flex items-center gap-2 text-xl font-semibold">View All Courses <FaAngleRight/> </button>

                </div>

                <div className="mt-4 space-y-5">

                    {randomCourses?.courses?.map((course) => (

                        <div key={course} className="flex cursor-pointer items-center w-[80%] bg-white p-3 rounded-lg">

                            <img
                                src={`${baseUrl}${course?.coursePic}`}
                                alt="Course"
                                className="w-[135px] h-[85px] rounded-md mr-3"
                            />

                            <div className='ml-8'>
                                <p className="text-[#002147] text-lg capitalize font-semibold">{course?.title}</p>
                                <p className="text-md mt-2 flex items-center gap-2 text-[#002147]"><BsPeopleFill size={22}/> Student Enrolled {course?.studentsEnrolled?.length}</p>
                            </div>

                            <button onClick={() => navigate(`/instructor/course/structure/${course?._id}`)} className="text-[#403685] flex items-center gap-2 text-md ml-auto mr-10 font-semibold">View Course <FaAngleRight/></button>

                        </div>

                    ))}

                </div>
            
            </div>

            <div className="p-4  rounded-lg mt-4">

                <div className="flex mb-4 justify-between items-center">
                    <h2 className="text-2xl text-[#002147] font-semibold">Student List</h2>
                </div>

                <table className="w-[800px] bg-white mt-3 text-left text-sm">

                    <thead>

                        <tr className="text-[#101018] font-semibold h-[60px] border-b">
                            <th className="py-2 text-lg p-2">Student Name</th>
                            <th className="py-2 text-lg p-2">Course Name</th>
                            <th className="py-2 text-lg p-2">Status</th>
                            <th className="py-2 text-lg p-2">Action</th>
                        </tr>

                    </thead>

                    <tbody className='p-2'>

                        {randomStudentsCompletion?.studentsCourses?.map((student, index) => (

                            <tr key={index} className="border-b h-[60px] p-2">

                                <td className="py-2 flex items-center gap-2 p-2">
                                    {/* <img src={stdImg} className='h-10 w-10 rounded-full' alt="" /> */}
                                    <span className='text-[#35353A] font-semibold'>{student?.studentName}</span>
                                </td>

                                <td className='text-[#35353A] capitalize font-semibold'>{student?.courseName}</td>

                                <td className={`${student?.completionPercentage === 0 ? 'text-[#FF0004]' : student?.completionPercentage < 100 ? 'text-[#FFC200]' : 'text-[#14AE5C]'} font-medium`}>
                                    {student?.completionPercentage === 0 ? 'Needs Attention' : student?.completionPercentage < 100 ? 'Keep Going' : 'Great'}
                                </td>

                                <td className="flex mb-2 p-2 text-blue-500">
                                    <FaEye onClick={() => navigate(`/instructor/course/enrolled-students/${student?.courseId}`)} className="cursor-pointer" size={22}/>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
        
        <div className="grid mt-16 grid-cols-2 p-2 w-full">
            
            <div className="bg-white p-4 px-6 rounded-xl shadow-md w-full max-w-4xl">
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">

                    <h2 className="text-lg font-bold">WEEK 1</h2>

                    <div className='flex items-center gap-3'>
                        <FaAngleLeft className='cursor-pointer' size={22}/>
                        <FaAngleRight className='cursor-pointer' size={22}/>
                    </div>

                    <div className="text-[#808080] font-medium">1-5 JAN</div>

                </div>

                <div className="grid grid-cols-5 gap-2 mt-4">

                    {[1, 2, 3, 4, 5].map((day) => (

                        <div
                            key={day}
                            className={`relative p-4 h-52 border rounded-lg flex items-start justify-center ${
                            day === 1 ? "bg-gray-200" : "bg-white"
                        }`}
                        >
                            <span className="text-lg font-bold text-gray-700">{day}</span>

                        </div>

                    ))}

                </div>
                
            </div>

            <div className="p-4 rounded-lg mt-6 w-[80%]">

                <div className="flex  justify-between items-center">
                    <h2 className="text-2xl text-[#002147] font-semibold">Undergoing Review</h2>
                    <button className="text-[#4036851] flex items-center gap-2 font-semibold text-lg">View All <FaAngleRight/></button>
                </div>

                <div className="mt-8 space-y-3">

                {randomStudentsSubmissions?.length > 0 ? (

                    randomStudentsSubmissions?.map((assignment) => (

                        <div key={assignment?._id} className="flex items-center p-3 rounded-lg">

                            <div className="w-10 h-10 bg-yellow-300 rounded-lg mr-3"></div>

                            <div>

                                <p className="font-medium capitalize">{assignment?.assignmentTitle}</p>

                                <p className="text-sm text-gray-500">
                                    Student Name : {assignment?.studentName}
                                </p>

                            </div>

                            <p className="ml-auto mr-5 text-gray-500 text-sm">
                                Deadline : {formatDate(assignment?.dueDate)}
                            </p>

                            <YellowBtn
                                onClick={() => navigate(`/instructor/assigment/${assignment?.studentId}/${assignment?.courseId}/student`)}
                                text="Grade"
                            />

                        </div>

                    ))
                        ) : (
                        <p className="text-center text-lg text-gray-500 mt-8">
                            No student submissions available.
                        </p>
                    )}

                </div>

            </div>

        </div>


    </div>
  )

}



export default InstructorDashboard