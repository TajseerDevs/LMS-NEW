import React from 'react'



const YellowBtn = ({ text, icon: Icon, className = "", onClick , disabled }) => {

  return (
    <button
      disabled={disabled} 
      className={`text-[#002147] disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#FFC200] flex items-center gap-2 capitalize font-semibold px-5 py-2 rounded-lg ${className}`} 
      onClick={onClick}
    >
      {text}
      {Icon && <Icon />} 
    </button>
  )
}

export default YellowBtn