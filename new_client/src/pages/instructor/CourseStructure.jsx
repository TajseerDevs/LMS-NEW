import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IoAddOutline } from "react-icons/io5"
import { FaEye } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

import CourseSection from '../../components/CourseSection'

import {
  setCourseData ,
  addSectionToCourse ,
  addItemToSection ,
  renameItemInSection ,
  renameSection as renameSectionAction,
  addAttachmentToItem ,
  deleteSection as deleteSectionAction,
  deleteItem as deleteItemAction ,
} from "../../store/slices/instructorSlice"



import { 
  useDeleteCourseSectionMutation ,
  useRemoveItemFromSectionMutation ,
  useGetCourseByIdQuery ,
  useModifyCourseSectionMutation ,
  useModifyItemInSectionMutation ,
  useChangeItemNameMutation ,
  useChangeSectionNameMutation
} from '../../store/apis/courseApis'


import { 
  useUploadScromMutation ,
  useAddItemToSectionMutation ,
  useAddSectionToCourseMutation ,
  useUploadContentFileMutation
} from '../../store/apis/instructorApis'





const CourseStructure = () => {
 
  const { token } = useSelector((state) => state.user)
  const params = useParams()
  
  const { courseId } = params

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [course , setCourse] = useState({
    sections: []
  })

  const [attachmentVersion , setAttachmentVersion] = useState('1.2')


  const { data , error , isLoading , refetch } = useGetCourseByIdQuery({ courseId , token })


  useEffect(() => {
    if (data) {
      setCourse(data)
      dispatch(setCourseData({ courseId, sections: data.sections }))
    }
  }, [data , dispatch , location])


  useEffect(() => {
    if(location?.state?.changed){
      refetch()
    }
  } , [location.state])


  useEffect(() => {
    if(courseId){
      refetch()
    }
  } , [courseId , location.state])




  const [uploadScrom] = useUploadScromMutation()

  const [addItemToSectionFun] = useAddItemToSectionMutation()
  const [addSectionToCourseFun] = useAddSectionToCourseMutation()

  const [changeSectionName] = useChangeSectionNameMutation()
  const [changeItemName] = useChangeItemNameMutation()
  



  const handleAddSection = async () => {
    
    const lastSection = course.sections[course.sections.length - 1]

    if (lastSection && lastSection.items.length === 0) {
      return alert('Add at least one item to the last section before adding a new one.')
    }
    
    
    try {
      
      const newSection = { _id: uuidv4(), name: 'New Section', items: [] }
      const response = await addSectionToCourseFun({courseId , token , name : newSection.name , items : newSection.items}).unwrap()
      
      setCourse(response)
  
      dispatch(setCourseData({ courseId, sections: response.sections }))
      dispatch(addSectionToCourse({ courseId, section: newSection }))
  
      await refetch()
      alert('new section added successfully')

    } catch (error) {
      console.log(error)
    }

  }




  const handleRenameSection = async (sectionId , newName) => {
    
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.map(section => section._id === sectionId ? { ...section, name: newName } : section)
    }))

    dispatch(renameSectionAction({ courseId, sectionId, newName }))
    
    try {
      
      await changeSectionName({ token, courseId, sectionId, name: newName }).unwrap()
      
    } catch (error) {
      console.log(error)
    }
  
  }





  const handleAddItem = async (sectionId, type) => {

    let newItem = { _id: uuidv4(), type, name: `New ${type} item`, attachments: [] }

    const response = await addItemToSectionFun({courseId , sectionId , token , name : newItem.name , type , attachments : newItem.attachments}).unwrap()

    setCourse(response)

    dispatch(addItemToSection({ courseId, sectionId, item: newItem }))
  
    dispatch(setCourseData({ courseId, sections: response.sections }))
  
  }





  return (
    <div className='p-6'>
      
      <div className='flex mb-5 w-[60%] justify-between items-center'>
        
        <h1 className='text-4xl capitalize font-semibold text-[#002147]'>course structure</h1>

        <button onClick={() => navigate(`/course/main-page/${courseId}`)} className='flex items-center gap-2 capitalize rounded-lg bg-[#FFC200] text-[#002147] font-semibold py-2 px-5'><FaEye size={22}/> preview course</button>

      </div>


      {data?.sections?.length === 0 && 

        (
          <div className='p-6 flex flex-col justify-center items-center mt-[16vw]'>

            <span className='text-[#002147] text-3xl font-semibold capitalize'>Start building your course!</span>
            <span className='text-[#797979] text-center p-2 text-lg mt-2'>Add Sections, Items , and Activity to get started</span>

            <button onClick={handleAddSection} className='flex bg-[#ECEBFE] text-[#403685] font-semibold px-5 py-1 mt-4 rounded-lg items-center gap-2 transition-all duration-300 hover:scale-90 cursor-pointer'>
              <IoAddOutline className='text-[#403685] font-semibold'/>
              Add Section
            </button>

          </div>

        )
      
      }


      {
        data?.sections?.length !== 0 && 
          
          (

            <div className='w-[60%] flex flex-col gap-10 p-2 mt-10'>
              
              {course?.sections?.map((section) => (

                <CourseSection
                  key={section?._id}
                  section={section}
                  courseId={courseId}
                  setCourse={setCourse}
                  refetch={refetch}
                  renameSection={handleRenameSection}
                  addItem={handleAddItem}
                />

              ))}

            </div>

          )

        }

        
          {data?.sections?.length !== 0 && (
            <div className='w-[60%] p-2 mt-6'>
              <button onClick={handleAddSection} className='flex items-center font-semibold gap-1 text-[#403685] capitalize ml-auto'><IoAddOutline size={22} className='text-[#403685] font-semibold'/> add section</button>
            </div>
          )
        }

    </div>

  )

}


export default CourseStructure