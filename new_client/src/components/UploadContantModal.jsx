import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useParams , useNavigate , useLocation } from 'react-router-dom'

import { useAddItemToSectionMutation, useUploadContentFileMutation, useUploadScromMutation } from '../store/apis/instructorApis'

import {
    setCourseData ,
    addSectionToCourse ,
    addItemToSection ,
    renameItemInSection ,
    renameSection as renameSectionAction,
    addAttachmentToItem ,
    deleteSection as deleteSectionAction,
    deleteItem as deleteItemAction ,
} from "../store/slices/instructorSlice"

import { useChangeItemNameMutation, useChangeSectionNameMutation } from '../store/apis/courseApis'





const UploadContantModal = ({isOpen , onClose , activityType , setActivityType , section , refetch , courseId , setIsModalOpen , setOpenItems}) => {
    
    const { token } = useSelector((state) => state.user)

    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const [itemName , setItemName] = useState('')
    const [attachmentVersion, setAttachmentVersion] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    
    const [estimatedTime, setEstimatedTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    })


    if (!isOpen) return null

    const supportedFormats = {
        Video: ".mp4",
        Image: ".jpg, .png , .jpeg",
        Document: ".pdf, .docx , .txt",
        Activity : ".scorm"
    }

    const fileTypes = supportedFormats[activityType] || ".mp4"

    const [uploadScrom] = useUploadScromMutation()

    const [addItemToSectionFun] = useAddItemToSectionMutation()
    const [uploadContentFile] = useUploadContentFileMutation()
    const [changeSectionName] = useChangeSectionNameMutation()
    const [changeItemName] = useChangeItemNameMutation()

    const handleAttachmentChange = (itemId, field, value) => {
        setAttachmentState(prevState => ({
            ...prevState,
            [itemId]: {
                ...prevState[itemId],
                [field]: value
            }
        }))
    }


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setEstimatedTime((prev) => ({
          ...prev,
          [name]: value
        }));
      };



    const handleAddItem = async (type) => {
        
        if (!itemName || !type || !selectedFile) {
            alert("All fields are required.")
            return
        }

        const formData = new FormData()

        formData.append("type", type)
        formData.append("name", itemName)
        formData.append("scormPackage", selectedFile)
        formData.append("version", attachmentVersion)
        formData.append("hours", estimatedTime.hours)
        formData.append("minutes", estimatedTime.minutes)
        formData.append("seconds", estimatedTime.seconds)

        try {
            await addItemToSectionFun({ courseId, sectionId : section?._id, formData , token }).unwrap()
            await refetch()
            setOpenItems(true)
            setActivityType("")
            setIsModalOpen(false)
            setAttachmentVersion("")
            setEstimatedTime({hours : 0 , minutes : 0 , seconds : 0})
            setSelectedFile(null)
        } catch (error) {
            console.log(error)
        }

    }




    const handleAddContentItem = async (type) => {
        
        if (!itemName || !type || !selectedFile) {
            alert("All fields are required.")
            return
        }

        const formData = new FormData()

        formData.append("type", type)
        formData.append("name", itemName)
        formData.append("contentFile", selectedFile)
        formData.append("hours", estimatedTime.hours)
        formData.append("minutes", estimatedTime.minutes)
        formData.append("seconds", estimatedTime.seconds)

        try {
            await uploadContentFile({ courseId, sectionId : section?._id, formData , token }).unwrap()
            await refetch()
            setOpenItems(true)
            setActivityType("")
            setIsModalOpen(false)
            setAttachmentVersion("")
            setEstimatedTime({hours : 0 , minutes : 0 , seconds : 0})
            setSelectedFile(null)
        } catch (error) {
            console.log(error)
        }

    }









  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">

        <div className="bg-white rounded-lg w-[850px] p-6 relative">

        <h2 className="text-2xl font-bold mb-4">Upload {activityType}</h2>

        <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
        > 
            &times;
        </button>

        {activityType === "Activity" && <div className="mb-4 w-full">

            <label className="block text-gray-700 font-semibold mb-1">SCORM Version</label>

            <select 
                value={attachmentVersion}
                onChange={(e) => setAttachmentVersion(e.target.value)}
                className="w-full border rounded px-3 py-2"
            >
                <option value="" disabled>Select a SCORM file from your files</option>
                <option value="1.2">1.2</option>
                <option value="2004">2004</option>
            </select>

        </div> }

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">

            <img
                // src="https://via.placeholder.com/150"
                alt="Video Placeholder"
                className="mx-auto mb-4"
            />

            <p className="text-lg font-semibold">Explore and pick a file from <span className="text-[#403685] cursor-pointer">Browse</span></p>
            <p className="text-gray-500">Supported file format {fileTypes}</p>

            <input type="file" onChange={handleFileChange} />

        </div>

        <div className="mb-4">

            <label className="block text-gray-700 font-semibold mb-1">{activityType} Title</label>

            <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={`Add ${activityType} Title`}
                className="w-full border rounded px-3 py-2"
            />

        </div>

        <div className="mb-8 mt-2">

            <label className="block text-gray-700 font-semibold mb-1">{activityType} Estimated time</label>

            <div className='flex items-center gap-4'>
                
                <label className='flex items-center gap-4'>
                    Hours :

                    <input
                        type="number"
                        name="hours"
                        value={estimatedTime.hours}
                        onChange={handleTimeChange}
                        min="0"
                        className='mr-3 border-2 p-2'
                    />

                </label>

                <label className='flex items-center gap-4'>

                    Minutes :

                    <input
                        type="number"
                        name="minutes"
                        value={estimatedTime.minutes}
                        onChange={handleTimeChange}
                        min="0"
                        max="59"
                        className='mr-3 border-2 p-2'
                    />

                </label>

                <label className='flex items-center gap-4'>

                    Seconds :

                    <input
                        type="number"
                        name="seconds"
                        value={estimatedTime.seconds}
                        onChange={handleTimeChange}
                        min="0"
                        max="59"
                        className='mr-3 border-2 p-2'
                    />

                </label>

            </div>

        </div>

        <div className="flex justify-end mt-2 gap-4">

            <button className="px-4 py-2 border-2 border-[#403685] rounded-lg font-semibold text-[#403685]" onClick={onClose}>
                Discard
            </button>

            {
                activityType === "Activity" ? 
                (
                    <button onClick={() => handleAddItem(activityType)} className="px-5 py-2 font-semibold bg-[#FFC200] text-[#002147] rounded-lg">
                        Upload
                    </button>

                )
                :
                (
                    <button onClick={() => handleAddContentItem(activityType)} className="px-5 py-2 font-semibold bg-[#FFC200] text-[#002147] rounded-lg">
                        Upload Content
                    </button>
                )
            }

        </div>

    </div>

  </div>

  )

}


export default UploadContantModal