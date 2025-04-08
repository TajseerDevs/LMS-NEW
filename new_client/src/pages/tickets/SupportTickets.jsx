import { useState } from "react"
import { FaFilter, FaTimes } from "react-icons/fa"
import YellowBtn from "../../components/YellowBtn"
import { useDeleteTicketMutation, useGetAllUserTicketsQuery, useUpdateTicketMutation } from "../../store/apis/TicketApis"
import { useSelector } from "react-redux"
import formatDate from "../../utils/formatDate"
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import PurpleBtn from "../../components/PurpleBtn"



const SupportTickets = () => {

  const [search, setSearch] = useState("")
  const [page , setPage] = useState(1)

  const [editingTicketId, setEditingTicketId] = useState(null)
  const [editedData, setEditedData] = useState({ subject: "", details: "" })
  const [updatingTicketId, setUpdatingTicketId] = useState(null)

  const {user , token} = useSelector((state) => state.user)
    
  const [filters, setFilters] = useState({
    status: "",
    sort: "",
    category: "",
    priority: "",
  })


  const {data , isLoading , refetch} = useGetAllUserTicketsQuery({token , page})
  
  const [updateTicket , {isLoading : isLoadingUpdateTicket}] = useUpdateTicketMutation()
  const [deleteTicket , {isLoading : isLoadingDeleteTicket}] = useDeleteTicketMutation()


  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev , [name]: value }))
  }
    

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }


  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev , [key]: "" }))
  }
  
  

  const filteredTickets = data?.userTickets?.filter((ticket) => {
    return (
      ticket?.subject?.toLowerCase().includes(search.toLowerCase()) &&
      (filters.status ? ticket.status === filters.status : true) &&
      (filters.priority ? ticket.priority === filters.priority : true)
    )
  })


  const handleEditClick = (ticket) => {
    setEditingTicketId(ticket?._id)
    setEditedData({ subject: ticket?.subject , details: ticket?.details })
  }

  
  const handleCancelEdit = () => {
    setEditingTicketId(null)
    setEditedData({ subject: "" , details: "" })
  }



  const handleDeleteClick = (ticket) => {
    setEditingTicketId(ticket?._id)
  }


  const handleDeleteEdit = () => {
    setEditingTicketId(null)
  }




  const handleSaveEdit = async (ticketId) => {

    setUpdatingTicketId(ticketId)

    try {

      await updateTicket({
        token ,
        ticketId ,
        subject : editedData.subject ,
        details : editedData.details ,
      }).unwrap()
  
      setEditingTicketId(null)
  
      await refetch()
      
      setEditingTicketId(null)
      setEditedData({ subject: "" , details: "" })
      
    } catch (error) {
      console.log(error)
    }finally{
      setUpdatingTicketId(null)
    }
  
  }



  if(isLoading || isLoadingUpdateTicket){
    return <h1 className="p-10 text-xl">Loading ...</h1>
  }




  return (

    <div className="px-10 py-6">
    
      <h1 className="text-2xl text-[#002147] mb-12 font-semibold">Support Tickets</h1>

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center mb-6 justify-between gap-8 w-[85%]">

          <div>

            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search"
              className="border px-3 w-[300px] py-2 rounded-lg focus:outline-none"
            />

          </div>
          
          <div className="flex items-center gap-6">

            <select value={filters.sort} onChange={handleFilterChange} name="sort" className="border px-3 w-[200px] py-2 rounded-lg">
              <option value="" selected disabled>Sort by: A-Z</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
            
            <select value={filters.status} name="status" onChange={handleFilterChange} className="border px-3 w-[200px] py-2 rounded-lg">
              <option value="" selected disabled>Sort by: status</option>
              <option value="inProgress">In Progress</option>
              <option value="pending">pending</option>
              <option value="closed">closed</option>
            </select>
            
            <select value={filters.category} name="category" onChange={handleFilterChange} className="border px-3 w-[200px] py-2 rounded-lg">
              <option value="" selected disabled>Category type</option>
              <option value="content">content</option>
              <option value="technical">technical</option>
            </select>
            
            <select value={filters.priority} name="priority" onChange={handleFilterChange} className="border px-3 w-[200px] py-2 rounded-lg">
              <option value="" selected disabled>Priority</option>
              <option value="urgent">Urgent</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

          </div>

          <div>

            <button  onClick={() => setFilters({ status: "", sort: "", category: "", priority: "" })} className="flex items-center gap-1 text-blue-600">
              <FaFilter/> Reset Filter
            </button>

          </div>

        </div>

      </div>


      <div className="mb-4 flex items-center justify-center gap-3">

        {Object.entries(filters).map(([key, value]) =>

          value ? (

            <span key={key} className="bg-[#E8E3FF] text-[#6555BC] px-5 py-2 flex items-center gap-3 rounded-lg text-sm mr-2">

              {key} : {value}

              <button onClick={() => removeFilter(key)} className="text-blue-800 hover:text-blue-900">
                <FaTimes />
              </button>

            </span> 

          ) : null

        )}

      </div>

      <div className="space-y-6">

        {filteredTickets?.map((ticket , index) => (

          <div key={index} className="bg-white w-[85%] p-4 rounded-lg shadow">

            <div className="flex items-center justify-between">

              <h2 className="text-lg capitalize font-semibold flex items-center gap-4">

                {editingTicketId  === ticket?._id ? (

                  <input
                    type="text"
                    value={editedData.subject}
                    onChange={(e) => setEditedData({ ...editedData, subject: e.target.value })}
                    className="border rounded px-3 py-1 w-full max-w-md"
                  />

                  ) : (
                    <span>{ticket?.subject}</span>
                  )}

                  <span className="text-sm capitalize text-gray-500">{ticket?.status}</span>

              </h2>

              <div className="flex items-center gap-6">

              <div className="flex gap-2">

              {editingTicketId === ticket?._id ? (

                <>

                    {updatingTicketId === ticket._id ? (

                      <YellowBtn text="Saving..." disabled />

                    ) : (

                      <>
                        <YellowBtn text="Save" onClick={() => handleSaveEdit(ticket?._id)} />
                        <PurpleBtn onClick={handleCancelEdit} text="Cancel" />
                      </>

                    )}

                  </>

                ) : (

                  <>

                    <button onClick={() => handleEditClick(ticket)}>
                      <MdModeEdit className="text-[#6555BC]" size={24} />
                    </button>

                    <button>
                      <MdDelete className="text-red-500" size={24} />
                    </button>

                  </>

                )}

                </div>

                <span className="text-md text-gray-500">{formatDate(ticket?.createdAt)}</span>
              
              </div>

            </div>

            {editingTicketId === ticket._id ? (

              <div className="mt-4">

                <textarea
                  value={editedData.details}
                  onChange={(e) => setEditedData({ ...editedData , details: e.target.value })}
                  className="border rounded px-3 py-2 w-full"
                />

              </div>

                ) : (

              <p className="text-gray-600 mt-2 capitalize">{ticket?.details}</p>

            )}

            <div className="flex items-center gap-3 mt-3">

              <span
                className={`px-3 py-1 capitalize text-xs rounded-full text-white ${
                  ticket?.priority === "urgent" ? "bg-red-500" : ticket?.priority === "Medium" ? "bg-blue-500" : "bg-green-500"
                }`}
              >

                {ticket?.priority}

              </span>

              <span className="text-sm bg-gray-100 p-1 uppercase rounded-lg text-gray-500">#{ticket?.ticketCode}</span>

            </div>

          </div>

        ))}

      </div>

      <div className='mt-16 flex items-center gap-6 justify-center'>

        <YellowBtn text="Previous" disabled={data?.page <= 1} />

        <span className="mx-4 text-lg font-semibold">Page {page} from {data?.totalPages}</span>

        <YellowBtn disabled={data?.page >= data?.totalPages} text="Next" />

      </div>

    </div>

  )

}


export default SupportTickets
