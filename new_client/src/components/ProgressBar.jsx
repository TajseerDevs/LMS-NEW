import React from "react"


const ProgressBar = ({ percentage = 0, color = "#000" }) => {

  return (
    <div className="flex flex-col lg:flex-row items-center mr-2 gap-2">

      <div className="w-44 h-5 bg-gray-200 rounded-full overflow-hidden shadow-sm">
        
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}`, backgroundColor: color }}
        ></div>

      </div>

      <span
        className="text-lg w-[40px] text-right font-medium ml-1 text-gray-700"
      >
        {percentage}
      </span>

    </div>
  )
}

export default ProgressBar
