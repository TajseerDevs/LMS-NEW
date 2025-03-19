import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChangeSectionPreviewMutation } from '../store/apis/instructorApis'
import UploadContantModal from './UploadContantModal'
import { formatTimeWithLabels } from '../utils/formatTime'
import { MdModeEditOutline, MdSave, MdCancel, MdDelete } from "react-icons/md";
import { useChangeItemNameMutation, useDeleteCourseSectionMutation, useRemoveItemFromSectionMutation } from '../store/apis/courseApis'



const CourseSection = (
    {
    section,
    courseId,
    renameSection,
    addItem,
    deleteSection,
    renameItem,
    uploadAttachment, 
    deleteItem,
    saveCourseSections,
    setCourse,
    refetch ,
    setAttachmentVersion ,
    attachmentVersion
    }
) => {


  const { token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [deleteCourseSection] = useDeleteCourseSectionMutation()
  const [changeSectionPreview] = useChangeSectionPreviewMutation()
  const [changeItemName] = useChangeItemNameMutation()
  const [removeItemFromSection] = useRemoveItemFromSectionMutation()


  const [isPreviewed , setIsPreviewed] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityType , setActivityType] = useState("")
  const [isOpen , setIsOpen] = useState(false) 

  const [editItemId , setEditItemId] = useState(null)
  const [editedName , setEditedName] = useState("")


  const handleEditClick = (item) => {
    setEditItemId(item._id)
    setEditedName(item.name)
  }
  

  const handleNameChange = (e) => {
    setEditedName(e.target.value)
  }


  const handleCancelEdit = () => {
    setEditedName(section?.items?.find(i => i._id === editItemId)?.name || "")
    setEditItemId(null)
  }


  useEffect(() => {
    setIsPreviewed(section?.isPreviewed)
  } , [section , courseId])




  const handleDeleteSection = async (sectionId) => {
    
    try {
      await deleteCourseSection({ token, courseId, sectionId })
      refetch()
    } catch (error) {
      console.log(error)
    }

  }
  

  
  const handleNameUpdate = async (item) => {

    try {

      if (editedName !== item?.name) {

        await changeItemName({
          token,
          courseId,
          sectionId : section?._id,
          itemId: item?._id,
          name: editedName,
        })

      }

      refetch()
      setEditItemId(null)

    } catch (error) {
      console.log(error)
    }

  }



  const handleDeleteItem = async (itemId) => {
    
    try {
      await removeItemFromSection({ token, courseId, sectionId : section?._id, itemId })
      refetch()
    } catch (error) {
      console.log(error)
    }

  }
  


  const changeSectionPreviewFun = async (sectionId) => {
  
    try {
      await changeSectionPreview({token , courseId , sectionId })
      refetch()  
    } catch (error) {
      console.log(error)
    }

  }

    



  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-md">

      <div className="flex justify-between items-center mb-4">

        <input 
          type="text" 
          placeholder="Enter Section name" 
          className="w-[80%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={section?.name}
          onChange={(e) => renameSection(section?._id , e.target.value)}
        />

        <div className="flex items-center ml-4">

          <span className="text-md text-[#403685] font-semibold mr-4">Section preview</span>

          <label className="inline-flex items-center cursor-pointer">

            <input type="checkbox" className="sr-only peer" />

            <button className={`w-12 h-6 flex items-center bg-gray-300 rounded-full transition duration-300 ${isPreviewed ? 'bg-yellow-500' : ''}`} onClick={() => {changeSectionPreviewFun(section?._id)}}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${isPreviewed ? 'translate-x-6' : ''}`}/>
            </button>

          </label>

        </div>

      </div>

      <hr className="mb-4" /> 

      {section?.items?.length !== 0 && <div className="flex justify-between items-center mb-4">

        <button className="text-[#403685] font-semibold"  onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide Items' : 'Show Items'}
        </button>

      </div>}

      {isOpen && (

        <div className="space-y-4 mb-6">

          {section?.items && section?.items?.map((item) => (

            <div key={item?._id} className="flex cursor-pointer justify-between items-center p-4 bg-white border rounded-md shadow-sm">

              {editItemId === item?._id ? (

                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  className="text-[#002147] font-semibold w-[250px] p-1 capitalize border-b-2 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNameUpdate(item)
                    }
                  }}
                />
                
                ) : (

                <span className="text-[#002147] font-semibold capitalize">
                  {item?.name}
                </span>

              )}

              <div className="flex space-x-4">

                {editItemId === item?._id ? (
                  <>

                    <button onClick={() => handleNameUpdate(item)} className="text-[#4CAF50] py-1 px-3 border-2 font-semibold border-[#4CAF50] rounded-lg">
                      <MdSave size={22} />
                    </button>

                    <button onClick={handleCancelEdit} className="text-[#FF4141] py-1 px-3 border-2 font-semibold border-[#FF4141] rounded-lg">
                      <MdCancel size={22} />
                    </button>

                  </>

                ) : (

                  <button onClick={() => handleEditClick(item)} className="text-[#FFC200] py-1 px-3 border-2 font-semibold border-[#FFC200] rounded-lg">
                    <MdModeEditOutline size={22} />
                  </button>

                )}

                {editItemId !== item?._id && <button onClick={() => handleDeleteItem(item?._id)} className="text-red-500 py-1 px-3 border-2 font-semibold border-[#ff4141] rounded-lg"><MdDelete size={22}/></button>}

              </div>

            </div>

          ))}

        </div>

      )}

      <div className="flex justify-between items-center">

        <div className="flex space-x-4">
          <button onClick={() => {setIsModalOpen(true) ; setActivityType("Video")}} className="text-[#403685] border-2 border-[#403685] py-1 px-3 rounded-lg">+ Video</button>
          <button onClick={() => {setIsModalOpen(true) ; setActivityType("Image")}} className="text-[#403685] border-2 border-[#403685] py-1 px-3 rounded-lg">+ Image</button>
          <button onClick={() => {setIsModalOpen(true) ; setActivityType("Document")}} className="text-[#403685] border-2 border-[#403685] py-1 px-3 rounded-lg">+ Documents</button>
          <button onClick={() => {setIsModalOpen(true) ; setActivityType("Activity")}} className="text-[#403685] border-2 border-[#403685] py-1 px-3 rounded-lg">+ Activity</button>
        </div>

        <div className="flex space-x-4">
          <button onClick={() => handleDeleteSection(section?._id)} className="text-[#403685] rounded-lg px-3 font-semibold border-2 border-[#403685]">Delete Section</button>
          <button onClick={() => refetch()} className="bg-[#FFC200] text-[#002147] py-1 px-5 font-semibold rounded-lg">Save</button>
        </div>
      
      </div>

      {isModalOpen && <UploadContantModal setIsModalOpen={setIsModalOpen} courseId={courseId} refetch={refetch} section={section} activityType={activityType} setActivityType={setActivityType} isOpen={isModalOpen} setOpenItems={setIsOpen} onClose={() => setIsModalOpen(false)} /> }

    </div>
    
  )

}


export default CourseSection