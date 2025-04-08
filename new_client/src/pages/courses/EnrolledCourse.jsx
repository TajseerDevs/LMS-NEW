import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { FaChevronRight , FaAngleRight, FaChevronLeft , FaAngleDown , FaPlayCircle, FaFileAlt, FaImage, FaTasks, FaStar, FaFilter, FaArrowRight, FaPlus  } from "react-icons/fa"
import { MdModeEdit , MdDelete } from "react-icons/md";
import { FaClock } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";


import sections from '../../data/sections'
import testImg from "../../assets/test.png"
import { FiArrowRight, FiImage , FiMessageCircle  } from "react-icons/fi"
import FAQS from '../../components/FAQS'
import FaqModal from '../../components/FaqModal'
import { IoIosArrowDown , IoIosArrowForward  } from "react-icons/io";
import { MdEdit , MdDeleteForever  } from "react-icons/md";
import DeleteNoteModal from '../../components/DeleteNoteModal'
import {axiosObj} from "../../utils/axios"
import {useGetCourseCompletionPercentageQuery , useCheckFeedbackStatusQuery, useSetCourseLastProgressMutation, useGetCourseLastProgressQuery, useGetAllRemindersQuery, useDeleteReminderMutation, useAddNoteMutation, useGetAllNotesForCourseQuery, useUpdateNoteMutation, useDeleteNoteMutation} from "../../store/apis/studentApis"
import { useIncrementAttachmentViewMutation , useIncrementSectionViewMutation } from '../../store/apis/courseApis'
import { useGetCourseLastestQuizzesQuery } from '../../store/apis/quizApis'
import { formatTimeWithLabels } from '../../utils/formatTime'
import getTotalTime from '../../utils/getTotalTime'
import { useSetScormLogsMutation } from '../../store/apis/scormApis'
import CourseRatePopUp from '../../components/CourseRatePopUp'
import ReviewCard from '../../components/ReviewCard'
import ReportFeedbackPopUp from '../../components/ReportFeedbackPopUp'
import YellowBtn from "../../components/YellowBtn"

import { PiExport } from "react-icons/pi";

import quizSvg from "../../assets/quiz-svg.svg"
import assignmentSvg from "../../assets/purple-assigment.svg"
import reminderSvg from "../../assets/reminderSvg.svg"
import CourseReminderModal from '../../components/CourseReminderModal'
import { formatQuizDuration } from '../../utils/formatQuizDuration'
import formatDate from '../../utils/formatDate'
import { useGetCourseLatestAssignmentsQuery } from '../../store/apis/assigmentApis'
import DeleteReminderModal from '../../components/DeleteReminderModal'
import { toast } from 'react-toastify'

// ! add a check that runs directly when any user enter this page to check if he enrolled in this course or not if not navigate him to single course page (not enrolled student)



