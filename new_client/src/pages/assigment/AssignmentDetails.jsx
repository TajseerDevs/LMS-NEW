import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import YellowBtn from '../../components/YellowBtn';



const AssignmentDetails = () => {

    const navigate = useNavigate()

  return (
    <div className='p-2'>

        <div className='bg-white h-[80px] ml-1 flex items-center gap-8 p-6 w-full'>
            <button onClick={() => navigate(`/course/main-page/67ada2dbb22c8ec372e03ec2`)} className='flex text-[#FFC200] font-semibold text-xl items-center gap-2'><FaArrowLeft className='mt-1' size={22}/> Back</button>
            <span className='text-[#403685] font-semibold text-xl'>Science course</span>
        </div>

        <div className='p-10 mt-8'>

            <h2 className='text-[#002147] text-2xl font-semibold'>Assignment Name</h2>

            <hr className='mt-6' />

            <div className='mt-6 flex items-center justify-between'>

                <div className='flex items-center text-lg gap-10'>

                    <span className='text-[#6E6E71] font-semibold'>Due Date : <span className='text-[#002147] font-semibold'>March 15 2025</span> </span>
                    
                    <span className='text-[#6E6E71] font-semibold'>Time Remaining : <span className='text-[#002147] font-semibold'>13 days</span> </span>

                </div>

                <span className='text-[#6E6E71] font-semibold text-lg'>Assignment Grade : <span className='text-[#002147] font-semibold'>10 Marks</span> </span>

            </div>

            <hr className='mt-6' />

            <div className='mt-6'>

                <span className='text-[#002147] font-semibold text-xl'>Assignment Instruction</span>

                <p className='w-[80%] mt-4 text-[#000000] text-lg'>
                    Create a nutritious 1 week meal plan for a family of 5. In this family, we have a a middle-aged couple who are generally healthy but would do best if they lost some weight. The family also consists of an elderly grandma who has health issues like arthritis, hypertension, and diabetes  The couple also have two kids their eldest is a 16 y/o boy who is underweight for height of 5.9" and they youngest is a 7 y/o girl who is healthy but lactose intolerant ? This will count towards your midterm grade so be sure to put your best work forward.
                </p>

            </div>

            <hr className='mt-6' />

        </div>

        <div className='p-6 flex items-end justify-end'>
            <YellowBtn onClick={() => navigate(`/submit-assignment-submission/123434214133/67ada2dbb22c8ec372e03ec2`)} text="Start Assignment Submit" />
        </div>

    </div>

  )

}



export default AssignmentDetails