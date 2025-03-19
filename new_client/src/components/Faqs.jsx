import React, { useState } from 'react'
import { FiMessageCircle, FiArrowRight , FiImage  } from 'react-icons/fi'
import testImg from '../assets/test.png'



const FAQS = () => {

  const [showAllReplies, setShowAllReplies] = useState(false)
  const [showMoreFaqs, setShowMoreFaqs] = useState(false)
  const [replyInputVisible, setReplyInputVisible] = useState(null)

  const toggleReplies = () => {
    setShowAllReplies(!showAllReplies)
  };

  const toggleReplyInput = (index) => {
    setReplyInputVisible(replyInputVisible === index ? null : index)
  }


  return (
    <div className="w-[90%] flex flex-col p-6 rounded-lg">

      <div className="mb-2">

        <div className="flex items-start gap-4">

          <img
            src="https://randomuser.me/api/portraits/men/10.jpg"
            className="w-10 h-10 rounded-full"
            alt="User"
          />

          <div>
            
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Jaxon Dokidis</h4>
              <p className="text-sm text-gray-600">5 min ago</p>
            </div>
            
            <p className="mt-2 text-gray-800">
              This section is very confusing, he should have console the code that he wrote to make sure it's right after making a getCommits callback that does not exist.
            </p>
            
            <div className="flex items-center text-gray-500 text-sm mt-2">
            
              <button
                className="flex items-center gap-1 hover:text-gray-800"
                onClick={() => toggleReplyInput(0)}
              >
                <FiMessageCircle className="text-lg" /> Reply
              </button>

              <span className="ml-3">• 10 replies</span>
            
            </div>

            {replyInputVisible === 0 && (

                <div className='flex'>
                
                    <div className='relative w-[80%]'>
    
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="mt-2 p-3 border rounded-md w-full"
                        />
        
                        <FiImage className="absolute right-5 top-8 transform -translate-y-1/2 h-7 w-7 text-gray-500 cursor-pointer" />
                        
                    </div>
    
                    <button className="bg-[#FFC200] text-[#002147] ml-4 font-semibold px-4 mt-1 rounded-md disabled:cursor-not-allowed disabled:bg-gray-200">Reply</button>
               
                </div>

            )}

          </div>

        </div>

      </div>

      {/* Replies Section */}
      <div className="ml-12">

        <button
          onClick={toggleReplies}
          className="text-blue-500 hover:underline text-sm mb-2"
        >
          {showAllReplies ? 'Show less' : 'Show replies'}
        </button>

        {showAllReplies && (

          <div className="space-y-4">

            {[1, 2, 3, 4, 5].map((_, index) => (

              <div key={index} className="flex items-start gap-4 border-t pt-4">

                <img src={testImg} className="w-10 h-10 rounded-full" alt="User" />

                <div className="w-full">

                  <div className="flex items-center justify-between">

                    <h4 className="font-semibold">Maria Vetrov</h4>
                    <p className="text-sm text-gray-600">2 hours ago</p>

                  </div>

                  <p className="mt-2 text-gray-800">
                    He explained this extremely poorly. I understand how promises work, but the way he explained is extremely poor. I highly suggest you look up a medium article.
                  </p>

                  {index === 1 && (
                    
                    <img
                      src={testImg}
                      className="w-[570px] h-[300px] mt-2 object-cover rounded-md border"
                      alt="Reply attachment"
                    />

                  )}

                  {replyInputVisible === index + 1 && (

                    <div className='flex'>
                                    
                        <div className='relative w-[80%]'>

                            <input
                              type="text"
                              placeholder="Write a reply..."
                              className="mt-2 p-3 border rounded-md w-full"
                            />

                            <FiImage className="absolute right-5 top-8 transform -translate-y-1/2 h-7 w-7 text-gray-500 cursor-pointer" />
                            
                        </div>

                        <button className="bg-[#FFC200] text-[#002147] ml-4 font-semibold px-4 mt-1 rounded-md disabled:cursor-not-allowed disabled:bg-gray-200">Reply</button>

                    </div>

                  )}

                </div>

              </div>
              
            ))}

          </div>

        )}

      </div>

      

    </div>

  )

}

export default FAQS
