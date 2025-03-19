import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetQuizDetailsQuery } from '../../store/apis/quizApis'
import { axiosObj } from '../../utils/axios'
import YellowBtn from '../../components/YellowBtn'
import PurpleBtn from '../../components/PurpleBtn'
import formatDate from '../../utils/formatDate'
import { formatQuizDuration } from '../../utils/formatQuizDuration'



const QuizDetails = () => {

    const {quizId} = useParams()
    const navigate = useNavigate()

    const {token} = useSelector((state) => state.user)

    const [quiz , setQuiz] = useState({})
    const [isLoading , setIsLoading] = useState(false)
    const [isQuizSubmitted , setIsQuizSubmitted] = useState(false)


    useEffect(() => {

        setIsLoading(true)

        const getQuizDetails = async () => {
            try {
                const response = await axiosObj.get(`/quiz/${quizId}/details` , {
                    headers : {
                        "Authorization" : `Bearer ${token}`
                    }
                })
                setQuiz(response.data)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }finally{
                setIsLoading(false)                
            }
        }

        getQuizDetails()

    } , [quizId , token])



    useEffect(() => {

        const checkQuizSubmission = async () => {
            
            try {
                
                const response = await axiosObj.get(`/quiz/${quizId}/check-submission`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                setIsQuizSubmitted(response.data.submitted)
            } catch (error) {
                console.log(error)
            }
        }

        checkQuizSubmission()

    } , [quizId , token])




    if(isLoading){
        return <h1 className='p-10 text-2xl'>Loading...</h1>
    }



  return (
    
    <div className='p-10 flex items-center flex-col justify-center mx-auto'>
    
        <h1 className='text-4xl capitalize mt-20 font-semibold text-[#002147]'>{quiz?.title}</h1>

        <p className='text-[#545454] w-[50%] mt-10 text-center text-lg capitalize'>{quiz?.description}</p>

        <div className="mt-8 flex flex-col justify-center items-center w-[80%] p-6 rounded-lg">

            <div className="flex flex-col gap-8 text-2xl text-gray-700 w-[40%]">

                <div className='flex items-center justify-between'>
                    <p><span className="font-bold text-[#002147]">Due : </span> {formatDate(quiz?.dueDate)}</p>
                    <p><span className="font-bold text-[#002147]">Duration : </span>{quiz?.duration && quiz?.duration?.value && quiz?.duration?.unit && formatQuizDuration(quiz?.duration)}</p>
                </div>

                <div className='flex items-center justify-between'>
                    <p><span className="font-bold text-[#002147]">Question : </span>  {quiz?.questions?.length}</p>
                    <p className='text-left w-[25%]'><span className="font-bold  text-[#002147]">Points : </span>  {quiz?.maxScore}</p>
                </div>

                <p><span className="font-bold text-[#002147]">Instruction : </span>{quiz?.isOneWay ? "one way quiz" : "two way quiz"}</p>

            </div>
        
            <div className="flex justify-center gap-8 mt-20">

                <PurpleBtn onClick={() => navigate(`/course/main-page/${quiz?.courseId}`)} text="Back"/>
                {isQuizSubmitted ? <YellowBtn onClick={() => navigate(`/quiz-result/${quiz?._id}`)} text="View Result" /> : <YellowBtn onClick={() => navigate(`/quiz-submission/${quiz?._id}`)} text="Take the Quiz" />}
            </div>

        </div>
    
    </div>

  )

}



export default QuizDetails