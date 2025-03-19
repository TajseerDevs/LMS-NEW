import React from 'react'



const PurpleBtn = ({ text, icon: Icon, className = "", onClick }) => {
  return (
    <button 
      className={`border-2 border-[#403685] text-[#403685] capitalize font-semibold px-5 py-1 rounded-lg ${className}`} 
      onClick={onClick}
    >
      {text}
      {Icon && <Icon />} 
    </button>
  )
}

export default PurpleBtn