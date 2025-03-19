import { useState } from "react";
import { FaStar } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoCloseSharp } from "react-icons/io5"


const ReportFeedbackPopUp = ({ onClose }) => {

    const [feedback, setFeedback] = useState("")
    const [reportReason, setReportReason] = useState("")
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">

      <div className="bg-white p-6 rounded-lg shadow-lg w-[720px] h-[730px]">

        <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-semibold text-[#002147] text-center">Report review</h2>
            <IoCloseSharp onClick={onClose} className="cursor-pointer" size={28}/>
        </div>

        <div className="flex flex-col items-center">

            <p className="text-[#002147] text-center text-[16px] mt-2 mb-4">
                If you believe this review contains inappropriate content, misleading information, or violates our guidelines, please select a reason
            </p>

        </div>

        <div className="flex justify-center gap-2 mt-4">

                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="p-2 w-full border rounded-lg bg-white shadow-sm text-[#002147]">
                    <option value="" disabled selected>Please Select a reason</option>
                    <option value="spam">spam or fake review</option>
                    <option value="Inappropriate">Inappropriate language or content</option>
                    <option value="Hate speech">Hate speech or harassment</option>
                    <option value="Misinformation">Misinformation or false claims</option>
                    <option value="others   ">others</option>
                </select>

        </div>

        {/* Feedback Input */}
        <div className="mt-8">

          <label className="block text-gray-700 font-medium">Report details</label>

            <ReactQuill
                theme="snow"
                value={feedback}
                onChange={setFeedback}
                placeholder="Write your  report in details"
                className="mt-2 bg-white h-[270px]"
            />
            
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-20 space-x-4">

          <button
            className="px-4 py-2 border-[3px] text-[#403685] font-semibold border-[#403685] rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-4 py-2 rounded-lg bg-[#FFC403] text-[#002147] font-semibold cursor-not-allowed`}
          >
            Submit Review
          </button>

        </div>

      </div>

    </div>
    )
}



export default ReportFeedbackPopUp