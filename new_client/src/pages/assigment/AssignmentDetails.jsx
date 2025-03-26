import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import YellowBtn from '../../components/YellowBtn';
import { useCheckAssignmentDueDateQuery, useGetAssignmentDetailsQuery } from '../../store/apis/assigmentApis';
import { useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';
import { daysUntilDueDate } from '../../utils/daysUntilDueDate';



const AssignmentDetails = () => {

    const baseUrl = `http://10.10.30.40:5500`

    const {token} = useSelector((state) => state.user)

    const {assignmentId , courseId} = useParams()
    const navigate = useNavigate()

    const {data : assignment , isLoading} = useGetAssignmentDetailsQuery({token , assignmentId})
    const {data : assignmentDateCheck , isLoading : isLoadingDateCheck} = useCheckAssignmentDueDateQuery({token , assignmentId})


    const downloadFile = (filePath) => {
        const filename = filePath.replace("/uploads/", "")
    
        const downloadUrl = `${baseUrl}/download/${encodeURIComponent(filename)}`
    
        const link = document.createElement("a")
        link.href = downloadUrl;
        link.setAttribute("download", "")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

  
    if(isLoading || isLoadingDateCheck){
        return <h1 className='p-10'>Loading ...</h1>
    }



    return (
        <>
            <div className='p-2'>
    
                <div className='bg-white h-[80px] ml-1 flex items-center gap-8 p-6 w-full'>
                    <button onClick={() => navigate(`/course/main-page/${courseId}`)} className='flex text-[#FFC200] font-semibold text-xl items-center gap-2'><FaArrowLeft className='mt-1' size={22}/> Back</button>
                    <span className='text-[#403685] font-semibold text-xl'>{assignment?.course?.title}</span>
                </div>
    
                <div className='p-10 mt-8'>
    
                    <h2 className='text-[#002147] text-2xl capitalize font-semibold'>{assignment?.title}</h2>
    
                    <hr className='mt-6' />
    
                    <div className='mt-6 flex items-center justify-between'>
    
                        <div className='flex items-center text-lg gap-10'>
    
                            <span className='text-[#6E6E71] font-semibold'>Due Date : <span className='text-[#002147] font-semibold'>{formatDate(assignment?.dueDate)}</span> </span>
                            
                            <span className='text-[#6E6E71] font-semibold'>Time Remaining : <span className='text-[#002147] font-semibold'>{daysUntilDueDate(assignment?.dueDate)} Days Left</span> </span>
    
                        </div>
    
                        <span className='text-[#6E6E71] font-semibold text-lg'>Assignment Grade : <span className='text-[#002147] font-semibold'>{assignment?.mark}</span> </span>
    
                    </div>
    
                    <hr className='mt-6' />
    
                    <div className='mt-6'>
    
                        <span className='text-[#002147] font-semibold text-xl'>Assignment Instruction</span>
    
                        <div dangerouslySetInnerHTML={{ __html: assignment?.description }} className='w-[80%] mt-4 text-[#000000] text-xl' />
    
                    </div>
    
                    <hr className='mt-6' />
    
                    <div className='mt-6 flex items-center gap-4'>
    
                        <span className='text-[#002147] font-semibold text-xl'>Assignment File : </span>
    
                        <div className='mt-2 relative group'>

                            <button 
                                className="text-[#403685] font-semibold mb-2 text-xl underline relative"
                                onClick={() => downloadFile(assignment?.file?.filePath)}
                            >
                                {assignment?.file?.originalName}
                            </button>

                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                bg-[#403685] text-white text-sm px-3 py-1 rounded-lg opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Click to download file
                            </div>

                        </div>
    
                    </div>
    
                </div>
    
                <div className='p-6 flex items-end justify-end '>
                   {assignmentDateCheck?.isDuePassed ? <YellowBtn onClick={() => navigate(`/student-grades`)} text="View Grades" /> : <YellowBtn onClick={() => navigate(`/submit-assignment-submission/${assignmentId}/${courseId}`)} text="Start Assignment Submit" />}
                </div>
    
            </div> 
    
        </>
      )

    }    




export default AssignmentDetails