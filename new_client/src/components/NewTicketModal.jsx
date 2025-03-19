import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IoCloseSharp } from "react-icons/io5";
import { useAddNewTicketMutation , useGetAllUserTicketsQuery } from '../store/apis/TicketApis';
import { useGetAllStudentCoursesQuery} from '../store/apis/studentApis';



const NewTicketModal = ({openNewTicketModal , setOpenNewTicketModal}) => {

    const { token } = useSelector((state) => state.user)
    
    const [regarding , setRegarding] = useState("technical")
    const [subject , setSubject] = useState("")
    const [details , setDetails] = useState("")
    const [courseId , setCourseId] = useState("")
    const [priority , setPriority] = useState("low")

    const [addNewTicket , {isLoading : isLoadingAddNewTicket  , isError : isErrorAddNewTicket}] = useAddNewTicketMutation()
    const {data : studentCourses , isLoading : isLoadingStudentCourses , isError : isErrorStudentCourses , refetch } = useGetAllStudentCoursesQuery({token})

    

  return (

    <div className='fixed inset-0 m-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>

        <div className='bg-white p-6 rounded-lg shadow-md w-[640px] h-[650px]'>

            <div className='flex justify-between p-2 mb-5'>

                <span className='text-[#002147] font-semibold text-2xl'>New Tickets</span>
                <IoCloseSharp onClick={() => setOpenNewTicketModal(false)} className="text-gray-400 cursor-pointer text-3xl" />

            </div>

            <span className='text-[#000] p-2 font-semibold'>Select an issue you’d like to report</span>

            <div className='p-2 flex flex-col gap-6 mt-4'>

                <label className="flex items-center gap-4 cursor-pointer">

                    <input 
                        type="radio" 
                        name="issueType" 
                        value="technical" 
                        checked={regarding === "technical"}
                        onChange={() => setRegarding("technical")}
                        className="hidden"
                    />
                    
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${regarding === "technical" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                        {regarding === "technical" && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </span>

                    <span className='text-[#002147] font-semibold'>Technical improvement</span>

                </label>


                 <label className="flex items-center gap-4 cursor-pointer">

                    <input 
                        type="radio" 
                        name="issueType" 
                        value="content" 
                        checked={regarding === "content"}
                        onChange={() => setRegarding("content")}
                        className="hidden"
                    />

                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${regarding === "content" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                        {regarding === "content" && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </span>

                    <span className='text-[#002147] font-semibold'>Content improvement</span>

                </label>         

            </div>

            <div className="flex-1 mt-3 overflow-y-auto h-[320px] space-y-2 px-2 p-4">

                <div className='flex flex-col justify-start mb-2'>

                    <label className="block mb-1 text-sm font-medium">Issue Subject</label>

                    <input 
                        type="text" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        className="w-full border p-2 rounded mb-3"
                        placeholder="Specify the issue subject"
                    />

                </div>

                <div className='flex flex-col justify-start mb-2'>
                
                    <label className="block text-sm mb-1 font-medium">Course Name</label>

                    <select 
                        value={courseId} 
                        onChange={(e) => setCourseId(e.target.value)} 
                        className="w-full border p-2 rounded mb-3"
                    >   
                        <option value="">Select Course</option>
                        <option value="course1">Course 1</option>
                        <option value="course2">Course 2</option>

                    </select>

                </div>

                <div className='flex flex-col justify-start mb-2'>

                    <label className="block text-sm mb-1 font-medium">Priority</label>

                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)} 
                        className="w-full border p-2 rounded mb-3"
                    >
                        <option value="">Set the issue priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="Urgent">Urgent</option>

                    </select>

                </div>

                <div className='flex flex-col justify-start mb-2'>

                    <label className="block text-sm mb-1 font-medium">Describe the Issue</label>

                    <textarea 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)} 
                        className="w-full border p-2 rounded h-28 mb-3"
                        placeholder="Kindly define the problem"
                    />

                </div>

            </div>

            <div className='flex gap-4 justify-end p-4 mr-2 mt-4'>
                <button className='bg-[#FFC200] px-6 py-2 capitalize font-semibold rounded-xl'>submit</button>
                <button onClick={() => setOpenNewTicketModal(false)} className='bg-white cursor-pointer text-[#403685] border-2 border-[#403685] font-semibold px-6 py-2 capitalize rounded-xl'>cancel</button>
            </div>

        </div>

    </div>

  )

}


export default NewTicketModal