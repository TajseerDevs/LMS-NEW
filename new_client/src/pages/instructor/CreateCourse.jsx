import React ,{ useState , useRef } from 'react'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import uploadImg from "../../assets/upload_img.svg"
import { FiClock } from "react-icons/fi"
import { FaPlus } from "react-icons/fa"
import { useCreateCourseMutation } from '../../store/apis/instructorApis'
import { MdOutlineCancel } from "react-icons/md";



const CreateCourse = () => {

    const { token } = useSelector((state) => state.user)
    
    const dispatch = useDispatch()
    const location = useLocation()

    const fileInputRef = useRef(null)
    
    const [page , setPage] = useState(1)

    const [duration , setDuration] = useState()
    const [title , setTitle] = useState("")
    const [price , setPrice] = useState("")
    const [level , setLevel] = useState("")
    const [description , setDescription] = useState("")
    const [category , setCategory] = useState("University")
    const [learningCategory , setlearningCategory] = useState("IT & Software")
    const [extraInfo , setExtraInfo] = useState("")
    const [coursePic , setCoursePic] = useState(null)
    const [tags , setTags] = useState([])
    const [isPaid, setIsPaid] = useState(true)

    const [createCourse , {isLoading , isError}] = useCreateCourseMutation()

    
    const handleFileChange = (e) => {

        const file = e.target.files[0]

        if (file) {
          setCoursePic(file)
        }

    }

    const handleContainerClick = () => {

        if (fileInputRef.current) {
          fileInputRef.current.click()
        }

    }




    const handleAddCourse = async (e) => {

        e.preventDefault()

        try {
            
            const response = await createCourse({
                token ,
                title ,
                isPaid ,
                duration ,
                coursePic ,
                extraInfo ,
                tags ,
                description ,
                category , 
                learningCategory ,
                level ,
            }).unwrap()

            console.log(response)
            
            setTitle("")
            setIsPaid(true)
            setDuration("")
            setCategory("")
            setCoursePic(null)
            setDescription("")
            setTags([])
            setlearningCategory("")
            setLevel("")
            setExtraInfo("")
            
            toast.info("Your course has been created and is pending admin approval.")
            
        } catch (error) {
            
        }
    }


    // const handleNextPage = () => page < totalPages && setPage(page + 1)
    // const handlePrevPage = () => page > 1 && setPage(page - 1)


    

  return (
    <div className='w-[90%] mx-auto p-6'>

        <h3 className='text-[#002147] font-semibold text-3xl'>Add New Course</h3>

        <div className='mt-14 mb-3 flex gap-3 items-center'>
            <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
            <span className='text-[#797979] text-xl'>Cover Image</span>
        </div>

        <div className='flex items-center gap-4'>
            <span className='mb-2 text-[#002147] text-lg font-semibold'>{coursePic?.name}</span>
            {coursePic !== null && <MdOutlineCancel onClick={() => setCoursePic(null)} className='mb-1 text-[#002147] cursor-pointer' size={26}/>}
        </div>

        <div onClick={handleContainerClick} className="w-[70%] cursor-pointer h-[330px] mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                name='coursePic'
            />

            <img src={uploadImg} alt="" />
            <p className="text-[#002147] text-lg font-semibold">Click to <span className="text-[#6555BC] font-semibold cursor-pointer">Browse</span> and upload image</p>
            <p className="text-sm mt-1 font-semibold text-[#545454]">Recommended max 50 MB (png, jpg, jpeg)</p>
        
        </div>

        <div className='w-[70%] mt-10'>

            <div className='flex gap-20 items-center'>

                <div className='flex flex-col justify-start'>

                    <div className='flex items-center gap-3'>
                        <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                        <label className='text-[#797979] text-xl' htmlFor="">Course Title</label>
                    </div>

                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your course title goes here ..." className='p-4 rounded-md border-2 mt-2 w-[400px]' type="text" name="title" id="" />

                </div>

                <div className='flex flex-col justify-start'>

                    <div className='flex items-center gap-3'>
                        <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                        <label className='text-[#797979] text-xl' htmlFor="">Type of Learner</label>
                    </div>

                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-4 rounded-md border-2 mt-2 w-[400px]" name="category">
                        <option value="University">University</option>
                        <option value="k-12">k-12</option>
                        <option value="Trainee">Trainee</option>
                    </select>

                </div>

                <div className='flex flex-col justify-start'>

                    <div className='flex items-center gap-3'>
                        <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                        <label className='text-[#797979] text-xl' htmlFor="">Category learning</label>
                    </div>

                    <select onChange={(e) => setlearningCategory(e.target.value)} value={learningCategory} className="p-4 rounded-md border-2 mt-2 w-[400px]" name="learningCategory">
                        <option value="IT & Software">IT & Software</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Science">Science</option>
                        <option value="Language">Language</option>
                        <option value="Trending">Trending</option>
                    </select>

                </div>

            </div>

        </div>


        <div className='w-[70%] mt-14'>

            <div className='flex gap-10 justify-between items-center'>

                <div className="flex flex-col">

                    <div className='flex items-center gap-3'>
                        <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                        <label className='text-[#797979] text-xl' htmlFor="">Level</label>
                    </div>

                    <div className='flex items-center gap-6 mt-3 justify-start'>

                        <div className='bg-white p-1 px-4 rounded-md'>
                        
                            <label className="flex cursor-pointer items-center space-x-2">

                                <input checked={level === "Beginner"} value="Beginner" onChange={() => setLevel("Beginner")} type="radio" name="level" className="hidden" />

                                <span className={`w-3 h-3 rounded-full border-4 flex items-center justify-center ${level === "Beginner" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                                    {level === "Beginner" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </span>

                                 <span>Beginner</span>
                            
                            </label>
                        
                        </div>
                        
                        <div className='bg-white p-1 px-4 rounded-md'>

                            <label className="flex cursor-pointer items-center space-x-2">

                                <input checked={level === "Intermediate"} value="Intermediate" onChange={() => setLevel("Intermediate")} type="radio" name="Intermediate" className="hidden" />

                                <span className={`w-3 h-3 rounded-full border-4 flex items-center justify-center ${level === "Intermediate" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                                    {level === "Intermediate" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </span>

                                <span>Intermediate</span>

                            </label>

                        </div>

                        <div className='bg-white rounded-md p-1 px-4'>

                            <label className="flex cursor-pointer items-center space-x-2">

                                <input checked={level === "Advance"} value="Advance" onChange={() => setLevel("Advance")} type="radio" name="Advance" className="hidden" />

                                <span className={`w-3 h-3 rounded-full border-4 flex items-center justify-center ${level === "Advance" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                                    {level === "Advance" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </span>

                                <span>Advance</span>

                            </label>

                        </div>
                        


                    </div>

                </div>


                <div>

                    <div className='flex w-full items-center justify-between'>

                        {/* <div className='flex items-center ml-4 gap-2'>
                            <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                            <label className='text-[#797979] text-xl' htmlFor="">Price</label>
                        </div> */}

                        <div className="flex items-center justify-between space-x-8 mr-4">

                            <span className="text-2xl font-semibold text-gray-800">Free</span>

                            <button className={`w-12 h-6 flex items-center bg-gray-300 rounded-full transition duration-300 ${!isPaid ? 'bg-yellow-500' : ''}`} onClick={() => {setIsPaid(!isPaid)}}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${!isPaid ? 'translate-x-6' : ''}`}/>
                            </button>

                        </div>

                    </div>
                    
                    <div>

                        {/* 
                        <div className="flex items-center p-3 rounded w-full">
                            <span className="mr-3">$US</span>
                            <input disabled={isPaid} value={price} onChange={(e) => setPrice(e.target.value)} min={1} max={1000} type="number" placeholder="Enter price" className="p-4 rounded-md border-2 mt-2 w-[400px]" />
                        </div> */}

                    </div>


                </div>

                <div className='flex flex-col justify-start'>

                    <div className='flex items-center gap-3'>
                        <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                        <label className='text-[#797979] text-xl' htmlFor="">Duration</label>
                    </div>

                    <div className="relative w-full">
                        <FiClock size={25} className="absolute left-4 top-9 transform -translate-y-1/2 text-[#6555BC]" />
                        <input value={duration} name='duration' onChange={(e) => setDuration(e.target.value)} type="number" placeholder="Enter the time in hr" className="p-4 pl-14 rounded-md border-2 mt-2 w-[400px]" />
                    </div>
                    

                </div>

            </div>

        </div>


        <div className='mt-10'>
            
            <div className='flex items-center mb-2 gap-3'>
                <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                <label className='text-[#797979] text-xl' htmlFor="">Course Description</label>
            </div>

            <div className="relative w-[70%]">
                <textarea value={description} name='description' onChange={(e) => setDescription(e.target.value)} placeholder='Please write the course description' className='w-full h-[230px] border-dotted p-5 rounded-md text-xl border-2' />
            </div>

        </div>


        <div className='mt-10'>

            <div className='flex items-center mb-2 gap-3'>
                <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                <label className='text-[#797979] text-xl' htmlFor="">What student will learn</label>
            </div>

            <div className='w-[70%]'>
                <ReactQuill value={extraInfo} onChange={(value) => setExtraInfo(value)} className='h-52 mt-2'/>
            </div>

        </div>


        <div className='mt-16'>

            <div className='flex items-center mb-2 gap-3'>
                <div className="w-3 h-3 bg-[#FFC200] rounded-full"></div>
                <label className='text-[#797979] text-xl' htmlFor="">Tags ( Maximum 5)</label>
            </div>


            <div className="relative w-[100%]">

                <FaPlus size={22} className="absolute left-4 top-9 transform -translate-y-1/2 text-[#6555BC]" />

                <input 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && tags.length < 5) {
                            setTags([...tags, e.target.value]);
                            e.target.value = '';
                        }
                    }} 
                    type="text" 
                    placeholder="Add Tag , Press Enter key" 
                    className="p-4 pl-14 rounded-md border-2 mt-2 w-[70%]" 
                />

            </div>

        </div>


        <div className='mt-10 flex gap-5 w-[70%] justify-end'>

            <button className='text-[#403685] font-semibold py-2 px-7 border-2 border-[#403685] rounded-lg capitalize cursor-pointer'>cancel</button>

            <button onClick={handleAddCourse} className='flex items-center gap-2 text-[#403685] font-semibold py-2 px-5 bg-[#FFC200] rounded-lg capitalize cursor-pointer'>
                create
                <FaPlus/>
            </button>

        </div>

    </div>
  )

}


export default CreateCourse