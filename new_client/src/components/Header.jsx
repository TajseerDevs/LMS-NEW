import React from 'react'
import {FaBars , FaSearch , FaBell , FaUserCircle , FaShoppingCart , FaHeart} from "react-icons/fa"
import { FaMessage } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { Link , useNavigate } from 'react-router-dom'
import { useGetCartItemsQuery } from '../store/apis/cartApis';


const Header = ({openSideBar , setopenSideBar}) => {

  const navigate = useNavigate()

  const {user , token} = useSelector((state) => state.user)
  const {cart} = useSelector((state) => state.cart)

  const { data , isLoading, error , refetch } = useGetCartItemsQuery({token})
  

  return (
    
    <nav className={`bg-[#FFF] px-4 py-4 flex justify-between ${openSideBar ? "" : "lg:ml-72"} `}>
        
        <div className='flex items-center text-xl'>

            <FaBars className={`${openSideBar ? "text-[#6555BC]" : "text-white"} ${openSideBar ? "ml-28" : ""}   lg:text-[#6555BC] h-6 w-6 ml-1 me-4 cursor-pointer z-40`} onClick={() => setopenSideBar(!openSideBar)}/>

            <div className='relative w-[416px] ml-6'>

                <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
                    <button className='p-1 focus:outline-none text-[#6555BC] md:text-black'><FaSearch className='bg-transparent text-gray-400'/></button>
                </span>

                <input className='w-full bg-[#ECEBF3] px-4 py-2 pl-12 rounded shadow outline-none hidden md:block' type="text" placeholder='Search ...' />

            </div>

        </div>

        <span className='text-white text-center text-2xl font-semibold flex-grow'>TAJSEER LMS</span>

        <div className='flex items-center mr-5 justify-center gap-x-6'>

            <FaHeart onClick={() => navigate("/wishlist")}  className='w-6 cursor-pointer h-6 text-[#6555BC]' />

            <div onClick={() => navigate("/order-summary")} className='text-white cursor-pointer relative'>

                <FaShoppingCart className='w-6 h-6 text-[#6555BC]'/>

                <span className="absolute -top-4 -right-5 bg-[#6555BC] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {data?.cartItems?.length}
                </span>

            </div>

            <div className='text-white'><FaBell className='w-6 h-6 text-[#6555BC]'/></div>

            <div className='relative'>

                <button className='text-white group'>

                    <div className='flex items-center gap-5'>
                        <FaUserCircle onClick={() => navigate("/instructor/profile")} className='w-6 text-[#6555BC] h-6 mt-1'/>
                        <h4 className='mt-1 text-[18px] text-[#002147] capitalize'>{user?.firstName} {user?.lastName}</h4>
                    </div>
                    
                    <div className='z-10 hidden bg-white absolute rounded-lg shadow w-32 group-focus:block top-10 -right-5'>

                    </div>

                </button>

            </div>

        </div>

    </nav>
  )
}



export default Header