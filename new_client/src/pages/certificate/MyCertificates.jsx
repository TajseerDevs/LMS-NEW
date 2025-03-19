import React from 'react'
import certificateImg from "../../assets/course-certificate-template.png"
import YellowBtn from '../../components/YellowBtn'


const MyCertificates = () => {

    const certificates = [
        {
          id: 1,
          title: "Science in Liquid",
          author: "Mohammad Ali",
          progress: 90,
          buttonText: "Get Certificate",
        },
        {
          id: 2,
          title: "Science in Liquid",
          author: "Mohammad Ali",
          progress: 50,
          buttonText: "Continue Learning",
        },
    ]

    

    // add paging buttons
  return (
    <div className="p-10">

        <h1 className="text-3xl font-semibold text-[#002147] mb-6">My Certificates</h1>

        <div className="space-y-10 mt-12">

            {certificates.map((cert) => (

            <div
                key={cert.id}
                className="flex items-center bg-white p-4 w-[45%] rounded-lg"
            >

                <img
                    src={certificateImg}
                    alt="certificate"
                    className="w-24 h-16 rounded-md mr-4"
                />

                <div className="flex-1 flex items-center gap-16 ml-8">

                    <div>
                        <h2 className="text-xl font-semibold">{cert.title}</h2>
                        <p className="text-gray-500">{cert.author}</p>
                    </div>

                    <div className='ml-6'>

                        <p className="text-gray-500 mb-1 text-sm">Progress</p>

                        <div className="relative flex items-center justify-center rounded-full text-yellow-500 font-bold">

                            <svg className="w-12 h-12" viewBox="0 0 36 36">

                                <circle
                                    className="stroke-gray-200"
                                    strokeWidth="3"
                                    fill="transparent"
                                    r="16"
                                    cx="18"
                                    cy="18"
                                />

                                <circle
                                    className="stroke-yellow-500"
                                    strokeWidth="3"
                                    fill="transparent"
                                    r="16"
                                    cx="18"
                                    cy="18"
                                    strokeDasharray="100"
                                    strokeDashoffset={`${100 - cert.progress}`}
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span className="absolute text-yellow-500 font-bold">
                                {cert.progress}%
                            </span>    

                        </div>

                    </div>

                </div>

                <div className='mr-10'>
                    {cert.progress < 90 ? (
                        <YellowBtn text="Continue Learning" />
                        ) : (
                        <YellowBtn text="Get Certificate" />
                    )}
                </div>

            </div>

            ))}

        </div>

    </div>
  )

}



export default MyCertificates