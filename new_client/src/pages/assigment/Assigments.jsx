import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetAllInstructorCoursesNoPagingQuery } from '../../store/apis/instructorApis'
import { FiPlus } from 'react-icons/fi'
import YellowBtn from '../../components/YellowBtn'
import { useNavigate } from 'react-router-dom'
import purpleAssigment from "../../assets/purple-assigment.svg"
import { useGetInstructorAssigmentsQuery } from '../../store/apis/assigmentApis'
import { format } from 'date-fns'
import { FaAngleRight } from "react-icons/fa";



const Assigments = () => {

    const {token} = useSelector((state) => state.user)
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [selectedCourse , setSelectedCourse] = useState("")
    const [page , setPage] = useState(1)

    const {data : instructorCourses} = useGetAllInstructorCoursesNoPagingQuery({token})
    const {data : assigments} = useGetInstructorAssigmentsQuery({token})

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handlePrev = () => {
        if (page > 1) {
          setPage(prevPage => prevPage - 1)
        }
    }
    
    const handleNext = () => {
        if (assigments && page < assigments?.totalPages) {
          setPage(prevPage => prevPage + 1)
        }
    }


  return (
    <div className='w-[90%] p-10'>

        <h3 className='text-[#002147] font-semibold text-3xl'>Assigments</h3>
        
        <div className="flex items-center justify-between mt-8 mb-8 w-[75%]">

            <div className='flex items-center gap-8'>

                <input
                    value={search}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search"
                    className="border px-3 w-[300px] py-2 rounded-lg focus:outline-none"
                />

                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} name="sort" className="border px-3 w-[300px] py-2 rounded-lg">
                    
                    <option value="" selected disabled>Course Name</option>

                    {instructorCourses?.map((course) => (
                        <option key={course?._id} value={course?._id}>{course?.title}</option>
                    ))}

                </select>

            </div>

            <YellowBtn onClick={() => navigate(`/instructor/create-assigment`)} text="Create Assignment" icon={FiPlus} />
 
        </div>


        <div className="mt-12 bg-white shadow flex w-[1500px] flex-col gap-4 rounded-lg">
            
            {assigments?.assignments?.map((assigment) => (

                <div key={assigment?._id} className="flex items-center p-6 border-b last:border-b-0">
                    
                    <div>
                        <img src={purpleAssigment} alt={assigment?.title} className="w-20 bg-[#F0EEF8] p-2 mr-6 h-20 rounded-md" />
                    </div>

                    <div className="ml-4 flex-grow w-[300px]">
                        <h2 className="text-2xl mb-1 text-[#35353A] font-semibold">{assigment?.title}</h2>
                    </div>

                    <div className="text-center mr-20 w-[200px]">
                        <p className="text-gray-500 mb-1 text-sm">Course</p>
                        <p className="font-semibold text-[#002147]">{assigment?.courseId?.title}</p>
                    </div>

                    <div className="text-center mr-20 w-24">
                        <p className="text-gray-500 mb-1 text-sm">Total Submitted</p>
                        <p className="font-semibold text-[#002147]">{assigment?.submissions?.length}</p>
                    </div>

                    <div className="text-center mr-20 w-44">
                        <p className="text-gray-500 mb-1 text-sm">Due Date </p>
                        <p className="font-semibold ml-2 text-center text-gray-800">{assigment.dueDate ? format(new Date(assigment.dueDate), 'MMMM dd, yyyy') : 'No due date'}</p>
                    </div>

                    <div>
                        <YellowBtn onClick={() => navigate(`/instructor/assigment/${assigment?._id}/${assigment?.courseId?._id}`)} text="View More" icon={FaAngleRight}/>
                    </div>

                </div>

            ))}

        </div>

        <div className='mt-12 flex items-center gap-6 justify-center'>

            <YellowBtn text="Prev" disabled={page <= 1} onClick={handlePrev} />

            <span className="mx-4 text-lg font-semibold">page {page}</span>

            <YellowBtn text="Next" disabled={page >= assigments?.totalPages} onClick={handleNext} />

        </div>

    </div>

  )

}



export default Assigments