import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import { FaRegClock } from "react-icons/fa"
import { MdDateRange } from "react-icons/md"
import YellowBtn from "./YellowBtn"



const CourseReminderModal = ({ onClose }) => {

    const [selectedFrequency, setSelectedFrequency] = useState("Daily")
    const [selectedDays, setSelectedDays] = useState([])
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")
  
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
    const toggleDay = (day) => {
      setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day])
    }
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

        <div className={`bg-white p-6 rounded-lg shadow-lg w-[850px] ${selectedFrequency === "Weekly" ? "h-[600px]" : "h-[500px]"}`}>

            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-semibold text-[#002147] text-center">New Course reminder</h2>
                <IoMdClose onClick={onClose} className="cursor-pointer" size={28}/>
            </div>

            <div className="mt-4">

                <label className="block text-[#002147] font-semibold text-md mb-2">Title Reminder</label>

                <input
                    type="text"
                    placeholder="Add Course Reminder"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

            </div>

            <div className="mt-8">

                <label className="block text-[#002147] font-semibold text-md mb-2">Frequency Check Reminder</label>

                <div className="flex mt-3 gap-3">

                    {["Daily", "Weekly", "Once"].map((freq) => (

                    <button
                        key={freq}
                        onClick={() => setSelectedFrequency(freq)}
                        className={`px-4 py-2 rounded-md border ${
                        selectedFrequency === freq ? "bg-[#FFF9E6] border-yellow-400" : "border-gray-300"
                        }`}
                    >
                        {freq}
                    </button>

                    ))}

                </div>

            </div>

            {selectedFrequency === "Weekly" && (

                <div className="mt-8">

                    <label className="block text-[#002147] font-semibold text-md mb-2">Day</label>

                    <div className="flex gap-2">

                        {days.map((day) => (
                            <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1 rounded-full text-[#6555BC] border-2 border-[#6555BC] text-md flex items-center gap-2 ${
                                selectedDays.includes(day) ? "bg-purple-100 border-purple-400 text-purple-700" : "border-gray-300"
                            }`}
                            >
                            + {day}
                            </button>
                        ))}

                    </div>

                </div>
                
            )}


            {(selectedFrequency === "Daily" || selectedFrequency === "Weekly") && (

                <div className="mt-6 w-[30%]">

                    <label className="block text-[#002147] font-semibold text-md mb-2">Time</label>

                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">

                        <input
                            type="time"
                            value={time}
                            placeholder="hh : mm"
                            onChange={(e) => setTime(e.target.value)}
                            className="ml-2 w-full outline-none"
                        />

                    </div>

                </div>

            )}


            {selectedFrequency === "Once" && (

                <div className="mt-6 flex items-center gap-8">

                    <div className="w-[35%]">

                        <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>

                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <MdDateRange className="text-gray-500" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="ml-2 w-full outline-none"
                            />
                        </div>

                    </div>

                    <div className="w-[35%]">

                        <label className="block text-gray-700 text-sm font-medium mb-1">Time</label>

                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <FaRegClock className="text-gray-500" />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="ml-2 w-full outline-none"
                            />
                        </div>

                    </div>

                </div>

            )}

            <div className="mt-10 flex justify-end gap-3">

                <button onClick={onClose} className="border-2 border-[#403685] text-[#403685] px-4 py-2 font-semibold rounded-lg">
                    Cancel
                </button>

                <YellowBtn text="Create Reminder" />

            </div>

        </div>

    </div>
  )

}


export default CourseReminderModal