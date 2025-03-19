import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import YellowBtn from './YellowBtn'
import PurpleBtn from './PurpleBtn'



const QuizSubmissionPopUp = ({ onClose , onConfirm }) => {

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-[680px]">
            
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[#002147] text-center">Quiz Submission Confrimation</h2>
                <IoCloseSharp onClick={onClose} className="cursor-pointer" size={28}/>
            </div>

            <hr />

            <div className='p-2 mt-4'>
                <span className='text-[#002147] text-lg'>You are about to submit your quiz ... </span>
                <br />
                <span className='text-[#002147] text-lg'>Once you press the Submit Quiz button you cannot return to your quiz.</span>
            </div>

            <div className='flex items-center gap-4 mt-10'>
                <PurpleBtn onClick={onClose} text="Back to questions"/>
                <YellowBtn onClick={onConfirm} text="Submit Quiz"/>
            </div>

        </div>

    </div>

  )

}



export default QuizSubmissionPopUp