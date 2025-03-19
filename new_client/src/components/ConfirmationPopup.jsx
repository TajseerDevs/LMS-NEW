import React from 'react'
import { FaCheckCircle } from "react-icons/fa";


const ConfirmationPopup = ({ course, onConfirm, onCancel }) => {

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">

        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[200px] text-center">

            <h2 className="text-xl text-left font-semibold mb-4 flex items-center gap-2">Confirm Enrollment <FaCheckCircle size={25} className='text-green-400'/></h2>

            <p className="text-gray-700 text-left text-lg mb-8">
                Are you sure 
                you want to enroll in <strong>{course?.title} course</strong>?
            </p>

            <div className="flex mt-2 items-end justify-end space-x-4">

                <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">
                    Cancel
                </button>

                <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Confirm
                </button>

            </div>
        
        </div>

    </div>  
  
    )

}



export default ConfirmationPopup