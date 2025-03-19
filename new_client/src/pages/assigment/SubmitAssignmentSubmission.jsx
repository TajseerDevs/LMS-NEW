import React, { useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import YellowBtn from '../../components/YellowBtn'


const SubmitAssignmentSubmission = () => {

    const navigate = useNavigate()

    const [assignmentText , setAssignmentText] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    
    const fileInputRef = useRef(null)
    
    const handleClick = () => {
        fileInputRef.current?.click()
    }
    
    
    const handleFileChange = (event) => {
         
        const file = event.target.files[0]
         
        if (file) {
            setSelectedFile(file)
        }
    
    }


  return (
    <div className='p-2'>

        <div className='bg-white h-[80px] ml-1 flex items-center gap-8 p-6 w-full'>
            <button onClick={() => navigate(`/view-assignment-details/12312131/9786857576`)} className='flex text-[#FFC200] font-semibold text-xl items-center gap-2'><FaArrowLeft className='mt-1' size={22}/> Back</button>
            <span className='text-[#403685] font-semibold text-xl'>Assignment Submission</span>
        </div>

        <div className='p-10 mt-8'>

            <h2 className='text-[#002147] text-2xl font-semibold'>Assignment Name</h2>

            <hr className='mt-6' />
        
            <div className='mt-6 flex items-center justify-between'>

                <div className='flex items-center text-lg gap-10'>

                    <span className='text-[#6E6E71] font-semibold'>Due Date : <span className='text-[#002147] font-semibold'>March 15 2025</span> </span>
                    
                    <span className='text-[#6E6E71] font-semibold'>Time Remaining : <span className='text-[#002147] font-semibold'>13 days</span> </span>

                </div>

                <span className='text-[#6E6E71] font-semibold text-lg'>Assignment Grade : <span className='text-[#002147] font-semibold'>10 Marks</span> </span>

            </div>

            <hr className='mt-6' />

            <div className='mt-6'>
            
                <span className='text-[#002147] font-semibold ml-3 text-xl'>Assignment answer form</span>

                <div className='p-3 relative w-[70%]'>
                
                    <ReactQuill value={assignmentText} onChange={(value) => setAssignmentText(value)} className='h-56 mt-2'/>
 
                </div>

            </div>

            <div className='mt-16 p-4'>

                <span className='text-[#002147] font-semibold text-xl'>Assignment File</span>

                <div onClick={handleClick} className="border-dashed border-2 cursor-pointer border-gray-300 rounded-lg p-6 text-center mt-4 w-[70%] flex flex-col items-center">

                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    </div>

                    {selectedFile ? (
                        <div>

                            <p className="text-gray-600 font-semibold">
                                Selected File: <span className="text-[#403685]">{selectedFile.name}</span>
                            </p>

                            <button className='bg-red-500 mt-2 rounded-lg capitalize px-5 py-1' onClick={(e) => {e.stopPropagation() ; setSelectedFile(null)}}>reset file</button>

                        </div>
                        ) : (
                        <>

                            <p className="text-gray-600">
                                Explore and pick a file from{" "}
                                <span className="text-[#403685] font-semibold">Browse</span>
                            </p>

                            <p className="text-gray-500 text-sm">Supported file formats: PDF, DOCX, PPTX</p>

                            <button
                                type="button"
                                className="mt-3 text-[#403685] font-semibold border-2 border-[#403685] px-5 py-1 rounded-lg"
                            >
                                Select files
                            </button>

                        </>
                    )}

                    <input onChange={handleFileChange} type="file" ref={fileInputRef} className="hidden" />

                </div>
            
            </div>

        </div>
        
        <div className='p-6 mt-12 flex w-[100%] items-end justify-end'>
            <YellowBtn onClick={() => navigate(`/submit-assignment-submission/123434214133/67ada2dbb22c8ec372e03ec2`)} text="Submit Assignment" />
        </div>

    </div>
  )

}



export default SubmitAssignmentSubmission