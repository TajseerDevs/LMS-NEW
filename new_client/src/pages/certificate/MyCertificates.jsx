import React, { useState } from 'react'
import certificateImg from "../../assets/course-certificate-template.png"
import YellowBtn from '../../components/YellowBtn'
import { useSelector } from 'react-redux'
import { useGenerateCertificateMutation, useGetMyCertificatesQuery } from '../../store/apis/certificateApis'
import {useNavigate} from "react-router-dom"
import { axiosObj } from '../../utils/axios'



const MyCertificates = () => {

    const {token , user} = useSelector((state) => state.user)

    const navigate = useNavigate()
    
    const [page , setPage] = useState(1)
    
    // add this api to the enrolled course page to use the refetch function after each item submission to keep the pages synced togther
    const { data , isFetching } = useGetMyCertificatesQuery({ token , page })

    const handleDownload = async (courseId) => {

        try {

            const response = await axiosObj.post(`/certificate/generate-certificate/${courseId}`, {} , {
                headers : {
                    "Authorization" : `Bearer ${token}`
                },  
                responseType: "blob",
            })
        
            if (response?.data) {

                const blob = new Blob([response.data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
        
                const link = document.createElement('a')
                link.href = url
                link.download = `Certificate-${courseId}.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
        
                window.URL.revokeObjectURL(url)

            } else {
                console.error('No data received', response)
                alert('Failed to generate certificate. Make sure you completed the course.')
            }

        } catch (err) {
          console.error('Download error', err)
          alert('Something went wrong while downloading the certificate.')
        }

    }
      

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }
    

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1)
    }


    const courses = data?.enrolledCourses?.courses || []
    const currentPage = data?.enrolledCourses?.currentPage || 1
    const totalPages = data?.enrolledCourses?.totalPages || 1



  return (

    <div className="p-10">

        <h1 className="text-3xl font-semibold text-[#002147] mb-6">My Certificates</h1>

        <div className="space-y-10 mt-12">

            {courses?.map((cert) => (

            <div key={cert?.id} className="flex items-center bg-white p-4 w-[50%] rounded-lg">

                <img
                    src={certificateImg}
                    alt="certificate"
                    className="w-24 h-16 rounded-md mr-4"
                />

                <div className="flex-1 flex items-center gap-16 ml-8">

                    <div>
                        <h2 className="text-xl capitalize font-semibold">{cert?.title}</h2>
                        <p className="text-gray-500 capitalize">{cert?.instructor?.name}</p>
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
                                    strokeDashoffset={`${100 - cert?.progress}`}
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span className="absolute text-yellow-500 font-bold">
                                {cert?.progress}%
                            </span>    

                        </div>

                    </div>

                </div>

                <div className='mr-10'>

                    {cert?.progress < 90 ? (
                        <YellowBtn onClick={() => navigate(`/course/main-page/${cert?.id}`)} text="Continue Learning" />
                            ) : (
                        <YellowBtn onClick={() => handleDownload(cert?.id)} text="Get Certificate" />
                    )}

                </div>

            </div>

            ))}

        </div>

        <div className="flex w-[50%] justify-end items-center gap-4 mt-12">

            <YellowBtn text="Previous" disabled={page === 1 || isFetching} onClick={handlePrev}/>

            <span className="text-[#002147] font-semibold">Page {currentPage} From {totalPages}</span>

            <YellowBtn text="Next" disabled={page === totalPages || isFetching} onClick={handleNext}/>

        </div>

    </div>

  )

}



export default MyCertificates