import React from 'react'
import PurpleBtn from './PurpleBtn'
import YellowBtn from './YellowBtn'
import { IoCloseSharp } from "react-icons/io5";
import trashImg from "../assets/trash.png"



const DeleteChildModal = ({ isOpen, onClose }) => {

    if (!isOpen) return null

    return (

      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
        
          <button className="absolute top-3 right-2 text-gray-500" onClick={onClose}>
            <IoCloseSharp size={26}/>
          </button>
        
          <div className="flex items-start gap-6">
        
            <div className="bg-yellow-100 p-2 rounded-lg">
              <img src={trashImg} alt="Trash" className="w-10 h-10" />
            </div>
        
            <div>
        
              <h2 className="text-xl font-semibold text-[#000000]">Delete Child Record</h2>
        
              <p className="text-gray-700 font-semibold text-md mt-1">

                Are you sure you want to delete this child's record?
                
                <br />This action cannot be undone.
              
              </p>
        

            </div>

          </div>

          <div className="flex w-full justify-end gap-4 mt-6">

            <PurpleBtn text="Cancel" onClick={onClose} />

            <YellowBtn text="Delete" />

          </div>

        </div>

      </div>

    )

}


export default DeleteChildModal