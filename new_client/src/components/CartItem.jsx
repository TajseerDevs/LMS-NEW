import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useGetCartItemsQuery, useRemoveAllCourseItemsMutation } from '../store/apis/cartApis'
import { removeFromCart, setCartItems } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { MdDelete, MdFavoriteBorder } from 'react-icons/md'


const CartItem = ({item , refetch}) => {


    const baseUrl = `http://localhost:5500`

    const { user , token} = useSelector((state) => state.user)
    const { cart , total , subTotal } = useSelector((state) => state.cart)
    
    const dispatch = useDispatch()

    const [removeAllCourseItemsFun] = useRemoveAllCourseItemsMutation()



    const handleResetCourseItems = async (course) => {
        try {
            const res = await removeAllCourseItemsFun({token , courseId : course?._id}).unwrap()
            await refetch()
            dispatch(removeFromCart({courseId : course?._id}))
            dispatch(setCartItems({ cartItems: res}))
            toast.info("course removed successfully from cart")
        } catch (error) {
            toast.info(error?.response?.data?.msg)
        }
    }

    


  return (

    <div className="flex items-center bg-gray-100 mt-5 w-[1000px] p-4 gap-6">

        <img
            src={`${baseUrl}${item?.coursePic}` || `${baseUrl}${item?.course?.coursePic}`}
            alt="Course Thumbnail"
            className="w-42 h-42 object-contain rounded-md"
        />

        <div className='ml-10'>
            <h3 className="text-lg mb-2 font-semibold">{item?.title}</h3>
            <p className="text-gray-600">{item?.instructorId?.userObjRef?.firstName} {item?.instructorId?.userObjRef?.lastName} • ⭐{item?.rate}</p>
            <p className="text-gray-600">{item?.sections?.length} Modules</p>
        </div>

        <div className='ml-auto p-4'>

            <div className='flex items-center gap-4'>
                <MdFavoriteBorder className='text-[#6555BC] cursor-pointer' size={26}/>
                <MdDelete onClick={() => handleResetCourseItems(item)} className='text-[#FC5A5A] cursor-pointer' size={26}/>
            </div>
                        
            <p className="text-2xl font-semibold mt-4 mr-2">$ {item?.price}</p>
                    
        </div>

        </div>
    )
}

export default CartItem