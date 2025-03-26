import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import YellowBtn from '../../components/YellowBtn'
import { useSelector } from 'react-redux'
import { useGetAssignmentDetailsQuery, useGetAssignmentSubmissionQuery, useSubmitAssignmentSubmissionMutation, useUpdateSubmissionMutation } from '../../store/apis/assigmentApis'
import formatDate from '../../utils/formatDate'
import { daysUntilDueDate } from '../../utils/daysUntilDueDate'
import { FiUpload } from "react-icons/fi"
import { MdCancel } from "react-icons/md";



const SubmitAssignmentSubmission = () => {

    const baseUrl = `http://10.10.30.40:5500`

    const {assignmentId , courseId} = useParams()
    const navigate = useNavigate()
    
    const {token} = useSelector((state) => state.user)

    const [assignmentText , setAssignmentText] = useState("")

    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)
    
    const [newSelectedFile , setNewSelectedFile] = useState(null)
    const newFileInputRef = useRef(null)

    const {data : assignment , isLoading} = useGetAssignmentDetailsQuery({token , assignmentId})
    const {data : assignmentPrevSubmission , isLoading : isLoadingPrevSubmission , refetch} = useGetAssignmentSubmissionQuery({token , assignmentId})

    const [submitAssignmentSubmission, { isLoading : isLoadingSubmit , error }] = useSubmitAssignmentSubmissionMutation()
    const [updateAssignmentSubmission, { isLoading : isLoadingUpdate }] = useUpdateSubmissionMutation()


    useEffect(() => {
        if (assignmentPrevSubmission) {
            setAssignmentText(assignmentPrevSubmission?.answerText || "")
            setSelectedFile(assignmentPrevSubmission?.submissionFile || null)
        }
    }, [assignmentPrevSubmission])


    
    const handleClick = () => {
        fileInputRef.current?.click()
    }
    
    
    const handleFileChange = (event) => {
         
        const file = event.target.files[0]
         
        if (file) {
            setSelectedFile(file)
        }
    
    }



    const handleNewFileChange = (event) => {
         
        const file = event.target.files[0]
         
        if (file) {
            setNewSelectedFile(file)
        }
    
    }



    const handleSubmit = async (e) => {

        try {

            e.preventDefault()
            const formData = new FormData()
            
            if(assignmentText.trim().length > 0){
                formData.append("answerText" , assignmentText)
            }

            if(selectedFile !== null){
                formData.append("submissionFile" , selectedFile)
            }

            const response = await submitAssignmentSubmission({ assignmentId, courseId, formData, token }).unwrap()

            setAssignmentText("")
            setSelectedFile(null)

            refetch()

        } catch (error) {
            console.log(error)
        }

    }




    const updateAssignmentSubmissionFun = async () => {

        if(newSelectedFile === null && assignmentText === assignmentPrevSubmission?.answerText){
            return alert("provide new assignement text or file to update the submission")
        }

        try {

            const formData = new FormData()
            
            if(assignmentText !== assignmentPrevSubmission?.answerText){
                formData.append("answerText" , assignmentText)
            }

            if(newSelectedFile !== null){
                formData.append("submissionFile" , newSelectedFile)
            }

            await updateAssignmentSubmission({ assignmentId , submissionId : assignmentPrevSubmission?._id , formData , token }).unwrap()

            setNewSelectedFile(null)
            refetch()

        } catch (error) {
            console.log(error)
        }

    } 



    const previousFileName = assignmentPrevSubmission?.submissionFile?.originalName
    const previousFilePath = assignmentPrevSubmission?.submissionFile?.filePath
    const fullFilePath = previousFilePath ? `${baseUrl}${previousFilePath}` : null



    if(isLoadingPrevSubmission || isLoadingSubmit || isLoadingUpdate || isLoading){
        return <h1 className='p-10'>Loading...</h1>
    }




  return (

    <div className='p-2'>

        <div className='bg-white h-[80px] ml-1 flex items-center gap-8 p-6 w-full'>
            <button onClick={() => navigate(`/view-assignment-details/${assignmentId}/${courseId}`)} className='flex text-[#FFC200] font-semibold text-xl items-center gap-2'><FaArrowLeft className='mt-1' size={22}/> Back</button>
            <span className='text-[#403685] font-semibold text-xl'>Assignment Submission</span>
        </div>

        <div className='p-10 mt-8'>

            <h2 className='text-[#002147] text-2xl capitalize font-semibold'>{assignment?.title}</h2>

            <hr className='mt-6' />
        
            <div className='mt-6 flex items-center justify-between'>

                <div className='flex items-center text-lg gap-10'>

                    <span className='text-[#6E6E71] font-semibold'>Due Date : <span className='text-[#002147] font-semibold'>{formatDate(assignment?.dueDate)}</span> </span>
                    
                    <span className='text-[#6E6E71] font-semibold'>Time Remaining : <span className='text-[#002147] font-semibold'>{daysUntilDueDate(assignment?.dueDate)} Days Left</span> </span>

                </div>

                <span className='text-[#6E6E71] font-semibold text-lg'>Assignment Grade : <span className='text-[#002147] font-semibold'>{assignment?.mark} Marks</span> </span>

            </div>

            <hr className='mt-6' />

            <div className='mt-6'>
            
                <span className='text-[#002147] font-semibold ml-3 text-xl'>Assignment answer form</span>

                <div className='p-3 relative w-[70%]'>
                
                    <ReactQuill value={assignmentText} onChange={(value) => {setAssignmentText(value)}} className='h-56 text-[22px] mt-2'/>
 
                </div>

            </div>

            <div className='mt-16 p-4'>

                <span className='text-[#002147] font-semibold text-xl'>Assignment File</span>

                {previousFileName && fullFilePath ? (

                    <div className="mt-4 flex items-center gap-5">

                        <p className="text-gray-600 font-semibold text-xl">
                            Current uploaded File : <a href={fullFilePath} target="_blank" className="text-[#403685] font-semibold text-xl">{previousFileName}</a>
                        </p>

                        <div className="flex items-center space-x-3">

                            <button
                                onClick={() => newFileInputRef?.current?.click()}
                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                                title="Replace File"
                            >

                                <FiUpload size={22} />

                            </button>

                            <input
                                type="file"
                                ref={newFileInputRef}
                                className="hidden"
                                onChange={handleNewFileChange}
                            />

                            {newSelectedFile && (
                                <p className="text-[#403685] font-semibold flex items-center gap-1 text-sm">New Selected File : {newSelectedFile.name} <MdCancel onClick={() => setNewSelectedFile(null)} size={20} className='text-[#403685] cursor-pointer mt-0.5'/> </p>
                            )}

                        </div>

                    </div>

                ) : (

                <div onClick={handleClick} className="border-dashed border-2 cursor-pointer border-gray-300 rounded-lg p-6 text-center mt-4 w-[70%] flex flex-col items-center">

                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>

                {selectedFile ? (

                    <div>

                        <p className="text-gray-600 font-semibold">
                            Selected File: <span className="text-[#403685]">{selectedFile.name}</span>
                        </p>

                        <button className='bg-red-500 mt-2 rounded-lg capitalize px-5 py-1' onClick={(e) => {e.stopPropagation(); setSelectedFile(null)}}>reset file</button>

                    </div>
                    ) : (
                    <>
                        <p className="text-gray-600">Explore and pick a file from <span className="text-[#403685] font-semibold">Browse</span></p>
                        <p className="text-gray-500 text-sm">Supported file formats: PDF, DOCX, PPTX</p>
                        <button type="button" className="mt-3 text-[#403685] font-semibold border-2 border-[#403685] px-5 py-1 rounded-lg">
                            Select files
                        </button>
                    </>
                )}
                    <input onChange={handleFileChange} type="file" ref={fileInputRef} className="hidden" />

                </div>
            )}

            </div>

        </div>
        

        <div className='p-6 mt-12 flex w-[100%] items-end justify-end'>
            {assignmentPrevSubmission?._id ? <YellowBtn disabled={isLoadingSubmit} onClick={updateAssignmentSubmissionFun} text="Update Assignment" /> : <YellowBtn disabled={isLoadingSubmit} onClick={handleSubmit} text="Submit Assignment" />}
        </div>

    </div>

  )

}



export default SubmitAssignmentSubmission