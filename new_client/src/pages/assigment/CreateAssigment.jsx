import React, { useRef, useState } from 'react'
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { FiPlus } from "react-icons/fi";
import YellowBtn from '../../components/YellowBtn';
import PurpleBtn from '../../components/PurpleBtn';
import { useSelector } from 'react-redux';
import { useCreateAssignmentMutation } from '../../store/apis/assigmentApis';
import { useGetAllInstructorCoursesNoPagingQuery } from '../../store/apis/instructorApis';



const CreateAssigment = () => {

    const {token} = useSelector((state) => state.user)

    const [createAssignment , { isLoading, error }] = useCreateAssignmentMutation()
    const {data : instructorCourses} = useGetAllInstructorCoursesNoPagingQuery({token})

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [courseId, setCourseId] = useState("")
    const [mark, setMark] = useState("")
    const [dueDate, setDueDate] = useState("")
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


    const handleSubmit = async (e) => {

        e.preventDefault()
        
        if (!selectedFile) {
            return alert("Please upload an assignment file.")
        }
    
        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", description)
        formData.append("mark", mark)
        formData.append("dueDate", dueDate)
        formData.append("assignmentFile", selectedFile)
    
        try {

          await createAssignment({ token , courseId, formData }).unwrap()

          alert("Assignment created successfully!")

          setTitle("")
          setMark("")
          setCourseId("")
          setDescription("")
          setDueDate("")
          setSelectedFile(null)

        } catch (err) {
          console.error("Error creating assignment:", err)
        }

    }



  return (

    <div className="p-6">

        <h1 className='text-[#002147] font-semibold text-2xl'>Create Assignment</h1>
        
        {/* container div for both two columns */}
        <div className='mt-6 flex justify-between border-2 border-dotted border-gray-200 p-4 h-[1000px] w-[1700px]'>

            {/* left column */}
            <div className='flex flex-col '>

                <h3 className='text-[#797979] mb-12 mt-4 font-semibold text-2xl'>Assignment Information</h3>

                <div className='flex p-2 flex-col'>

                    <label className='text-[#002147] pl-2 text-lg font-semibold ' htmlFor="">Assignment Title</label>

                    <input
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} 
                        type="text" 
                        placeholder="Enter an assignment title" 
                        className="w-[1000px] p-4 mt-4 border border-gray-300 rounded-lg" 
                    />

                </div>

                <div className="mt-8 p-2">

                    <label className='text-[#002147] pl-2 text-lg font-semibold ' htmlFor="">Assignment Instructions</label>

                    <ReactQuill
                        value={description}
                        onChange={(value) => setDescription(value)}
                        placeholder="Write the assignment instruction"
                        className="mt-4 pl-2 rounded-lg w-[1000px] h-[300px]"
                    />
                
                </div>

                <div className="mt-16 p-2">

                    <label  className='text-[#002147] pl-2 text-lg font-semibold ' htmlFor="">Assignment File</label>

                    <div onClick={handleClick} className="border-dashed border-2 cursor-pointer border-gray-300 rounded-lg p-6 text-center w-[1000px] flex flex-col items-center mt-2">

                        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        
                        {selectedFile ? (
                            <div>

                                <p className="text-gray-600 font-semibold">
                                    Selected File: <span className="text-[#403685]">{selectedFile.name}</span>
                                </p>

                                <button>reset file</button>

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

            {/* right column */}
            <div>

                <div className='w-[400px] mr-12 h-[400px] mt-10 border-2 border-gray-200 rounded-lg'>

                    <h3 className='text-[#797979] mb-6 mt-4 text-left pl-6 font-semibold text-2xl'>Assignment Setting</h3>

                    <div className='flex gap-2 flex-col p-4'>
                        <label className='ml-1' htmlFor="">Assignment Grade</label>
                        <input name='mark' value={mark} onChange={(e) => setMark(e.target.value)} type="number" min={0} className='w-[90%] p-2 rounded-lg' placeholder='Grade' />
                    </div>

                    <div className='flex gap-2 flex-col p-4'>
                        <label className='ml-1' htmlFor="">Due Date</label>
                        <input name='dueDate' value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className='w-[90%] p-2 rounded-lg' />
                    </div>

                    <div className='flex gap-2 flex-col p-4'>

                        <label className='ml-1' htmlFor="">Course Name</label>

                        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className='w-[90%] p-3' name="courseId">
                        
                            <option value="" disabled selected>Choose course</option>
                        
                            {instructorCourses?.map((course) => (
                                <option key={course?._id} value={course?._id}>{course?.title}</option>
                            ))}
                        
                        </select>
                        
                    </div>

                </div>

            </div>

        </div>
        
        <div className='mt-6 w-[1700px] flex items-center justify-between'>

            <button className='text-[#403685] font-semibold capitalize text-lg'>cancel</button>

            <div className='flex items-center gap-5'>

                <PurpleBtn text="save as draft" />
                <YellowBtn onClick={handleSubmit} text="Assign & Share" icon={FiPlus} />

            </div>

        </div>

    </div>

  )

}


export default CreateAssigment