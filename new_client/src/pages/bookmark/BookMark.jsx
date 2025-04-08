import React, { useState } from "react"
import BookMarkCard from '../../components/BookMarkCard'
import { FaFilter } from "react-icons/fa"
import { useGetCoursesLearningCategoriesQuery } from "../../store/apis/courseApis"
import { useSelector } from "react-redux"
import { useGetBookMarksQuery } from "../../store/apis/studentApis"




const BookMark = () => {
    
    const {user , token} = useSelector((state) => state?.user)

    const [selectedCategory, setSelectedCategory] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const [page , setPage] = useState(1)

    const {data : learningCategories } = useGetCoursesLearningCategoriesQuery({token})
    const {data : bookedCourses , isLoading , refetch} = useGetBookMarksQuery({token , page})    

    if(isLoading){
        return <h1 className="text-xl p-10">Loading ...</h1>
    }

    
  return (

    <div className="w-full px-10 py-6">

        <h1 className="text-3xl p-4 font-semibold text-[#002147] mb-6">Bookmark</h1>

        <div className="flex p-4 justify-between mb-12">

            <input
                type="text"
                placeholder="🔍 Search Courses"
                className="w-full text-[18px] max-w-[440px] p-3 border border-gray-300 rounded-lg"
            />

            <div className="flex mr-12 items-center gap-4">

                <FaFilter size={25}/>
  
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm text-gray-900">

                    <option disabled selected>Category</option>

                    {
                        learningCategories && learningCategories?.map((category) => (
                            <option value={category} key={category}>{category}</option>
                        ))
                    }

                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm text-gray-400">
                    <option disabled selected>Sort by : A-Z</option>
                    <option>Z-A</option>
                    <option>A-Z</option>
                </select>

            </div>

        </div>

        <div className="w-full">

            {bookedCourses?.bookmarks?.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 w-full">
                    {bookedCourses?.bookmarks?.map((item) => (
                        <BookMarkCard refetch={refetch} key={item.id} item={item} />
                    ))}
                </div>
                    ) : (
                <div className="w-full text-4xl capitalize text-center text-gray-500 py-10">
                    <p>No bookmarked courses yet .</p>
                </div>

            )}

        </div>

        {bookedCourses?.bookmarks?.length !== 0 && (

            <div className="flex justify-center items-center gap-4 mt-20">

                {/* <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-5 py-2 rounded-lg font-medium ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`px-5 py-2 rounded-lg font-medium ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button> */}

            </div>

        )}

    </div>

  )

}


export default BookMark