const EnrolledCourse = () => {

    const params = useParams()
    const navigate = useNavigate()
    const courseId = params.courseId
    
    const { token , user } = useSelector((state) => state.user)

    const [course, setCourse] = useState(null)
    const [error, setError] = useState(null)

    const [launchUrl, setLaunchUrl] = useState("")
    const [defaultLaunchUrl, setdefaultLaunchUrl] = useState("https://www.youtube.com/embed/ZCX9u9KZS")
    const [prevLaunchUrl, setPrevLaunchUrl] = useState(null)
    

    const [attachmentId, setAttachmentId] = useState("")
    const [expandedSections, setExpandedSections] = useState([])
    const [attachment, setAttachment] = useState({})
    const [globalAttachments, setGlobalAttachments] = useState([])
    const [showIframe, setShowIframe] = useState(false)
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)
    const [iframeOpenedAt, setIframeOpenedAt] = useState(null) 
    const [isVideoItem , setIsVideoItem] = useState(false)
    const [activeTab, setActiveTab] = useState("iframe")
    const [courseSections, setCourseSections] = useState([])
    const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false)
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [activeReplyInput, setActiveReplyInput] = useState(null)

    const [newQuestion, setNewQuestion] = useState("")
    const [answerState, setAnswerState] = useState({})
    const [selectedSection , setSelectedSection] = useState('')
    const [selectedItem , setSelectedItem] = useState('')

    const [selectedTab , setSelectedTab] = useState('')

    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)

    const [isCourseRateModalOpen , setIsCourseRateModalOpen] = useState(false)
    const [isFeedbackReportModalOpen , setIsFeedbackReportModalOpen] = useState(false)
    const [isCourseReminderModalOpen , setIsCourseReminderModalOpen] = useState(false)

    const [isExpanded , setIsExpanded] = useState()
    const [activeSectionIndex , setactiveSectionIndex] = useState()

    const [hasProvidedFeedback, setHasProvidedFeedback] = useState(false)

    const [hasRated, setHasRated] = useState(false)
    const [hasFeedback, setHasFeedback] = useState(false)

    const [ratingType, setRatingType] = useState("")
    const [sortBy, setsortBy] = useState("")
    const [reminderFilter, setReminderFilter] = useState("")
    const [editingReminder, setEditingReminder] = useState(null)
    const [isDeleteRminderModalOpen, setIsDeleteRminderModalOpen] = useState(false)
    const [reminderToDelete, setReminderToDelete] = useState(null) 

    const [quizTabPage , setQuizTabPage] = useState(1)
    const [assignmentTabPage , setAssignmentTabPage] = useState(1)
    const [reminderTabPage , setReminderTabPage] = useState(1)
    const [notesTabPage , setNotesTabPage] = useState(1)

    const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false)



    const [notes , setNotes] = useState([
        { id: 1, title: "Note #1", content: "The Art of UX/UI Design Great design isn't just about aesthetics; it's about experience. Every interaction should feel intuitive, every transition seamless, and every color intentional.Tips for Impactful Design:" },
        { id: 2, title: "Note #2", content: "The Art of UX/UI Design Great design isn't just about aesthetics; it's about experience. Every interaction should feel intuitive, every transition seamless, and every color intentional.Tips for Impactful Design:" },
        { id: 3, title: "Note #3", content: "The Art of UX/UI Design Great design isn't just about aesthetics; it's about experience. Every interaction should feel intuitive, every transition seamless, and every color intentional.Tips for Impactful Design:" },
    ])

    const [noteText , setNoteText] = useState("")

    const [expandedNotes, setExpandedNotes] = useState({})
    const [editingNoteId, setEditingNoteId] = useState(null)
    const [editedContent, setEditedContent] = useState("")
    const [deleteNoteId, setDeleteNoteId] = useState(null)

    const openDeleteModal = (id) => setDeleteNoteId(id)
    const closeDeleteModal = () => setDeleteNoteId(null)


    const { data: courseCompletionData, isLoading, isError, refetch } = useGetCourseCompletionPercentageQuery({ token , courseId },
      // { skip: user?.role !== 'student' }
    )

    const {data : isFeedbackProvided} = useCheckFeedbackStatusQuery({token , courseId})

    const [setScormLogs] = useSetScormLogsMutation()
    const [incrementSectionView] = useIncrementSectionViewMutation()
    const [incrementAttachmentView] = useIncrementAttachmentViewMutation()
    const [setCourseLastProgress] = useSetCourseLastProgressMutation()
    const [deleteReminder] = useDeleteReminderMutation()
    const [addNote] = useAddNoteMutation()
    const [updateNote] = useUpdateNoteMutation()
    const [deleteNote] = useDeleteNoteMutation()


    const {data : courseLastQuizzes , isLoading : isLoadingLastQuizzes} = useGetCourseLastestQuizzesQuery({token , page : quizTabPage , courseId} , {skip : selectedTab !== "Quiz"})
    const {data : courseLastAssignments} = useGetCourseLatestAssignmentsQuery({token , page : assignmentTabPage , courseId} , {skip : selectedTab !== "Assignment"})
    const {data : courseLastProgress} = useGetCourseLastProgressQuery({token , courseId})
    const {data : courseReminders , refetch : refetchCourseReminders} = useGetAllRemindersQuery({token , courseId , page : reminderTabPage} , {skip : selectedTab !== "Reminder"})
    const {data : courseNotes , refetch : refetchCourseNotes} = useGetAllNotesForCourseQuery({token , courseId , page : notesTabPage} , {skip : selectedTab !== "Notes"})



    // to not open the course rate pop up if the user already provide a feedback 
    useEffect(() => { 

        setHasRated(isFeedbackProvided?.hasRated)
        setHasFeedback(isFeedbackProvided?.hasFeedback)

    } , [])



    useEffect(() => {

        // ! TODO use this if statment when create the check api that check if user provide a feedback for the course when he finish it
        // if (courseCompletionData?.completionPercentage === 100 && !hasProvidedFeedback) { 
        //     setIsCourseRateModalOpen(true)
        // }

        // ! TODO temprory one , will be deleted
        // if (courseCompletionData?.progress === "100.00%" && !hasFeedback && !hasRated) {
        //     setIsCourseRateModalOpen(true)
        // }

    } , [courseCompletionData, ])



    useEffect(() => {
        
    } , [selectedSection])
    



    useEffect(() => {

        const fetchCourse = async () => {

            try {
                
                const response = await axiosObj.get(`/courses/${courseId}` , {
                    headers : {
                            Authorization : `Bearer ${token}`
                        }
                })

                const courseData = response.data
                setCourse(courseData)

                const sections = courseData?.sections ?? []
                setCourseSections(sections)

                const attachments = courseData?.sections?.flatMap((section) => 
                    section?.items?.flatMap((item) => 
                        item?.attachments?.filter((attachment) => attachment?.launchUrl?.trim()).map((attachment) => ({
                            ...attachment,
                            itemName: item.name,
                            sectionId: section._id,
                        }))
                    )
                ) ?? []

                setGlobalAttachments(attachments)

            } catch (error) {
                console.log(error)
            }

        }

        if (user?.role === "student") {
            refetch()
        }

        fetchCourse()

    } , [courseId , token])





    const handleAttachmentClick = async (attachmentId , item , section) => {

        setIframeOpenedAt(Date.now())
        refetch()
        
        if (item?.type === "Video") {
            setIsVideoItem(true)
            alert("This video will be marked as completed when complete 90% of its duration automatically.")
        }
        
        try {

            const downloadResponse = await axiosObj.get(`/courses/download/${attachmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const newLaunchUrl = `http://10.10.30.40:5500${downloadResponse.data.launchUrl}`

            if (newLaunchUrl !== prevLaunchUrl) {
                setLaunchUrl(newLaunchUrl)
                setPrevLaunchUrl(newLaunchUrl)
            }
            
            const launchUrl = downloadResponse.data.launchUrl
            setLaunchUrl(`http://10.10.30.40:5500${launchUrl}`)
            setAttachmentId(attachmentId)
            
            const response = await axiosObj.get(`/courses/item-attachment/${attachmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            
            setAttachment(response.data)

            console.log()

            await setCourseLastProgress({token , courseId , sectionId : selectedSection?._id || section?._id , itemId : item?._id , attachmentId})

            await incrementAttachmentView({token , courseId , sectionId: selectedSection?._id || section?._id , attachmentId})

        } catch (error) {
            console.log(error)
        }
    
    }



    useEffect(() => {

        const openCourseLastProgress = async () => {
            try {
                await openAttachmentById(courseLastProgress?.courseLastProgress , courseLastProgress?.courseSections)
            } catch (error) {
                console.log(error)
            }
        }

        if (courseLastProgress?.courseLastProgress?.progress?.sectionId && courseLastProgress?.courseLastProgress?.progress?.itemId) {
            openCourseLastProgress()
        }

    }, [courseLastProgress , navigate])
      




    // ! TODO , to be completed
    const openAttachmentById = async (lastProgress , courseSections) => {
        
        const {progress} = lastProgress

        const sectionObj = courseSections?.find(section => section?._id === progress?.sectionId)
        if(!sectionObj) return

        const itemObj = sectionObj?.items?.find(item => item?._id === progress?.itemId)
        if(!itemObj) return

        const attachmentObj = itemObj?.attachments?.find(attachment => attachment?._id === progress?.attachmentId)
        if(!attachmentObj) return

        const sectionIndex = course?.sections?.findIndex(section => section._id === progress?.sectionId)
        if (sectionIndex === -1) return
        
        const sectionAttachments = getAttachmentsInSection(sectionIndex)

        const attachmentIndex = sectionAttachments.findIndex(attachment => attachment._id === progress?.attachmentId)
        if (attachmentIndex === -1) return          

        setSelectedSection(sectionObj)
        setCurrentSectionIndex(sectionIndex)
        setCurrentAttachmentIndex(attachmentIndex)

        await handleAttachmentClick(progress?.attachmentId , itemObj , sectionObj)

    }
    


    const navigateAttachments = async (direction) => {

        const currentSection = course?.sections?.[currentSectionIndex]
        const currentSectionAttachments = getAttachmentsInSection(currentSectionIndex)

        if (!currentSection || !currentSectionAttachments?.length) return

        if (direction === "next") {

            if (currentAttachmentIndex < currentSectionAttachments.length - 1) {

                setCurrentAttachmentIndex((prev) => prev + 1)

                const nextAttachment = currentSectionAttachments[currentAttachmentIndex + 1]
                const nextItem = currentSection?.items?.find(item => item?.attachments?.some(attachment => attachment?._id === nextAttachment?._id))

                if (nextItem) {
                    await handleAttachmentClick(nextAttachment?._id , nextItem , currentSection)
                }

            } else if (currentSectionIndex < course?.sections?.length - 1) {

                const nextSection = course?.sections?.[currentSectionIndex + 1]
                const nextSectionAttachments = getAttachmentsInSection(currentSectionIndex + 1)

                if (nextSection && nextSectionAttachments?.length) {

                    setCurrentSectionIndex((prev) => prev + 1)
                    setCurrentAttachmentIndex(0)

                    const firstAttachment  = nextSectionAttachments[0]
                    const firstItem = nextSection?.items?.find(item => item?.attachments?.some(attachment => attachment?._id === firstAttachment?._id))

                    if (firstItem) {
                        await handleAttachmentClick(firstAttachment._id, firstItem, nextSection)
                    }

                }

            }

        }

        if (direction === "prev") {

            if (currentAttachmentIndex > 0) {

                setCurrentAttachmentIndex((prev) => prev - 1)

                const prevAttachment = currentSectionAttachments[currentAttachmentIndex - 1]

                const prevItem = currentSection.items?.find(item => item?.attachments?.some(attachment => attachment?._id === prevAttachment?._id))

                if (prevItem) {
                    await handleAttachmentClick(prevAttachment?._id , prevItem , currentSection)
                }
        
            } else if (currentSectionIndex > 0) {

                const prevSection = course?.sections?.[currentSectionIndex - 1]
                const prevSectionAttachments = getAttachmentsInSection(currentSectionIndex - 1)

                if (prevSection && prevSectionAttachments?.length) {

                    setCurrentSectionIndex((prev) => prev - 1)
                    setCurrentAttachmentIndex(prevSectionAttachments.length - 1)

                    const lastAttachment = prevSectionAttachments[prevSectionAttachments.length - 1]
                    const lastItem = prevSection?.items?.find(item => item?.attachments?.some(attachment => attachment?._id === lastAttachment?._id))

                    if (lastItem) {
                        await handleAttachmentClick(lastAttachment?._id , lastItem , prevSection)
                    }
                    
                }

            }

        }

    }



    const getAttachmentsInSection = (sectionIndex) => {
        const sectionAttachments = globalAttachments.filter(
          (attachment) => attachment.sectionId === course?.sections?.[sectionIndex]?._id
        )
        return sectionAttachments
    }



    const isNextDisabled = () => {
    
        const currentSectionAttachments = getAttachmentsInSection(currentSectionIndex);
        const isLastAttachment = currentAttachmentIndex === currentSectionAttachments.length - 1;
        const isLastSection = currentSectionIndex === course?.sections?.length - 1;
      
        return !currentSectionAttachments?.length || (isLastAttachment && isLastSection);
      
    }
      


    const isPreviousDisabled = () => {

        const currentSectionAttachments = getAttachmentsInSection(currentSectionIndex);
        const isFirstAttachment = currentAttachmentIndex === 0
        const isFirstSection = currentSectionIndex === 0
      
        return !currentSectionAttachments?.length || (isFirstAttachment && isFirstSection);
    
    }



    const selectAttachment = (sectionIndex, attachmentIndex) => {
    
        const sectionAttachments = getAttachmentsInSection(sectionIndex);
      
        if (sectionAttachments?.length > 0 && sectionAttachments[attachmentIndex]) {
          setCurrentSectionIndex(sectionIndex);
          setCurrentAttachmentIndex(attachmentIndex);
          handleAttachmentClick(
            sectionAttachments[attachmentIndex]._id,
            attachmentIndex,
            sectionIndex
          )
        }
    
    }


    const handleSectionSelect = (section) => {
        setSelectedSection(section)
    }


    const isQuillEmpty = (value) => {
        return value.replace(/(<([^>]+)>)/gi, "").trim() === ""
    }



    const handleEditClick = (note) => {

        if (!expandedNotes[note?._id]) {
          toggleExpansion(note?._id)
        }

        setEditingNoteId(note?._id)
        setEditedContent(note?.content)

    }
    

    const handleSaveClick = async () => {
        try {
            await updateNote({token , courseId , content: editedContent , noteId : editingNoteId }).unwrap()
            await refetchCourseNotes()
            setEditingNoteId(null)
        } catch (error) {
            toast.error("Error updating note")
        }
    }


    const toggleExpansion = (noteId) => {
      setExpandedNotes((prev) => ({
        ...prev ,
        [noteId]: !prev[noteId] , 
      }))
    }


    const handleCancelClick = () => {
        setEditingNoteId(null)
        setEditedContent("")
    }
    

    const toggleSection = (sectionId) => {
        setExpandedSections((prevSections) =>
          prevSections.includes(sectionId)
            ? prevSections.filter((id) => id !== sectionId)
            : [...prevSections, sectionId]
        )
    }


    const handleEditReminder = (reminder) => {
        setEditingReminder(reminder)
        setIsCourseReminderModalOpen(true)
    }


    const handleDeleteReminderClick = (reminderId) => {
        setReminderToDelete(reminderId)
        setIsDeleteRminderModalOpen(true)
    }

    
    const handleModalClose = () => {
        setIsDeleteRminderModalOpen(false)
    }

    const handleNoteModalClose = () => {
        setIsDeleteNoteModalOpen(false)
    }


    const handleDeleteConfirmation = async () => {
        try {
          await deleteReminder({ token, reminderId: reminderToDelete }).unwrap()
          await refetchCourseReminders()
          setIsDeleteRminderModalOpen(false)
          toast.success('Reminder deleted successfully!')
        } catch (error) {
          toast.error('Error deleting reminder')
        }
    }



    const handleDeleteNoteConfirmation = async () => {
        try {
          await deleteNote({ token, noteId: deleteNoteId , courseId }).unwrap()
          await refetchCourseNotes()
          handleNoteModalClose()
          setDeleteNoteId(null)
          toast.success('note deleted successfully!')
        } catch (error) {
          toast.error('Error deleting reminder')
        }
    }



    const addNewNote = async () => {

        if(noteText.length === 0){
            return toast.error("Note text can't be empty") 
        }

        try {
            await addNote({token , courseId , content : noteText}).unwrap()
            await refetchCourseNotes()
            toast.info("new note has been added")
            setNoteText("")
        } catch (error) {
            toast.error('Error Adding new note')
        }
    }


    


    const getItemIcon = (type) => {
        switch (type) {
          case "Video" :
            return <FaPlayCircle className="text-orange-300" size={20} />
          case "Document":
            return <FaFileAlt className="text-blue-500" size={20} />
          case "Image" :
            return <FaImage className="text-green-500" size={20} />
          case "Activity" :
            return <FaTasks className="text-purple-500" size={20} />
          default:
            return null
        }
    }



    const markAsCompleted = async (attachmentId) => {
        
        const duration = iframeOpenedAt ? Math.floor((Date.now() - iframeOpenedAt) / 1000) : 0

        refetch()

        const contentCmi = {
            student_id : user._id ,
            student_name : `${user?.firstName} ${user?.lastName}` ,
            lesson_status : "completed" ,
            duration
        }

        try {
            
            await setScormLogs({token , userId : user?._id , attachmentId , contentCmi })
            
            if(user?.role === "student") {
                refetch()
            }

        } catch (error) {
            console.log(error)
        }

        setLaunchUrl("") 
        setShowIframe(false)
        setIframeOpenedAt(null)

    }



    const getColor = (type) => {
        switch (type) {
          case "daily":
            return "bg-[#68FFAF]";
          case "weekly":
            return "bg-[#88D6FF]";
          case "one-time":
            return "bg-[#FFC768]";
          default:
            return "bg-gray-400";
        }
    }



    if (!course) {
        return <div>Loading course data...</div>
    }




  return (
    <div className="flex p-6">

      {/* Left Course Content */} 
      <div className="w-full h-[750px] bg-gray-100 p-4 rounded-md">

        {
            launchUrl ? 
            (

                <iframe
                    src={`http://10.10.30.40:5500/public/scorm-launcher.html?launchUrl=${encodeURIComponent(
                    launchUrl
                    )}&userId=${encodeURIComponent(
                    user?._id
                    )}&version=${encodeURIComponent(
                    attachment?.scormVersion
                    )}&username=${encodeURIComponent(`${user?.firstName} ${user?.lastName}`)}&token=${encodeURIComponent(
                    token
                    )}&attachmentId=${encodeURIComponent(attachmentId)}&attachment=${encodeURIComponent(attachment?.type)}
                    &duration=${encodeURIComponent(Math.floor((Date.now() - iframeOpenedAt) / 1000))}
                    &type=${encodeURIComponent(attachment?.type)}&courseId=${encodeURIComponent(courseId)}`}
                    title="SCORM Content"
                    style={{width : "100%" , height : "100%"}}
                    key={launchUrl} 
                />

            ) 
            :
            (
                <iframe className="w-[100%] h-[100%] p-2 rounded-md" src={defaultLaunchUrl} frameborder="0"></iframe>
            )

        }

        <div className="flex justify-between mt-10">

            <div className='flex gap-6 items-center'>

                {launchUrl && attachment && (attachment?.type === "Image" || attachment?.type === "Document") && (
                    <button onClick={() => markAsCompleted(attachment?._id)} className="bg-[#FFC200] transition-all duration-300 text-[#002147] font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600">
                        Mark as Completed
                    </button>
                )}
                
                {launchUrl && <button onClick={() => {setLaunchUrl("") ; setCurrentAttachmentIndex(null)}} className="bg-[#002147] transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[#2e5584]">
                    Close Activity
                </button>}

                {
                    selectedTab !== "" && (
                        <button onClick={() => {setSelectedTab("")}} className="bg-[#002147] transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[#2e5584]">
                            {`Close ${selectedTab} tab`} 
                        </button>
                    )
                }

            </div>

            <div>
            
                {/* <span className='text-lg mr-6 font-semibold text-[#000]'>
                    {`Module ${currentSectionIndex} / ${course?.sections?.length}`}
                </span> */}

                {launchUrl && (
                    <>
                        <button onClick={() => navigateAttachments("prev")} disabled={isPreviousDisabled()} className="bg-[#FFC200] transition-all duration-300 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-md mr-2 disabled:cursor-not-allowed disabled:bg-gray-300">
                            <FaChevronLeft />
                        </button>

                        <button onClick={() => navigateAttachments("next")} disabled={isNextDisabled()} className="bg-[#FFC200] transition-all duration-300 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:cursor-not-allowed disabled:bg-gray-300">
                            <FaChevronRight />
                        </button>
                    </>
                )

                }

            </div>

        </div>

        <div className="p-3 cursor-pointer flex gap-10 mt-5 text-xl text-[#002147] font-semibold border-b">

            {["FAQ's", "Notes", "Quiz", "Assignment", "Reminder" , "Feedback"].map((tab) => (

                <span
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`relative pb-2 ${selectedTab === tab ? "text-[#FFC200] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-[#FFC200]" : ""}`}
                >
                    {tab}
                </span>

            ))}

        </div>
        


        {/* faqs place */}
        {selectedTab === "FAQ's" && (

            <div className='p-3 w-full'>
                
                <div className='mt-4 flex items-center gap-6'>
                    
                    <img src={testImg} className='rounded-full h-12 w-12' alt="" />

                    <div className='relative w-[60%]'>
                        <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder='Write a Question ...' className='w-full p-3 border-2 rounded-md' type="text" />
                        <FiImage className="absolute right-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-500 cursor-pointer" />
                    </div>

                    <button disabled={newQuestion.trim() === ""} className="bg-[#FFC200] text-[#002147] text-[18px] font-semibold px-8 py-3 rounded-md disabled:cursor-not-allowed disabled:bg-gray-200">Post</button>

                </div>

            </div>

            )

        }

            <div className='flex flex-col flex-grow'>
                {selectedTab === "FAQ's" && <FAQS />}
                {selectedTab === "FAQ's" && <FAQS/> }
                {selectedTab === "FAQ's" && <FAQS/> }
                {selectedTab === "FAQ's" && <FAQS/> }
            </div>
        

        {
            selectedTab === "FAQ's" && (
                
                <div className="flex pb-4 ml-5">

                    <button  onClick={() => setIsFaqModalOpen(true)} className="text-[#403685] decoration-1 underline-offset-4 text-lg px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#5345b2] hover:text-white transition duration-300">
                        Show More FAQs <FiArrowRight className="text-xl" />
                    </button>

                </div>

            )
        }


        {/* end of faqs place */}




        {/* start of notes place */}

        {
            selectedTab === "Notes" && (
                
                <div className='p-3 flex flex-col gap-4 relative w-[80%]'>

                    <div className='flex w-[80%] ml-28 justify-end'>
                        <button className='flex text-[#403685] capitalize font-semibold items-center gap-2'><PiExport className='font-semibold' size={22}/> Export to pdf</button>
                    </div>
                    
                    <div className='flex items-center gap-5'>
                        
                        <div className='p-3 relative w-[90%]'>

                            <ReactQuill value={noteText} onChange={(value) => setNoteText(value)} className='h-52 mt-2'/>

                            <div className='absolute -bottom-5 right-6 flex gap-4'>
                                <button onClick={() => setNoteText("")} className='mt-8 bg-[#FFF] text-[#403685] border-2 border-[#403685] text-[16px] font-bold px-8 py-3 rounded-lg disabled:cursor-not-allowed capitalize'>cancel</button>
                                <button onClick={addNewNote} disabled={isQuillEmpty(noteText)} className='mt-8 bg-[#FFC200] text-[#002147] text-[14px] font-semibold px-8 py-3 rounded-lg disabled:cursor-not-allowed disabled:bg-gray-200 capitalize'>add note</button>
                            </div>

                        </div>

                    </div>

                    <div className='mt-10 mb-5 p-3'>

                        <div className='flex w-[90%] gap-8 flex-col'>

                            {courseNotes?.notes?.map((note) => (

                                <div key={note?._id}>

                                    <div className="flex bg-white rounded-md border-b-2 p-3 pt-4 w-full justify-between">

                                        <div className="flex cursor-pointer items-center gap-4" onClick={() => toggleExpansion(note?._id)} >

                                            <IoIosArrowDown size={26}
                                                style={{
                                                    transform: expandedNotes[note?._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />

                                            <span
                                                className="font-semibold text-xl text-[#92929D]"
                                                dangerouslySetInnerHTML={{ __html: note?.content }}
                                            />

                                        </div>

                                        <div className="flex cursor-pointer items-center gap-4">
                                            <MdEdit onClick={() => handleEditClick(note)} className="text-[#6555BC]" size={28} />
                                            <MdDeleteForever onClick={() => {openDeleteModal(note?._id) ; setIsDeleteNoteModalOpen(true)}} className="text-[#FC5A5A]" size={28} />
                                        </div>

                                    </div>

                                    {expandedNotes[note?._id] && (

                                        <div className="bg-white p-8">

                                            {editingNoteId === note?._id ? (

                                                <div className='p-4 flex flex-col gap-5'>

                                                    <ReactQuill
                                                        value={editedContent}
                                                        onChange={(value) => setEditedContent(value)}
                                                        className="w-full h-32 mb-8"
                                                    />

                                                    <div className='flex items-center gap-6'>
                                                        
                                                        <button onClick={handleCancelClick} className="mt-2 px-6 bg-[#FC5A5A] text-white rounded-lg p-2">
                                                            Cancel
                                                        </button>
                                                        
                                                        <button onClick={handleSaveClick} className="mt-2 px-6 bg-[#FFC200] text-[#002147] font-semibold rounded-lg p-2">
                                                            Save
                                                        </button>
                                                        
                                                    </div>                                                    

                                                </div>

                                            ) : (
                                                <p 
                                                    className="text-[#000] font-semibold"
                                                    dangerouslySetInnerHTML={{ __html: note?.content }}
                                                />
                                            )}

                                        </div>

                                    )}

                                </div>
                                
                            ))}

                        </div>
                        
                        <div className='w-[90%]'>
                            
                            <button className="flex items-center mt-8 ml-auto font-semibold text-lg gap-2 text-[#403685] border-0 bg-transparent cursor-pointer">
                                <span>Show More</span>
                                <IoIosArrowForward size={20} />
                            </button>   

                        </div>

                    </div>
                
                </div>

            )

        }

        {/* end of notes place */}



        {/* start of feedback place */}

        {selectedTab === "Feedback" && (

            <div className='p-3 mt-2 flex flex-col gap-4 relative w-[80%]'>
                
                <h3 className='text-[#002147] mb-6 font-semibold text-[32px]'>Learner reviews</h3>
                
                <div className='flex gap-12 w-full justify-between items-center'>

                    <div className="flex items-center justify-start mb-auto gap-2 text-xl font-semibold">
                        <FaStar className="text-yellow-400" size={38} />
                        <span className="text-[#002147]">4.5</span>
                        <span className="text-[#000] mt-1 text-sm">964 reviews</span>
                    </div> 


                    <div className="w-[40%] space-y-4">

                        {[
                        { stars: 5, percent: 60 },
                        { stars: 4, percent: 30 },
                        { stars: 3, percent: 2.5 },
                        { stars: 2, percent: 1 },
                        { stars: 1, percent: 15 },
                            ].map((rating, index) => (
                            <div key={index} className="flex items-center gap-3">

                                <span className="text-sm font-semibold min-w-fit">{rating.stars} Stars</span>

                                <div className="w-full h-3 bg-gray-200 rounded-md relative">

                                <div
                                    className="h-3 bg-[#6555BC] rounded-md"
                                    style={{ width: `${rating.percent}%` }}
                                ></div>

                                </div>

                                <span className="text-sm text-gray-600">{rating.percent}%</span>

                            </div>

                        ))}

                    </div>

                    <div className="flex mr-12 mb-auto items-center gap-8">
                    
                        <FaFilter size={28}/>
                      
                        <select value={ratingType} onChange={(e) => setRatingType(e.target.value)} className="p-2 px-4 border rounded-lg bg-white shadow-sm text-gray-900">
                    
                            <option value="" disabled selected>All Rating</option>
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 star</option>

                    
                        </select>
                    
                        <select value={sortBy} onChange={(e) => setsortBy(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm text-gray-900">
                            <option value="" disabled selected>Sort by : Date</option>
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                        </select>
                    
                    </div>

                </div>

                <div className='w-full flex flex-col gap-6 mt-5'>
                    <ReviewCard setIsFeedbackReportModalOpen={setIsFeedbackReportModalOpen} isOwned={true}/>
                    <hr />
                    <ReviewCard/>
                    <hr />
                    <ReviewCard/>

                </div>

                <button className='ml-auto text-[#403685] text-lg flex gap-1 items-center font-semibold'>Show more <FaAngleRight className='mt-0.5' size={22}/> </button>

            </div>

        )}

        {/* end of feedback place */}



        {/* start of quizzes place */}
        {/* add empty quiz length case , pagination , loading */}
        {selectedTab === "Quiz" && (

            <div className='p-3 mt-2 flex flex-col gap-4 relative w-[80%]'>

                <h3 className='text-[#002147] mb-6 font-semibold text-[30px]'>Course Quizzes</h3>

                {isLoadingLastQuizzes ? (
                    <p className="text-center text-gray-500">Loading quizzes...</p>
                    ) : courseLastQuizzes?.quizzes?.length > 0 ? (
                    courseLastQuizzes.quizzes.map((quiz) => (
                        <div key={quiz?._id} className="flex w-[1000px] items-center bg-white last:mb-6 p-4 rounded-lg shadow-md">
                            <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-lg">
                                <img src={quizSvg} alt="Quiz Icon" className="w-10 h-10" />
                            </div>

                            <div className="flex-1 ml-4">
                                <h3 className="text-lg capitalize text-[#35353A] font-bold">{quiz?.title}</h3>
                                <p className="text-gray-500 text-sm">{formatDate(quiz?.dueDate)}</p>
                            </div>

                            <div className="flex items-center mr-36 gap-8 text-gray-600">
                                    <div className="text-center">
                                        <p className="text-sm text-[#AFAFAF]">Questions</p>
                                        <p className="font-semibold text-[#002147]">{quiz?.questions?.length}</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-[#AFAFAF]">Time To Complete</p>
                                        <p className="font-semibold text-[#002147]">{quiz?.duration && quiz?.duration?.value && quiz?.duration?.unit && formatQuizDuration(quiz?.duration)}</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-[#AFAFAF]">Grade</p>
                                        <p className="font-semibold text-[#002147]">{quiz?.maxScore}</p>
                                    </div>
                                </div>

                                {quiz?.hasSubmission ? (
                                    <YellowBtn onClick={() => navigate(`/quiz-result/${quiz?._id}`)} text="View Result" icon={FaArrowRight} />
                                ) : (
                                    <YellowBtn onClick={() => navigate(`/quiz-details/${quiz?._id}`)} text="Start" icon={FaArrowRight} />
                                )}

                            </div>
                        ))

                    ) : (
                        <p className="text-center text-gray-500">No quizzes available.</p>
                    )}


                {courseLastQuizzes?.quizzes?.length !== 0 && !isLoadingLastQuizzes && <div className='flex items-center justify-end gap-6 p-3 w-[80%]'>

                    <button  
                        onClick={() => setQuizTabPage((prev) => Math.max(prev - 1, 1))}
                        disabled={quizTabPage === 1}
                        className="px-4 py-2 capitalize bg-gray-200 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
                    >
                        prev
                    </button>

                    <span className="font-semibold">
                        Page {quizTabPage} of {courseLastQuizzes?.totalPages || 1}
                    </span>

                    <button
                        onClick={() => setQuizTabPage((prev) => Math.min(prev + 1, courseLastQuizzes?.totalPages))}
                        disabled={quizTabPage === courseLastQuizzes?.totalPages}
                        className="px-4 py-2 capitalize bg-gray-200 cursor-pointer disabled:cursor-not-allowed rounded disabled:opacity-50"
                    >
                        next
                    </button>

                </div>}

            </div>

        )}


        {/* end of quizzes place */}



        {/* start of assignment place */}
        {/* pagination , loading cases */}
        
        {selectedTab === "Assignment" && (

            <div className='p-3 mt-2 flex flex-col gap-4 relative w-[80%]'>

                <h3 className='text-[#002147] mb-6 font-semibold text-[30px]'>Course Assignments</h3>

                {courseLastAssignments?.assignments?.length > 0 ? (

                    courseLastAssignments?.assignments?.map((assignment) => (

                        <div key={assignment?._id} className="flex w-[600px] items-center bg-white last:mb-6 p-4 rounded-lg shadow-md">

                            <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-lg">
                                <img src={assignmentSvg} alt="Quiz Icon" className="w-10 h-10" />
                            </div>

                            <div className="flex-1 flex items-center justify-between gap-16 ml-4">

                                <div>
                                    <h3 className="text-lg text-[#35353A] font-bold">{assignment?.title}</h3>
                                    <p className="text-gray-500 text-sm">{formatDate(assignment?.dueDate)}</p>
                                </div>

                                <div className="text-center mr-10">
                                    <p className="text-sm text-[#AFAFAF]">Grade</p>
                                    <p className="font-semibold text-[#002147]">{assignment.mark}</p>
                                </div>

                            </div>


                            {assignment?.hasSubmission ? <YellowBtn onClick={() => navigate(`/student-grades`)} text="View" icon={FaArrowRight} /> : <YellowBtn onClick={() => navigate(`/view-assignment-details/${assignment._id}/${courseId}`)} text="View" icon={FaArrowRight} />}
                                
                        </div>
                    ))
                        ) : (
                            <p className="text-center text-gray-500 text-2xl mt-4">No assignments found.</p>
                        )}

                    </div>

                )}

                {/* end of assignment place */}




        {/* start of reminder place */}

        {selectedTab === "Reminder" && (

            <div className='p-3 mt-2 flex flex-col gap-4 relative w-[80%]'>
                
                <div className='flex w-[1500px] items-center justify-between'>

                    <h3 className='text-[#002147] font-semibold text-[30px]'>Course Reminders</h3>

                    {

                        courseReminders?.reminders?.length > 0 && <div className='flex items-center gap-5 justify-end'>

                            <select value={reminderFilter} onChange={(e) => setReminderFilter(e.target.value)} name="sort" className="border px-3 w-[250px] py-2 rounded-lg">
                        
                                <option value="" selected disabled>Sort By Type</option>

                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Once">Once</option>

                            </select>

                            <YellowBtn onClick={() => setIsCourseReminderModalOpen(true)} text={"Add course reminder"} icon={FaPlus} />

                        </div>

                    }

                </div>

                {
                    courseReminders?.reminders?.length === 0 && <div className="flex flex-col items-center justify-center p-6">

                    <div className="p-6 rounded-lg text-center max-w-md">

                        <div className="flex justify-center mb-4">
                            <img src={reminderSvg} alt="Reminder Icon" className="w-32 h-32" />
                        </div>

                        <h2 className="text-xl font-semibold text-[#002147]">Set Course Reminders !</h2>

                        <p className="text-[#797979] mt-2">
                            Keep track of your studies, stay organized, and receive timely alerts for important deadlines.
                        </p>

                        <div className='flex items-center justify-center'>
                            <button onClick={() => setIsCourseReminderModalOpen(true)} className="mt-4 flex items-center gap-2 bg-[#ECEBFE] text-[#403685] px-4 py-2 rounded-lg font-semibold transition">
                                <FaPlus /> Add Course Reminder
                            </button>
                        </div>

                    </div>

                    </div>
                }

                {
                    courseReminders?.reminders?.length > 0 && (

                        <div className="max-w-[80%] space-y-6 p-4 rounded-lg">

                            {courseReminders?.reminders?.map((reminder) => (

                                <div key={reminder?._id} className="flex items-start p-4 bg-white rounded-lg shadow-md relative">

                                <div className={`${getColor(reminder?.reminderType)} w-2 h-full absolute left-0 top-0 rounded-l-lg`} />

                                    <div className="ml-4 flex-1">

                                        <p className="text-gray-700 capitalize font-medium">{reminder?.reminderName}</p>

                                        <div className="flex items-center text-gray-500 mt-2">

                                        <span className="mr-2">
                                            <FaClock className='text-[#6555BC]'/>
                                        </span>

                                        <span>{reminder?.reminderTime}</span>

                                        {reminder?.reminderType === "weekly" && (

                                            <div className="ml-5 flex space-x-2">
                                                {reminder?.reminderDays?.map((day) => (
                                                    <span key={day} className="px-2 py-1 bg-gray-200 rounded-lg text-sm text-gray-700">
                                                        {day}
                                                    </span>
                                                ))}

                                            </div>

                                        )}

                                        {reminder?.reminderType === "once" && (
                                            <span className="ml-4 flex items-center">
                                                <FaCalendarAlt className='text-[#6555BC]0'/> <span className="ml-1">{formatDate(reminder?.reminderDateTime)}</span>
                                            </span>
                                        )}

                                        </div>

                                    </div>
                                    
                                    <div className='flex items-center gap-3'>
                                        <button onClick={() => handleEditReminder(reminder)} className="ml-2"><MdModeEdit className='text-[#6555BC]' size={22}/></button>
                                        <button  onClick={() => handleDeleteReminderClick(reminder?._id)} className="ml-2"><MdDelete className='text-red-500' size={22}/></button>
                                    </div>

                                </div>

                            ))}

                            {courseReminders?.reminders?.length !== 0 && !isLoadingLastQuizzes && <div className='flex items-center justify-end gap-6 p-3 w-[100%]'>

                                <YellowBtn onClick={() => setReminderTabPage((prev) => Math.max(prev - 1, 1))} text="Previous" disabled={reminderTabPage === 1}  />

                                <span className="font-semibold">
                                    Page {courseReminders?.page} of {courseReminders?.totalPages || 1}
                                </span>
                                
                                <YellowBtn onClick={() => setReminderTabPage((prev) => Math.min(prev + 1, courseReminders?.totalPages))} text="Next" disabled={reminderTabPage === courseReminders?.totalPages}  />

                            </div>}

                        </div>
                    ) 

                }

            </div>

        )}

        {/* end of reminder place */}


      </div>



      {/* Right Sidebar - Modules List */}
      {/* min-h-max */}
      <div className="w-1/4 p-6 h-full bg-white shadow-lg rounded-md">

      {course?.sections?.map((section , sectionIndex) => {

        return (

            <div key={section?._id} className='bg-white last:border-b w-full border-gray-300 p-4'>

                <div key={section?._id} onClick={() => {toggleSection(section?._id) ; handleSectionSelect(section)}} className='flex justify-between cursor-pointer items-center'>

                    <div className='flex cursor-pointer flex-col gap-2'>
                    
                        <span className='font-semibold text-[18px]'>
                            Module {sectionIndex + 1} : {section?.name}
                        </span>

                        <div className="section-info text-[18px] text-gray-600">

                            {section?.items?.length} <span className='mr-2'>Lessons</span>

                            <span className="text-[#403685] font-semibold">
                                {formatTimeWithLabels(getTotalTime(section?.items || []))}
                            </span>  

                        </div>

                    </div>

                    <FaAngleDown className={`mb-6 transition-transform duration-300 ${expandedSections.includes(section?._id) ? 'transform rotate-180' : ''}`} size={25}/>
                
                </div>

                {expandedSections?.includes(section?._id) && (
                    
                    <div className='w-full flex flex-col gap-3'>

                            {section?.items?.map((item, itemIndex) => (

                                <div
                                    key={item?._id}
                                    className="flex cursor-pointer justify-between items-center w-full mt-4"
                                    onClick={async () => {
                                        try {
                                            setSelectedItem(item);  
                                            selectAttachment(sectionIndex, itemIndex)
                                            const attachmentId = item?.attachments[0]?._id;
                                            await handleAttachmentClick(attachmentId, item)
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }}
                                >
                                    <div className="flex mt-2 items-center gap-4">
                                        {getItemIcon(item?.type)}
                                        <span className="font-semibold text-[18px]">{item?.name}</span>
                                    </div>

                                    <span className="ml-auto text-[18px] font-semibold mr-2 text-gray-600">
                                        {formatTimeWithLabels(item?.estimatedTime)}
                                    </span>

                                </div>
                            ))} 

                    </div>

                )}

            </div>

        )

        })}

      </div>

        <FaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} />

        {isCourseRateModalOpen && <CourseRatePopUp onClose={() => setIsCourseRateModalOpen(false)} />}
        {isFeedbackReportModalOpen && <ReportFeedbackPopUp onClose={() => setIsFeedbackReportModalOpen(false)} />}
        {isCourseReminderModalOpen && <CourseReminderModal editingReminder={editingReminder} refetch={refetchCourseReminders} courseId={courseId} onClose={() => {setIsCourseReminderModalOpen(false) ; setEditingReminder(null)}} />}
        {isDeleteRminderModalOpen && <DeleteReminderModal isOpen={isDeleteRminderModalOpen} onClose={handleModalClose} onDelete={handleDeleteConfirmation}/>}
        {isDeleteNoteModalOpen && <DeleteNoteModal onDelete={handleDeleteNoteConfirmation} isOpen={isDeleteNoteModalOpen} onClose={handleNoteModalClose}/> }

    </div>

    )
    
}



export default EnrolledCourse




// !add this when there is real data fetch useEffect to check if the usre is enrolled in the course or not , to ensure only enrolled students can access the course content page

// useEffect(() => {
//     // Check if the user is enrolled in the course
//     const checkEnrollment = async () => {
//       try {
//         const response = await fetch(`/api/checkEnrollment/${courseId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (!data.enrolled) {
//           navigate(`/courses/single-course/${courseId}`);
//         }
//       } catch (error) {
//         setError('Error checking enrollment');
//       }
//     };
  
//     if (courseId && token) {
//       checkEnrollment();
//     }
//   }, [courseId, token, navigate]);










// PREV STABLE VERSION
// const navigateAttachments = async (direction) => {

//     const currentSectionAttachments = getAttachmentsInSection(currentSectionIndex)
  
//     if (!currentSectionAttachments || currentSectionAttachments.length === 0) return
  
//     if (direction === "next") {

//       if (currentAttachmentIndex < currentSectionAttachments.length - 1) {
//         setCurrentAttachmentIndex((prev) => prev + 1);
//         handleAttachmentClick(
//           currentSectionAttachments[currentAttachmentIndex + 1]._id,
//           currentAttachmentIndex + 1,
//           currentSectionIndex
//         )
//       } else if (currentSectionIndex < course?.sections?.length - 1) {
//         const nextSectionAttachments = getAttachmentsInSection(currentSectionIndex + 1);
//         if (nextSectionAttachments?.length) {
//           setCurrentSectionIndex((prev) => prev + 1);
//           setCurrentAttachmentIndex(0);
//           handleAttachmentClick(
//             nextSectionAttachments[0]._id,
//             0,
//             currentSectionIndex + 1
//           );
//         }
//       }
//     }
  

//     if (direction === "prev") {
      
//       if (currentAttachmentIndex > 0) {
//         setCurrentAttachmentIndex((prev) => prev - 1);
//         handleAttachmentClick(
//           currentSectionAttachments[currentAttachmentIndex - 1]._id,
//           currentAttachmentIndex - 1,
//           currentSectionIndex
//         );
//       } else if (currentSectionIndex > 0) {
//         const prevSectionAttachments = getAttachmentsInSection(currentSectionIndex - 1);
//         if (prevSectionAttachments?.length) {
//           setCurrentSectionIndex((prev) => prev - 1);
//           setCurrentAttachmentIndex(prevSectionAttachments.length - 1);
//           handleAttachmentClick(
//             prevSectionAttachments[prevSectionAttachments.length - 1]._id,
//             prevSectionAttachments.length - 1,
//             currentSectionIndex - 1
//           );
//         }
//       }
//     }

// }