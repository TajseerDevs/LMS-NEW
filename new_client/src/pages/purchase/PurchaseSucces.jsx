import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGetCartItemsQuery, useResetCartItemsMutation } from '../../store/apis/cartApis'
import { useCheckOrderSuccessMutation } from '../../store/apis/paymentApis'
import { FaCircleCheck } from "react-icons/fa6";
import { MdFavoriteBorder } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { clearCart } from '../../store/slices/cartSlice'




const PurchaseSucces = () => {


    const {token} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [isProcessing , setIsProcessing] = useState(true)
    const [error , setError] = useState("")
    const [orderId , setOrderId] = useState("")
    
    const { data , isLoading , refetch } = useGetCartItemsQuery({token})
    const [resetCartItems] = useResetCartItemsMutation()
    const [checkOrderSuccess] = useCheckOrderSuccessMutation()


    useEffect(() => {
    
        const handleCheckOutSuccess = async (sessionId) => {
            console.log('Calling checkOrderSuccess');
            try {
                const res = await checkOrderSuccess({token , sessionId}).unwrap();
                setOrderId(res.orderId);   
            } catch (error) {
                // handle error
            } finally {
                setIsProcessing(false)
            }
        }
       
        const handleClearCart = async () => {
            try {
                dispatch(clearCart())
                await resetCartItems({token}).unwrap()
                await refetch()
            } catch (error) {
                // toast.error(error.response.data.msg)
            }
        }
    
        const sessionId = new URLSearchParams(window.location.search).get("session_id")
    
            if(sessionId){
                handleCheckOutSuccess(sessionId)
                handleClearCart()
            }else{
                setIsProcessing(false)
                setError("no session id provided")
            }
    
    } , [token , isProcessing])


    const handleContinueLearning = () => {
        navigate("/enrolled-courses", { replace: true })
    }


    if(isProcessing) return "processing ..."

    if(error) return `Error : ${error}`



  return (


    <div className='h-screen flex items-center justify-center px-4'>

        <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
            
            <div className='p-6 sm:p-8'>

                <div className='flex justify-center'>
                    <FaCircleCheck className='text-emerald-400 w-16 h-16 mb-4' />
                </div>

                <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
                    Purchase Successful!
                </h1>

                <p className='text-gray-300 text-center mb-2'>
                    Thank you for your order. {"We're"} processing it now.
                </p>

                <p className='text-emerald-400 text-center text-sm mb-6'>
                    Check your email for order details and updates.
                </p>

                <div className='bg-gray-700 rounded-lg p-4 mb-6'>

                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm text-gray-400'>Order number</span>
                        <span className='text-sm font-semibold text-emerald-400'>#{String(orderId).slice(0, 7)}</span>
                    </div>

                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-400'>courses added to your learning successfully</span>
                        <span className='text-sm font-semibold text-emerald-400'></span>
                    </div>

                </div>

                <div className='space-y-4'>

                    <button
                        className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
                        rounded-lg transition duration-300 flex items-center justify-center'
                    >
                        <MdFavoriteBorder className='mr-2' size={18} />
                        Thanks for trusting us!
                    </button>

                    <button
                        onClick={handleContinueLearning}
                        className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
                        rounded-lg transition duration-300 flex items-center justify-center'
                    >
                        Continue Learning
                        <FaArrowRightLong className='ml-2' size={18} />
                    </button>

                </div>

            </div>

        </div>

    </div>
  
    )

}


export default PurchaseSucces