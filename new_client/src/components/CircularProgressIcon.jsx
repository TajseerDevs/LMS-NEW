import React from "react";

const CircularProgressIcon = ({ progress, icon, color, staticNumber , className }) => {

  const radius = 50
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius

  const progressValue = staticNumber !== undefined ? Math.min(Math.max(staticNumber, 0), 100) : progress
  
  const strokeDashoffset = circumference - (progressValue / 100) * circumference

  return (
    <div className="relative flex justify-center items-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className={`absolute text-purple-600 flex items-center text-2xl ${className}`}>
        {typeof icon === "string" ? (
          <img src={icon} alt="icon" className="w-10 h-10" />
        ) : (
          icon || "📘"
        )}
      </div>
    </div>
  )
}


export default CircularProgressIcon
