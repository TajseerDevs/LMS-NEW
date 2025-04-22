import React from 'react'
import layerImg from "../../assets/layer-image.png"
import defaultImage from "../../assets/laith-img.png"
import { MdModeEdit } from "react-icons/md"
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetChildInfoQuery } from '../../store/apis/parentApis'
import formatDate from '../../utils/formatDate'
import calculateAge from '../../utils/calculateAge'




const BASE_URL = "http://10.10.30.40:5500"


const ChildProfile = () => {

    const {childId} = useParams()
    const {token} = useSelector((state) => state.user)

    const {data : child} = useGetChildInfoQuery({token , childId})


  return (

    <div>

        <div className="bg-[#F0EEF8] p-6 flex justify-between items-center">

            <h2 className="text-4xl font-semibold mb-12 capitalize p-8 text-[#002147]">Student profile</h2>

            <img
                src={layerImg}
                alt="Design Pattern"
                className="h-[250px] rounded-lg opacity-95 object-contain"
            />

        </div>

        <div className="p-6 rounded-lg mx-4 -mt-20 relative z-10">

            <div className="flex items-center gap-4">

                <img
                    src={child?.child?.profilePic ? `${BASE_URL}${child?.child?.profilePic}` : defaultImage} 
                    alt={child?.child?.firstName}
                    className="w-28 h-28 rounded-full border-4 border-[#403685] object-cover"
                />

                <div className='ml-2'>

                    <h3 className="text-3xl font-semibold text-[#002147]">{child?.child?.firstName} {child?.child?.lastName}</h3>

                    <div className='flex items-center justify-between gap-20 w-full'>
                        <p className="text-xl mt-1 font-semibold text-[#AFAFAF]">Student ID : {child?.child?._id}</p>
                        <button><MdModeEdit className='mt-2 text-[#6555BC]' size={24}/></button>
                    </div>

                </div>

            </div>

        </div>

        <div className="flex flex-col gap-8 justify-start w-[40%] p-14 text-sm text-[#1B1B1F]">

            <div className='flex items-center justify-between'>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Name : </p>
                    <p className='text-[#403685] text-xl font-semibold'>{child?.child?.firstName} {child?.child?.lastName}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Gender : </p>
                    <p className="text-[#403685] text-xl font-semibold capitalize">{child?.child?.gender}</p>
                </div>

            </div>

            <div className='flex items-center justify-between'>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Date of Birth :</p>
                    <p className='text-[#403685] text-xl font-semibold'>{formatDate(child?.child?.dateOfBirth)}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Age :</p>
                    <p className="text-[#403685] text-xl font-semibold">{calculateAge(child?.child?.dateOfBirth)} Years old</p>
                </div>
            
            </div>

            <div className='flex items-center justify-between'>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Educational Stage :</p>
                    <p className='text-[#403685] text-xl font-semibold'>{child?.existChild?.educationLevel}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <p className="font-semibold text-[#002147] text-xl">Grade :</p>
                    <p className='text-[#403685] text-xl font-semibold'>{child?.existChild?.educationLevel}</p>
                </div>
            
            </div>

            <div className='flex items-center justify-between'>

                <div  className='flex gap-2 items-start'>
                    <p className="font-semibold text-[#002147] text-xl">Student Special Needs :</p>
                    <p className='text-[#403685] text-xl font-semibold'>{child?.existChild?.specialNeeds ? "Yes" : "No"}</p>
                </div>

                <div  className='flex gap-2 items-start'>
                    <p className="font-semibold text-[#002147] text-xl">Email : </p>
                    <p className='text-[#403685] text-xl font-semibold'>{child?.child?.email}</p>
                </div>
            
            </div>

        </div>

    </div>

  )

}


export default ChildProfile