import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa"
import { IoAddOutline } from "react-icons/io5"
import { IoIosRemove } from "react-icons/io"
import { useSelector } from 'react-redux'
import { useGetMyStudentsQuery } from '../../store/apis/parentApis'
import { useNavigate } from 'react-router-dom'
import defaultImage from "../../assets/laith-img.png"
import DeleteChildModal from '../../components/DeleteChildModal'



const BASE_URL = "http://10.10.30.40:5500"



const Childs = () => {

    const navigate = useNavigate()

    const {token , user} = useSelector((state) => state.user)

    const {data : students , isLoading} = useGetMyStudentsQuery({token})

    const [showModal , setShowModal] = useState(false)


    if(isLoading){
        return <h1>Loading ...</h1>
    }



  return (

    <div className="min-h-screen bg-[#f9f9ff] p-10">

        <h1 className="text-3xl font-semibold text-[#0f1b3d] mb-6">My Children</h1>

        <div className="relative max-w-md mb-12">

            <input
                type="text"  
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-[#f1f2f6] focus:outline-none"
            />

            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch/>
            </span>

        </div>

        <div className="flex flex-col items-center gap-12">

        {/* Parent card */}

            <div className="relative bg-white shadow-md rounded-lg p-8 text-center w-[223px] h-[224px]">

                <img
                    src="https://i.pravatar.cc/100?img=10"
                    alt="Parent"
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                />

                <h2 className="font-semibold text-lg capitalize">{user?.firstName} {user?.lastName}</h2>

                <p className="text-gray-500 mb-3 capitalize">{user?.role}</p>

                <button className="text-sm border border-[#3b298a] text-[#3b298a] px-4 py-1 rounded">
                    View profile
                </button>

                <div onClick={() => navigate("/parent/add-child")} className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
                    <IoAddOutline size={22}/>
                </div>

            </div>

            <div className="flex gap-6">

                {students?.map((child) => (

                    <div key={child?.userObjRef?._id} className="relative bg-white shadow-md rounded-lg p-8 text-center w-[223px] h-[224px]">

                        <img
                            src={child?.userObjRef?.profilePic ? `${BASE_URL}${child?.userObjRef?.profilePic}` : defaultImage} alt={child?.userObjRef?.firstName}
                            className="w-16 h-16 rounded-full mx-auto mb-2"
                        />

                        <h2 className="font-semibold text-lg">{child?.userObjRef?.firstName} {child?.userObjRef?.lastName}</h2>
                        <p className="text-gray-500 mb-3">{child?.userObjRef?.role}</p>

                        <button onClick={() => navigate(`/parent/children/profile/${child?.userObjRef?._id}`)} className="text-sm border border-[#3b298a] text-[#3b298a] px-4 py-1 rounded">
                            View profile
                        </button>

                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
                            <IoIosRemove onClick={() => setShowModal(true)} size={22}/>
                        </div>

                    </div>

                ))}

                {/* Add new child card */}
                <div className="flex items-end pb-24 ml-2">

                    {/* <div className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
                        <IoAddOutline size={22}/>
                    </div> */}

                    <div className="relative bg-[#ECEBF3] shadow-md flex items-center justify-center rounded-lg p-8 text-center w-[223px] h-[224px]">

                        <h2 className="font-semibold text-lg text-center">Add New Child</h2>

                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
                            <IoAddOutline onClick={() => navigate("/parent/add-child")} size={22}/>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        <DeleteChildModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </div>

  )

}



export default Childs