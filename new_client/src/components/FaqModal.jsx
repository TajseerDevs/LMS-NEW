import { useState } from "react";
import testImg from "../assets/test.png";
import { IoCloseSharp } from "react-icons/io5";



const FaqModal = ({ isOpen, onClose }) => {

  const [openQuestions , setOpenQuestions] = useState({})

  if (!isOpen) return null

  const questions = [
    {
      id: 1,
      user: { name: "Jaxson Dokidis", image: testImg },
      question: "Why is this section confusing?",
      time: "10 min ago",
      replies: [
        {
          id: 1,
          name: "Maria Vetrovs",
          text: "This section is very confusing. He should have checked the console to ensure the code is correct after making a getCommits call that does not exist.",
          time: "5 min ago",
        },
        {
          id: 2,
          name: "Alex Johnson",
          text: "I understand how promises work, but his explanation was really poor. I suggest looking up a Medium article.",
          time: "2 hours ago",
        },
      ],
    },
    {
      id: 2,
      user: { name: "Chris Doe", image: testImg },
      question: "How do promises actually work?",
      time: "1 hour ago",
      replies: [
        {
          id: 1,
          name: "Emma Watson",
          text: "A promise represents a value that might be available now, later, or never. Understanding the resolve/reject methods is crucial.",
          time: "1 day ago",
        },
        {
          id: 2,
          name: "John Smith",
          text: "Promises are important in async JavaScript. You should practice them by chaining .then() and catching errors with .catch().",
          time: "3 days ago",
        },
      ],
    },
    {
      id: 3,
      user: { name: "Sophia Lee", image: testImg },
      question: "What are the best practices for error handling in JavaScript?",
      time: "3 hours ago",
      replies: [
        {
          id: 1,
          name: "Michael Brown",
          text: "Always use try/catch for async/await, and handle errors properly inside the .catch() of promises.",
          time: "5 days ago",
        },
        {
          id: 2,
          name: "David Wilson",
          text: "Centralized error handling is a good pattern in Node.js, especially when working with Express middleware.",
          time: "1 week ago",
        },
      ],
    },
  ]

  const toggleReplies = (id) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }


  const handleOutsideClick = (e) => {
    if (e.target.id === "faq-modal") {
      onClose()
    }
  }



  return (
    <div onClick={handleOutsideClick} id="faq-modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">

      <div className="bg-white w-3/5 max-h-[600px] rounded-lg shadow-lg p-5 overflow-y-auto">

        <div onClick={(e) => e.stopPropagation()} className="flex justify-between items-center border-b pb-2">
        
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-semibold">FAQs</h2>
          </div>

          <button onClick={onClose} className="text-gray-600 text-xl">
            <IoCloseSharp size={30}/>
          </button>
        
        </div>

        <div className="mt-4 space-y-6">

          {questions.map((q) => (

            <div key={q.id} className="border p-3 rounded-md">

              <div className="flex items-start space-x-3">

                <img
                  src={q.user.image}
                  alt="User"
                  className="rounded-full w-10 h-10"
                />

                <div>

                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{q.user.name}</h3>
                        <span className="text-gray-500 text-xs">{q.time}</span>
                    </div>

                    <p className="text-gray-700 text-lg mb-2">{q.question}</p>
                
                </div>
              
              </div>

              <button onClick={() => toggleReplies(q.id)} className="mt-2 text-blue-500 hover:underline">
                {openQuestions[q.id] ? "Hide Replies" : "Show Replies"}
              </button>

              {openQuestions[q.id] && (

                <div className="mt-3 space-y-4">

                  {q.replies.map((reply) => (

                    <div key={reply.id} className="flex items-start space-x-3 bg-gray-100 p-3 rounded-md">

                      <img
                        src={testImg}
                        alt="User"
                        className="rounded-full w-10 h-10"
                      />

                      <div>
                        <h3 className="font-semibold">{reply.name}</h3>
                        <p className="text-gray-700 text-sm">{reply.text}</p>
                        <span className="text-gray-500 text-xs">{reply.time}</span>
                      </div>

                    </div>

                  ))}
                  
                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}


export default FaqModal
