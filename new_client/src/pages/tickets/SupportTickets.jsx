import { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import YellowBtn from "../../components/YellowBtn";

const ticketsData = [
  {
    title: "Technical Support Title",
    status: "In Progress",
    description:
      "I sometimes face technical issues while using the educational platform. To ensure a smooth learning experience, I need timely and effective solutions from the support team. I need assistance with password resets, login errors, and account recovery.",
    priority: "urgent",
    tag: "#MKD036",
    time: "3h ago",
  },
  {
    title: "Content Support Title",
    status: "In Progress",
    description:
      "I sometimes face technical issues while using the educational platform. To ensure a smooth learning experience, I need timely and effective solutions from the support team. I need assistance with password resets, login errors, and account recovery.",
    priority: "Medium",
    tag: "#MKD036",
    time: "3h ago",
  },
  {
    title: "Technical Support Title",
    status: "In Progress",
    description:
      "I sometimes face technical issues while using the educational platform. To ensure a smooth learning experience, I need timely and effective solutions from the support team. I need assistance with password resets, login errors, and account recovery.",
    priority: "Low",
    tag: "#MKD036",
    time: "3h ago",
  },
  {
    title: "Technical Support Title",
    status: "Done - February 27, 2025",
    description:
      "I sometimes face technical issues while using the educational platform. To ensure a smooth learning experience, I need timely and effective solutions from the support team. I need assistance with password resets, login errors, and account recovery.",
    priority: "urgent",
    tag: "#MKD036",
    time: "3h ago",
  },
];



const SupportTickets = () => {

    const [search, setSearch] = useState("")
    const [page , setPage] = useState(1)
    
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
    
    const filteredTickets = ticketsData.filter((ticket) => {
        return (
          ticket.title.toLowerCase().includes(search.toLowerCase()) &&
          (filters.status ? ticket.status === filters.status : true) &&
          (filters.priority ? ticket.priority === filters.priority : true)
        )
    })


    console.log(filters)


  return (

    <div className="p-6">
    
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
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

          </div>

          <div>

            <button  onClick={() => setFilters({ status: "", sort: "", category: "", priority: "" })} className="flex items-center gap-1 text-blue-600">
                <FaFilter /> Reset Filter
            </button>

          </div>

        </div>

      </div>


      <div className="mb-4 flex items-center justify-center gap-3">

        {Object.entries(filters).map(([key, value]) =>

          value ? (
            <span key={key} className="bg-[#E8E3FF] text-[#6555BC] px-5 py-2 flex items-center gap-3     rounded-lg text-sm mr-2">
              {key} : {value}
              <button onClick={() => removeFilter(key)} className="text-blue-800 hover:text-blue-900">
                <FaTimes />
              </button>
            </span> 
          ) : null

        )}

      </div>

      <div className="space-y-6">

        {filteredTickets.map((ticket, index) => (

          <div key={index} className="bg-white w-[85%] p-4 rounded-lg shadow">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-semibold flex items-center gap-2">
                {ticket.title}
                <span className="text-sm  text-gray-500">{ticket.status}</span>
              </h2>

              <span className="text-sm text-gray-500">{ticket.time}</span>

            </div>

            <p className="text-gray-600 mt-2">{ticket.description}</p>

            <div className="flex items-center gap-3 mt-3">

              <span
                className={`px-3 py-1 text-xs rounded-full text-white ${
                  ticket.priority === "urgent"
                    ? "bg-red-500"
                    : ticket.priority === "Medium"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >

                {ticket.priority}

              </span>

              <span className="text-sm text-gray-500">{ticket.tag}</span>

            </div>

          </div>

        ))}

      </div>

      <div className='mt-16 flex items-center gap-6 justify-center'>

        <YellowBtn text="Prev" disabled={page <= 1} />

        <span className="mx-4 text-lg font-semibold">{page}</span>

        <YellowBtn text="Next" />

    </div>

    </div>

  )

}


export default SupportTickets
