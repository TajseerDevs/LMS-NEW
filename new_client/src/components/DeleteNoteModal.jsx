import React from "react";
import { IoTrash } from "react-icons/io5";


const DeleteNoteModal = ({ isOpen, onClose, onDelete }) => {

  if (!isOpen) return null

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">

      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">

        <div className="flex justify-start mb-4">

          <div className="bg-red-100 p-3 rounded-lg">
            <IoTrash className="text-red-500 text-3xl" />
          </div>

        </div>

        <h2 className="text-2xl font-semibold text-left">Are you sure you want to delete this note?</h2>

        <p className="text-gray-500 text-md text-left mt-2">This action cannot be undone.</p>

        <div className="flex justify-end mt-8 gap-3">

          <button
            onClick={onClose}
            className="border-2 border-[#403685] text-[#403685] font-semibold px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  )

}


export default DeleteNoteModal
