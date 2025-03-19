import { useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa"
import { IoSaveSharp } from "react-icons/io5"
import { MdOutlineCancel } from "react-icons/md"
import YellowBtn from "../../components/YellowBtn"
import purpleAssigment from "../../assets/purple-assigment.svg"


const initialAssignmentsSubmissions = [
  { id: 1, name: "assigment one",  submitted: true, date: "3/3/2025", file: "Task_PDF_CharlieGouse", mark: 0 },
  { id: 2, name: "java assigment",  submitted: false, date: "No Submission", file: "No Submission file", mark: 0 },
  { id: 3, name: "midterm assigment",  submitted: true, date: "3/8/2025", file: "Task_PDF_CharlieGouse", mark: 5 },
  { id: 4, name: "makeup assigment",  submitted: false, date: "No Submission", file: "No Submission file", mark: 2 },
]



const StudentAssigmentsSubmissions = () => {

  const [assignments, setAssignments] = useState(initialAssignmentsSubmissions)
  const [editingId, setEditingId] = useState(null)
  const [tempMark, setTempMark] = useState({})
  const [search, setSearch] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [page , setPage] = useState(1)


  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleEdit = (id, currentMark) => {
    setEditingId(id)
    setTempMark({ ...tempMark , [id]: currentMark }) 
  }


  const handleSaveMark = (id) => {
    setAssignments(assignments.map(item =>
      item.id === id ? { ...item, mark: tempMark[id] } : item
    ))
    setEditingId(null)
  }


  const handleCancelEdit = () => {
    setEditingId(null)
    setTempMark({})
  }


  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search);
    const matchesFilter =
      selectedFilter === "all" || 
      selectedFilter === "" || 
      (selectedFilter === "yes" && item.submitted) ||
      (selectedFilter === "no" && !item.submitted);
  
    return matchesSearch && matchesFilter;
  })


  const handlePrev = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1)
    }
  }


  const handleNext = () => {
    // if (assigments && page < assigments.totalPages) {
    //   setPage(prevPage => prevPage + 1)
    // }
  }


  return (

    <div className="p-10">

      <h2 className="text-2xl font-semibold">
        <h1 className='text-3xl mb-10 capitalize font-semibold text-[#002147]'>Student Progress  <span className="text-[#797979]">/ Course Name / Student name / Assignments  </span> </h1>
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

            <tr className="border-b-2 text-[#101018] h-[70px] ">

              <th className="p-4 text-left">Assignment Name</th>
              <th className="p-4">Submitted Assignment</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4">Submitted File</th>
              <th className="p-4">Mark</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredAssignments.map((item) => (

              <tr key={item.id} className="text-center h-[70px] border-b-2">

                <td className="p-4 flex items-center space-x-4">

                  <img
                    src={purpleAssigment}
                    alt="profile"
                    className="w-8 h-8 bg-purple-200 p-1"
                  />

                  <div>
                    <p className="font-semibold capitalize">{item.name}</p>
                    <p className="text-gray-500 text-left ml-1 text-sm">{item.studentId}</p>
                  </div>

                </td>

                <td className="p-4">{item.submitted ? "Yes" : "No"}</td>
                <td className="p-4">{item.date}</td>

                <td className="p-4">

                  {item.file !== "No Submission file" ? (
                    <a href="#" className="text-blue-500 underline">{item.file}</a>
                  ) : "No Submission"}

                </td>

                <td className="p-4">

                  {editingId === item.id ? (

                    <div className="">

                      <input
                        type="number"
                        value={tempMark[item.id]}
                        onChange={(e) => setTempMark({ ...tempMark , [item.id]: e.target.value })}
                        className="border p-1 w-16 text-center"
                        min={0}
                        max={100}
                      />
                    
                    </div>

                  ) : (

                    <span>{item.mark !== null ? item.mark : "-"}</span>

                  )}

                </td>

                <td className="p-4 space-x-4">

                  {editingId === item.id ? (

                    <>

                      <button onClick={() => handleSaveMark(item.id)} className="text-[#403685]">
                        <IoSaveSharp size={26} />
                      </button>

                      <button onClick={handleCancelEdit} className="text-[#403685] mt-1">
                        <MdOutlineCancel size={26}/>
                      </button>

                    </>

                  ) : (

                    <button onClick={() => handleEdit(item.id, item.mark)} className="text-[#403685] font-semibold underline">
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

        <YellowBtn text="Prev" disabled={page <= 1} onClick={handlePrev} />

        <span className="mx-4 text-lg font-semibold">page {page}</span>

        <YellowBtn text="Next" disabled={page >= 1} onClick={handleNext} />

      </div>

    </div>
  )


}



export default StudentAssigmentsSubmissions