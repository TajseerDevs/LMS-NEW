import React, { useState } from "react"
import BookMarkCard from '../../components/BookMarkCard'
import { FaFilter } from "react-icons/fa";
import { useGetCoursesLearningCategoriesQuery } from "../../store/apis/courseApis";
import { useSelector } from "react-redux";


const BookMark = () => {
    
    const {user , token} = useSelector((state) => state?.user)

    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("")

    const {data : learningCategories } = useGetCoursesLearningCategoriesQuery({token})
    
    const bookMarkItems = [
        { id: 1, title: "Introduction to HTML & CSS", price: 80, reviews: 120, rating: 4.5, duration: "50 Min" },
        { id: 2, title: "Introduction to HTML & CSS", price: "Free", reviews: 120, rating: 4.5, duration: "50 Min" },
        { id: 3, title: "Introduction to HTML & CSS", price: 80, reviews: 120, rating: 4.5, duration: "50 Min" },
        { id: 4, title: "Introduction to HTML & CSS", price: "Free", reviews: 120, rating: 4.5, duration: "50 Min" },
        { id: 5, title: "Advanced CSS", price: 120, reviews: 95, rating: 4.8, duration: "60 Min" },
        { id: 6, title: "JavaScript Basics", price: 100, reviews: 150, rating: 4.6, duration: "70 Min" },
        { id: 7, title: "React for Beginners", price: 150, reviews: 200, rating: 4.9, duration: "80 Min" },
        { id: 8, title: "Node.js Essentials", price: 130, reviews: 180, rating: 4.7, duration: "90 Min" },
        { id: 9, title: "Node.js Essentials", price: 130, reviews: 180, rating: 4.7, duration: "90 Min" },
    ]
    
    const itemsPerPage = 10
    
    const [currentPage, setCurrentPage] = useState(1)
    
    const totalPages = Math.ceil(bookMarkItems.length / itemsPerPage)
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const displayedItems = bookMarkItems.slice(startIndex, startIndex + itemsPerPage)


    
  return (

    <div className="w-full px-8 py-6">

        <h1 className="text-3xl font-semibold text-[#002147] mb-6">Bookmark</h1>

        <div className="flex justify-between mb-12">

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
                        learningCategories && learningCategories.map((category) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 w-full">

            {displayedItems.map((item) => (
                <BookMarkCard key={item.id} {...item} />
            ))}

        </div>

        <div className="flex justify-center items-center gap-4 mt-20">

            <button
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
            </button>

        </div>

    </div>

  )

}


export default BookMark