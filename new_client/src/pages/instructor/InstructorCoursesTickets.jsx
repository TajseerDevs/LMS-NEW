import React, { useState } from "react";
import { FaFilter, FaSearch , FaCheck } from "react-icons/fa";
import YellowBtn from "../../components/YellowBtn";
import { useSelector } from "react-redux";
import { useGetInstructorContentTicketsQuery } from "../../store/apis/instructorApis";
import formatDate from "../../utils/formatDate";

const initialTickets = [
    { id: "#ABC000126", title: "Content Support Title", status: "inProgress", priority: "urgent", category: "content", tag: "GOOD", timeAgo: "3h ago" },
    { id: "#ABC000125", title: "Content Support Title", status: "pending", priority: "Low", category: "technical", tag: "WARNING", timeAgo: "3h ago" },
    { id: "#ABC000124", title: "Content Support Title", status: "inProgress", priority: "Medium", category: "content", tag: "INFO", timeAgo: "3h ago" },
    { id: "#ABC000123", title: "Content Support Title", status: "closed", priority: "urgent", category: "content", tag: "URGENT", timeAgo: "3h ago" },
    { id: "#ABC000122", title: "Content Support Title", status: "pending", priority: "Low", category: "technical", tag: "URGENT", timeAgo: "3h ago" },
]



const InstructorCoursesTickets = () => {

  const {token} = useSelector((state) => state.user)
  const [search, setSearch] = useState("")
  const [tickets, setTickets] = useState(initialTickets)
  const [selectedTickets, setSelectedTickets] = useState(new Set())
  const [page , setPage] = useState(1)
  
  const {data} = useGetInstructorContentTicketsQuery({token , page})

  const [filters, setFilters] = useState({
    status: "",
    sort: "",
    category: "",
    priority: "",
  })


  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }
    
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }))
  }
    

  const handleCheckboxChange = (id) => {
    setSelectedTickets((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.has(id) ? updatedSet.delete(id) : updatedSet.add(id);
      return updatedSet;
    })
  }
    

  const handleDone = () => {
    setTickets(tickets.filter((ticket) => !selectedTickets.has(ticket.id)));
    setSelectedTickets(new Set());
  }
    

  const filteredTickets = data?.tickets.filter((ticket) => {
    return (
      ticket.subject.toLowerCase().includes(search.toLowerCase()) &&
      (filters.status ? ticket?.status === filters?.status : true) &&
      (filters?.category ? ticket?.category === filters?.category : true) &&
      (filters?.priority ? ticket?.priority === filters?.priority : true)
    )
  })


  const sortedTickets = [filteredTickets].sort((a, b) => {
    if (filters.sort === "a-z") {
      return a?.subject.localeCompare(b.title);
    } else if (filters.sort === "z-a") {
      return b.subject.localeCompare(a.title);
    }
    return 0
  })




  return (

   <div className="p-10">

    <h1 className="text-2xl text-[#002147] mb-10 font-semibold">Support Tickets</h1>

      <div className="flex items-center mb-8 justify-between gap-8 w-[85%]">
 
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
 
        <div className="flex items-center gap-8">

          {selectedTickets.size > 0 && <YellowBtn onClick={handleDone} text="Done" icon={FaCheck} />}

          <button  onClick={() => setFilters({ status: "", sort: "", category: "", priority: "" })} className="flex items-center gap-1 text-blue-600">
            <FaFilter/> Reset Filter
          </button>
 
        </div>
 
      </div>

      
      <div className="space-y-6">

        {filteredTickets?.map((ticket) => (

          <div key={ticket?._id} className="bg-white w-[85%] p-4 rounded-lg shadow-md flex items-start gap-4">
            
            <input onChange={() => handleCheckboxChange(ticket?._id)} type="checkbox" className="mt-1 w-5 h-5 text-blue-500" />

            <div className="flex-1">

              <h2 className="text-lg capitalize mb-2 font-semibold flex items-center gap-6">
                {ticket?.subject}
                <span className="text-sm capitalize text-[#6E6E71]">{ticket?.status}</span>
              </h2>

              <p className="text-[#000] font-semibold capitalize text-sm">
                {ticket?.details}
              </p>

              <div className="flex items-center gap-3 mt-2">

                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${ticket?.priority === "urgent" ? "bg-red-500" : ticket?.priority === "Medium" ? "bg-[#60E7FF] text-[#005E8E]" : ticket?.priority === "Low" ? "bg-[#D7FFE6] text-[#009912]" : "bg-blue-500"}`}>
                  {ticket?.priority}
                </span>

                <span className="text-gray-500 text-xs">#{ticket?.ticketCode}</span>

              </div>

            </div>

            <div className="text-right text-sm text-gray-500">
              <p>{formatDate(ticket?.createdAt)}</p>
            </div>

          </div>

        ))}

      </div>

      <div className='mt-6 flex items-center gap-6 justify-center'>

        <YellowBtn
          text="Prev"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        />

        <span className="mx-4 text-lg font-semibold">Page {data?.currentPage} of {data?.totalPages}</span>

        <YellowBtn
          text="Next"
          onClick={() => {
            if (data?.currentPage < data?.totalPages) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={data?.currentPage >= data?.totalPages}
        />

      </div>

    </div>

    )
}



export default InstructorCoursesTickets