import { useState } from "react";
import { FaStar } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoCloseSharp } from "react-icons/io5";


const CourseRatePopUp = ({ onClose }) => {

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  
  const handleRating = (value) => {
    setRating(value);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">

      <div className="bg-white p-6 rounded-lg shadow-lg w-[720px] h-[730px]">

        <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-semibold text-[#002147] text-center">Rate this Course</h2>
            <IoCloseSharp onClick={onClose} className="cursor-pointer" size={28}/>
        </div>

        <div className="flex flex-col items-center">

            <p className="text-[#002147] text-center text-[16px] mt-2 mb-4">
                We'd love to hear your thoughts! Your feedback helps us improve and guide other learners.
            </p>

            <span className="text-lg">How would you rate this course?</span>

        </div>

        <div className="flex justify-center gap-2 mt-4">

          {[1, 2, 3, 4, 5].map((star) => (

            <FaStar
                key={star}
                size={50}
                strokeWidth={50} 
                stroke="#FFC403" 
                fill={rating >= star ? "#FFC403" : "white"} 
                className="cursor-pointer transition-colors"
                onClick={() => handleRating(star)}
            />

          ))}

        </div>

        {/* Feedback Input */}
        <div className="mt-8">

          <label className="block text-gray-700 font-medium">Tell us about your Experience</label>

          <ReactQuill
            theme="snow"
            value={feedback}
            onChange={setFeedback}
            placeholder="Write your feedback in the input field"
            className="mt-2 bg-white h-[270px]"
          />
          
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-20 space-x-4">

          <button
            className="px-4 py-2 border-[3px] text-[#403685] font-semibold border-[#403685] rounded-lg"
            onClick={onClose}
          >
            Maybe Later
          </button>

          <button
            className={`px-4 py-2 rounded-lg ${rating > 0 && feedback.trim() ? "bg-[#FFC403] text-[#002147] font-semibold" : "bg-gray-300 text-white cursor-not-allowed"}`}
            disabled={!(rating > 0 && feedback.trim())}
          >
            Submit Review
          </button>

        </div>

      </div>

    </div>

  )

}


export default CourseRatePopUp
