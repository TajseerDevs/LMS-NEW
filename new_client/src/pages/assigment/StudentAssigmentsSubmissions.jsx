import { useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa"
import { IoSaveSharp } from "react-icons/io5"
import { MdOutlineCancel } from "react-icons/md"
import YellowBtn from "../../components/YellowBtn"
import purpleAssigment from "../../assets/purple-assigment.svg"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetCourseByIdQuery } from "../../store/apis/courseApis"
import { useGetSingleStudentUserQuery, useGetTwoRandomUngradedSubmissionsQuery } from "../../store/apis/instructorApis"
import { useAddMarksToSubmissionMutation, useGetAllStudentAssignmentsSubmissionsQuery } from "../../store/apis/assigmentApis"
import formatDate from "../../utils/formatDate"


const initialAssignmentsSubmissions = [
  { id: 1, name: "assigment one",  submitted: true, date: "3/3/2025", file: "Task_PDF_CharlieGouse", mark: 0 },
  { id: 2, name: "java assigment",  submitted: false, date: "No Submission", file: "No Submission file", mark: 0 },
  { id: 3, name: "midterm assigment",  submitted: true, date: "3/8/2025", file: "Task_PDF_CharlieGouse", mark: 5 },
  { id: 4, name: "makeup assigment",  submitted: false, date: "No Submission", file: "No Submission file", mark: 2 },
]


const BASE_URL = "http://10.10.30.40:5500"


const StudentAssigmentsSubmissions = () => {

  const { studentId , courseId } = useParams()

  const {token} = useSelector((state) => state.user)

  const [page , setPage] = useState(1)

  const {data : course } = useGetCourseByIdQuery({token , courseId})
  const {data : student} = useGetSingleStudentUserQuery({token , userId : studentId})  
  const {data : studentAssignmentsSubmissions , refetch} = useGetAllStudentAssignmentsSubmissionsQuery({token , userId : studentId , courseId , page})
  const {refetch : refetchRandomUnGraded } = useGetTwoRandomUngradedSubmissionsQuery({token})
  

  const [assignMarkToSubmission , {isLoading : isLoadingAddMark}] = useAddMarksToSubmissionMutation()
  

  const [editingId, setEditingId] = useState(null)
  const [tempMark, setTempMark] = useState(0)

  const [search , setSearch] = useState("")
  const [selectedFilter , setSelectedFilter] = useState("")


  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }


  const handleEdit = (submissionId) => {
    setEditingId(submissionId)
  }


  const handleSaveMark = async (assignmentId) => {

    try {
      await assignMarkToSubmission({token , assignmentId , userId : student?._id , marks : tempMark , feedback : tempMark > 5 ? "Very Good" : "Not Bad"}).unwrap()
      await refetch()
      await refetchRandomUnGraded()
    } catch (error) {
      console.log(error)
    }finally{
      setEditingId(null)
      setTempMark(0)
    }

  }


  const handleCancelEdit = () => {
    setEditingId(null)
    setTempMark(0)
  }



  const handlePrev = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1)
    }
  }


  const handleNext = () => {
    if (data?.totalPages && page < studentAssignmentsSubmissions?.totalPages) {
      setPage(prevPage => prevPage + 1)
    }
  }



  const filteredSubmissions = studentAssignmentsSubmissions?.submissions?.filter((submission) => {
    
    const fullName = `${submission?.studentId?.userObjRef?.firstName} ${submission?.studentId?.userObjRef?.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase())
  
    const isSubmitted = submission?.isGraded
  
    if (selectedFilter === "yes") {
      return isSubmitted && matchesSearch
    } else if (selectedFilter === "no") {
      return !isSubmitted && matchesSearch
    } else {
      return matchesSearch 
    }

  })



  return (

    <div className="p-10">

      <h2 className="text-2xl font-semibold">
        <h1 className='text-3xl mb-10 capitalize font-semibold text-[#002147]'>Student Progress  <span className="text-[#797979]">/ {course?.title} / {student?.firstName} {student?.lastName} / Assignments  </span> </h1>
      </h2>

      <div className="flex items-center justify-between mt-8 mb-8 w-[75%]">

        <div className='flex items-center gap-8'>

          <input
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search"
            className="border px-3 w-[300px] py-2 rounded-lg focus:outline-none"
          />

          <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} name="sort" className="border px-3 w-[300px] py-2 rounded-lg">
                
            <option value="" selected disabled>Submitted</option>
            <option value="all">All</option>
            <option value="yes">Submitted</option>
            <option value="no">Not Submitted</option>

          </select>

        </div>

      </div>

      <div className="mt-4 overflow-x-auto">

        <table className="w-[90%] text-lg bg-white">

          <thead>

            <tr className="border-b-2 text-[#101018] h-[70px]">  

              <th className="p-4 text-left">Assignment Name</th>
              <th className="p-4">Submitted Assignment</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4">Submitted File</th>
              <th className="p-4">Mark</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredSubmissions?.map((submission) => (

              <tr key={submission?._id} className="text-center h-[70px] border-b-2">

                <td className="p-4 flex items-center space-x-4">

                  <img
                    src={purpleAssigment}
                    alt="profile"
                    className="w-8 h-8 bg-purple-200 p-1"
                  />

                  <div>
                    <p className="font-semibold capitalize">{submission?.assignmentId?.title}</p>
                    <p className="text-gray-500 text-left ml-1 text-sm">{student?._id?.slice(0 , 9)}</p>
                  </div>

                </td>

                <td className="p-4">{submission?.submissionFile?.filePath !== "" ? "Yes" : "No"}</td>
                <td className="p-4">{formatDate(submission?.submittedAt)}</td>

                <td className="p-4">

                  {!submission?.submissionFile !== "No Submission file" ? (
                    <a href={`${BASE_URL}${submission?.submissionFile?.filepath}`} className="text-blue-500 underline">{submission?.submissionFile?.originalName}</a>
                  ) : "No Submission"}

                </td>

                <td className="p-4">

                {editingId === submission?._id ? (
  
                    <div className="">

                      <input
                        type="number"
                        value={tempMark || 0}
                        onChange={(e) => setTempMark(e.target.value)}
                        className="border p-1 w-16 text-center"
                        min={0}
                        max={100}
                      />
                    
                    </div>

                  ) : (

                    <span>{submission?.marks !== null ? submission?.marks : "-"}</span>

                  )}

                </td>

                <td className="p-4 space-x-4">

                  {editingId === submission?._id ? (

                    <>

                      <button onClick={() => handleSaveMark(submission?.assignmentId?._id)} className="text-[#403685]">
                        <IoSaveSharp size={26} />
                      </button>

                      <button onClick={handleCancelEdit} className="text-[#403685] mt-1">
                        <MdOutlineCancel size={26}/>
                      </button>

                    </>

                  ) : (

                    <button onClick={() => handleEdit(submission?._id)} className="text-[#403685] font-semibold underline">
                      Add mark +
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      
      <div className="mt-10 flex justify-end w-[90%] items-center gap-2">

        <YellowBtn text="Previous" disabled={page <= 1} onClick={handlePrev} />

        <span className="mx-4 text-lg font-semibold">Page {page} of {studentAssignmentsSubmissions?.totalPages}</span>

        <YellowBtn text="Next" disabled={page >= studentAssignmentsSubmissions?.totalPages} onClick={handleNext} />

      </div>

    </div>
  )


}



export default StudentAssigmentsSubmissions