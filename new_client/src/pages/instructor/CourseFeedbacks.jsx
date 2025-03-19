import React, { useState } from 'react'
import ReportFeedbackPopUp from '../../components/ReportFeedbackPopUp'
import { BsStarFill } from "react-icons/bs"



const CourseFeedbacks = () => {

  const [openFeedBackPopUp , setOpenFeedBackPopUp] = useState(false)

  return (
    <div className='p-12 w-[50%]'>

      <h1 className="text-3xl font-semibold">Science in Liquid</h1>
      <p className="text-gray-500 text-lg">Student Rating & Reviews</p>

      <hr className='mt-6' />

      <div className='flex mt-4 justify-between w-[90%] gap-12 items-center'>

      <div className="mt-4 flex flex-col items-center justify-center">

        <div className="text-4xl font-bold">4.5</div>

        <div className="text-yellow-500 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <BsStarFill size={25} key={i} />
          ))}
        </div>

        <p className="text-gray-500">964 reviews</p>

      </div>

        <div className="mt-4 space-y-2">

          {["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"].map((label, index) => (

            <div key={index} className="flex items-center space-x-2">

              <p className="w-20 text-gray-600">{label}</p>

              <div className="w-[500px] h-3 bg-gray-200 rounded-full">

                <div
                  className={`h-3 rounded-full ${
                    index === 0
                      ? "bg-[#6555BC] w-[60%]"
                      : index === 1
                      ? "bg-[#6555BC] w-[30%]"
                      : index === 2
                      ? "bg-[#6555BC] w-[2.5%]"
                      : index === 3
                      ? "bg-[#6555BC] w-[1%]"
                      : "bg-[#6555BC] w-[15%]"
                  }`}
                ></div>

              </div>

              <p className="text-gray-500">{["60%", "30%", "2.5%", "1%", "15%"][index]}</p>

            </div>

          ))}

        </div>

      </div>

      <hr className='mt-6' />

      <div className="mt-6 space-y-6">
        
        {[1, 2, 3].map((_, i) => (

          <div key={i} className="border-b pb-4">

            <div className="flex w-full items-center space-x-4">

              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="profile"
                className="w-12 h-12 rounded-full"
              />

              <div className='flex items-center justify-between w-[90%]'>

                <div>

                  <h3 className="font-semibold">Emery Passaquindici Arcand</h3>

                  <div className="text-yellow-500 flex items-center gap-1">
                    <span className='text-blue-950 mr-1'>5</span>
                    {[...Array(5)].map((_, i) => (
                      <BsStarFill key={i} />
                    ))}
                  </div>

                </div>

                <p className="ml-auto text-gray-400 text-sm">3 weeks ago</p>

              </div>

            </div>

            <p className="text-[#000000] mt-3">
              The course is good. I've been using [platform/system name] for [duration], and my experience has been
              [positive/negative/mixed]. The interface is [describe UI - intuitive, user-friendly, cluttered, etc.], and
              the features are [helpful/confusing/missing key functions].
              One thing I really like is [mention a feature or aspect you enjoy]. However, I found that [mention any
              challenges or issues] which can be improved by [suggest a fix or improvement].
            </p>

            <button onClick={() => setOpenFeedBackPopUp(true)} className="text-[#403685] underline mt-2">Report</button>

          </div>

        ))}

      </div>

      {openFeedBackPopUp && <ReportFeedbackPopUp onClose={() => setOpenFeedBackPopUp(!openFeedBackPopUp)}/>}

    </div>

  )

}


export default CourseFeedbacks