import React, { useState } from 'react'
import CircularProgressIcon from './CircularProgressIcon'
import ProgressBar from './ProgressBar'

import bookIcon from "../assets/book-icon.png" 
import attendanceIcon from "../assets/attendance-icon.png" 
import rankIcon from "../assets/rank-icon.png" 
import testImage from "../assets/test.png" 

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip , ResponsiveContainer , PieChart, Pie, Sector, Cell } from 'recharts'
import { useCalculateStudentAttendanceQuery, useGetAllCoursesCompletionPercentagePagingQuery, useGetAllCoursesCompletionPercentageQuery, useGetAllStudentCoursesQuery, useGetAvgLessonsProgressQuery, useGetStudentProgressQuery } from '../store/apis/studentApis'
import { useSelector } from 'react-redux'
import { formatLastLogin } from '../utils/formatLastLogin'
import MessagesPanel from './MessagesPanel'
import CourseCard from './CourseCard'
import { useGetAllCoursesQuery, useGetNotEnrolledCoursesQuery, useSuggestTopRatedCoursesQuery } from '../store/apis/courseApis'
import {Link , useNavigate} from "react-router-dom"



const Dashboard = () => {

  const baseUrl = "http://10.10.30.40:5500"

  const {token , user} = useSelector((state) => state.user)

  const [page , setPage] = useState(1)

  const navigate = useNavigate()

  const {data : studentEnrolledCourses , isError , isLoading} = useGetAllStudentCoursesQuery({token})
  const {data : studentAttendanceAvg } = useCalculateStudentAttendanceQuery({token})
  const {data : studentLessonsProgress } = useGetAvgLessonsProgressQuery({token})
  const {data : studentCoursesProgress } = useGetStudentProgressQuery({token})
  const {data : studentNotEnrolledCourses , refetch : refetchStudentNotEnrolledCourses } = useGetNotEnrolledCoursesQuery({token})
  const {data : suggestedTopCourses} = useGetAllCoursesQuery({token , page}) // replace with most popular courses api when there is a courses data
  const {data : enrolledCourses , refetch : refetchEnrolledCourses} = useGetAllStudentCoursesQuery({token})
  const {data : coursesProgress} = useGetAllCoursesCompletionPercentagePagingQuery({token})
  
  const attendanceAvg = parseFloat(studentAttendanceAvg?.attendance.replace('%', ''))

  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)


  const getStartOfWeek = (date) => {
    const startDate = new Date(date)
    const day = startDate.getDay()
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1)
    startDate.setDate(diff)
    startDate.setHours(0, 0, 0, 0)
    return startDate
  }


  const getWeekDays = () => {

    const startOfWeek = getStartOfWeek(currentWeek)
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(day.getDate() + i)
      days.push(day)
    }

    return days

  }


  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => new Date(prev.setDate(prev.getDate() - 7)))
  }

  const goToNextWeek = () => {
    setCurrentWeek((prev) => new Date(prev.setDate(prev.getDate() + 7)))
  }

  const eventData = {
    '2025-01-19': [{ name: 'Math Test', time: '10 AM', imageUrl: testImage }],
    '2025-01-19': [{ name: 'Revision', time: '12 AM', imageUrl: testImage }],
    '2025-01-20': [{ name: 'Physics Lecture', time: '1 PM', imageUrl: testImage }],
    '2025-01-21': [{ name: 'Chemistry Lab', time: '2 PM', imageUrl: testImage }],
    '2025-01-22': [{ name: 'Biology Test', time: '9 AM', imageUrl: testImage }],
    '2025-01-23': [{ name: 'History Lecture', time: '11 AM', imageUrl: testImage }],
    '2025-01-24': [{ name: 'Geography Field Trip', time: '3 PM', imageUrl: testImage }],
    '2025-01-25': [{ name: 'Art Workshop', time: '2 PM', imageUrl: testImage }],
  }

  const data = [
    { name: 'Mon', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Tue', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Wed', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Thu', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Fri', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Sat', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Sun', uv: 3490, pv: 4300, amt: 2100 },
  ]
  

  const pieChartData = [
    { name: 'Group A', value: studentCoursesProgress?.totalCourses || 10 },
    { name: 'Group B', value: studentCoursesProgress?.totalCompleted || 120 },
    { name: 'Group C', value: studentCoursesProgress?.totalNotCompleted || 60 },
  ]


  const testPieChartData = [
    { name: 'Group A', value: 200 },
    { name: 'Group B', value: 350 },
    { name: 'Group C', value:  500 },
  ]


  const isValidPieData = pieChartData.every(item => item.value > 0)
  const chartData = isValidPieData ? pieChartData : testPieChartData
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const RADIAN = Math.PI / 180


  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text key={index} x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )

}


  return (

    <div className='w-full flex flex-wrap justify-between items-start gap-14 p-8 '>
      
      <div className="w-full md:w-2/3">

        <div className='mb-8'>

          <h1 className='text-[24px] md:lg:text-[36px] lg:text-[48px] text-[#002147] font-ultraBold mb-2'>Welcome Back {user?.firstName} {user?.lastName}</h1>

          <span className="text-[16px] md:text-[20px] lg:text-[24px] font-mediumBold text-[#002147]">
            {formatLastLogin(user?.lastLogin)}
          </span>

        </div>

        <div className="flex items-center justify-center md:justify-normal flex-wrap gap-12 mb-8 mt-2 ">

            {/* Courses */}
            <div className="p-4 w-80 bg-[#FFF] shadow rounded-lg flex justify-between items-center">

              <div className="flex flex-col gap-3">
                <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#403685] font-semibold">Courses</h3>
                <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#403685]">{studentEnrolledCourses?.studentCourses?.length}</p>
              </div>

              <CircularProgressIcon staticNumber={studentEnrolledCourses?.studentCourses?.length} color={"#403685"} icon={bookIcon} />

            </div>

            {/* Attendance */}
            <div className="p-4 w-80 bg-[#FFF] shadow rounded-lg flex gap-4 justify-between items-center">

              <div className="flex flex-col gap-3">
                <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#FFC200] font-semibold">Attendances</h3>
                <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#FFC200]">{studentAttendanceAvg?.attendance}</p>
              </div>

              <CircularProgressIcon progress={attendanceAvg} color={"#FFC200"} icon={attendanceIcon} />

            </div>

            {/* Rank */}
          <div className="p-4 w-80 bg-[#FFF] shadow rounded-lg flex gap-4 justify-between items-center">

            <div className="flex flex-col gap-3">
              <h3 className="text-[18px] md:text-[22px] lg:text-[26px] text-[#6555BC] font-semibold">Progress</h3>
              <p className="text-[20px] md:text-[24px] lg:text-[28px] text-center font-bold text-[#6555BC]">{studentLessonsProgress?.averageScore}%</p>
            </div>

            <CircularProgressIcon progress={studentLessonsProgress?.averageScore} color={"#6555BC"} icon={rankIcon} />

          </div>

        </div>

          <div className='mt-12'>
                
            <h3 className='text-[#002147] font-ultraBold text-[20px] md:text-[26px] lg:text-[32px]'>My Progress</h3>

            <div className='w-3/4 sm:w-full flex flex-wrap 2xl:flex-nowrap justify-start items-center mb-6 mt-6 gap-8'>

            <div className='w-fit max-w-[620px] flex flex-col h-[380px] p-8 px-6 border-2 border-gray-200 rounded-lg'>
  
              <div className="flex justify-between sticky top-0 z-10 pb-3">
                <span className="text-[#101018] text-[18px] md:text-[20px] lg:text-[22px] font-mediumBold">Course Name</span>
                <span className="mr-44 text-[#101018] text-[18px] md:text-[20px] lg:text-[22px] font-mediumBold">Progress</span>
              </div>

              <hr className="sticky top-[50px]" />

              <div className="overflow-y-auto overflow-x-hidden p-3 h-[calc(100% - 30px)]">

                {coursesProgress?.courses?.map((course) => (

                  <div className='mb-4' key={course?.courseId}>
                    
                  <div className='flex items-center justify-between gap-7 2xl:gap-14'>
                      
                    <div className='flex flex-col 2xl:flex-row p-2 mb-2 justify-center items-center gap-2'>

                      <img  
                        src={testImage}
                        alt="Course Thumbnail" 
                        className="w-12 h-12 rounded-full object-cover" 
                      />

                      <div className="flex flex-col 2xl:ml-4 gap-1 ">
                        <span className="text-[18px] font-medium text-gray-800">{course?.courseName}</span>
                        <span className="text-[16px] text-gray-700">{course?.totalAttachments} Sections</span>
                      </div>

                    </div>

                    <ProgressBar percentage={course?.progress} color={course?.progress === "100%" ? "#FFC200" : "#6555BC"} />

                  </div>

                  <hr />

                </div>

              ))}

            </div>

            </div>
              
              <div className='w-[620px] h-[380px] p-6 border-2 border-gray-200 rounded-lg flex'>

              <div className="w-1/2 flex flex-col gap-4">

                  <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold mb-4 mt-4 text-gray-800">Course Statistics</h3>

                  <div className="flex flex-col mt-2 gap-8">

                    <div className="flex items-center gap-3 text-[15px] md:text-[16px] text-gray-700">

                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>

                      Total Enrollments : <strong>{studentCoursesProgress?.totalCourses}</strong>

                    </div>

                    <div className="flex items-center gap-3 text-[15px] md:text-[16px] text-gray-700">

                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>

                      Completed Courses : <strong>{studentCoursesProgress?.totalCompleted}</strong>

                    </div>

                    <div className="flex items-center gap-3 text-[15px] md:text-[16px] text-gray-700">

                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>

                      Not Completed Courses : <strong>{studentCoursesProgress?.totalNotCompleted}</strong>

                    </div>

                  </div>

                </div>

                <div className="w-1/2 flex ml-2 items-center justify-center">
  
                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart width={700} height={700}>
                    
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >

                        {pieChartData.map((entry , index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    
                      </Pie>

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>

        <div className="mb-5">

          <div className="max-w-[calc(100%-250px)] w-full"> 

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-[32px] font-ultraBold text-[#002147]">
                Recommended Courses
              </h2>

              <button className="text-[#6555BC] text-[18px] font-semibold hover:underline">
                <Link to={"/explore-courses"}>View All</Link>
              </button>

            </div>

            <div className="grid grid-cols-4 gap-6">

              {studentNotEnrolledCourses?.courses?.map((course) => (
                <CourseCard navigate={navigate} refetchStudentNotEnrolledCourses={refetchStudentNotEnrolledCourses} refetchEnrolledCourses={refetchEnrolledCourses} key={course.id} data={course} />
              ))}

            </div>

          </div>

        </div>

      </div>

      <div className="w-[28%] flex flex-col px-4 mr-4 gap-6">

        <div className="flex justify-between items-center">

          <button
            className="text-[#6555BC] text-[18px] font-semibold"
            onClick={goToPreviousWeek}
          >
            Previous Week
          </button>

          <h2 className="text-[#002147] text-[32px] font-ultraBold">
            Jan , 2025 Calendar
          </h2>

          <button
            className="text-[#6555BC] text-[18px] font-semibold"
            onClick={goToNextWeek}
          >
            Next Week
          </button>

        </div>

        <div className="grid mt-4 grid-cols-7 bg-white gap-4">

          {getWeekDays().map((day, index) => (

            <div
              key={index}
              className={`p-4 text-center cursor-pointer ${
                selectedDay && selectedDay.getDate() === day.getDate()
                  && 'bg-[#F0EEF8] text-[#6555BC]'
              } rounded-md`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="text-lg mb-2 font-semibold">{day.toLocaleString('en-US', { weekday: 'short' })}</div>
              <div>{day.getDate()}</div>

              <div className="flex justify-center mt-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>

            </div>

          ))}

        </div>

        <div className="mt-6 p-4 border-2 border-gray-200 rounded-lg">

          <h3 className="text-[22px] font-bold text-[#002147] mb-4">
            {selectedDay ? `Events for ${selectedDay.toLocaleDateString()}` : 'Select a day to view events'}
          </h3>

          <div className="text-gray-700">

            {selectedDay ? (
              eventData[formatDate(selectedDay)] && eventData[formatDate(selectedDay)].length > 0 ? (
                eventData[formatDate(selectedDay)].map((event, index) => (

                  <div key={index} className="flex items-center mb-4 p-4 border-b border-gray-200">

                    <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden mr-4">
                      <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col flex-grow">
                      <h4 className="text-xl font-semibold text-[#002147]">{event.name}</h4>
                      <span className="text-gray-600">Deadline : {event.time}</span>
                    </div>

                  </div>

                ))
              ) : (
                <p>No events for this day.</p>
              )
            ) : (
              <p>Select a day to view events.</p>
            )}

          </div>

        </div>
        

        <div className="mt-12 p-8 border-2 border-gray-200 rounded-lg">
          
          <div className='flex justify-between mb-2'>

            <h3 className="text-[22px] font-bold text-[#002147] mb-4">Insight Chart</h3>
            <button className="text-[22px] font-bold text-[#002147] mb-4">toggle</button>

          </div>

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />
              <YAxis />
              <chartToolTip />

              <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />

            </AreaChart> 

          </ResponsiveContainer>

        </div>

      </div>          
      
      <MessagesPanel/>

    </div>
  )

}


export default Dashboard
