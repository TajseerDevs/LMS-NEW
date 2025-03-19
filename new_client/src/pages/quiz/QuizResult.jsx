import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetQuizSubmissionResultQuery } from '../../store/apis/quizApis'



const QuizResult = () => {

  const {quizId} = useParams()
  const navigate = useNavigate()
  
  const {token} = useSelector((state) => state.user)

  const {data : quizResult} = useGetQuizSubmissionResultQuery({token , quizId})
  

  const progress = parseFloat(quizResult?.percentage)

  const radius = 50
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  
  const dashOffset = circumference - (progress / 100) * circumference


  return (
    <div className='p-12 flex flex-col items-center justify-center mx-auto'>

        <h2 className="text-4xl font-semibold text-[#002147] text-center">Quiz Result</h2>

        <div className='flex w-[40%] mt-24 items-center justify-between'> 

            <div>
                <span className='text-[#565656] text-2xl'>{quizResult?.studentId?.userObjRef?.firstName} {quizResult?.studentId?.userObjRef?.lastName}</span>
                <p className='text-[#565656] mt-2 text-2xl'>Points : <span>{quizResult?.totalScore} / {quizResult?.maxPossibleScore}</span> </p>
                <p className='text-[#565656] mt-2 text-2xl'>Duration <span>{quizResult?.spentTime}</span> </p>
            </div>

            <div>

                <div style={{ position: 'relative', display: 'inline-block' }}>

                    <svg
                        width="180"
                        height="180"
                        viewBox="0 0 120 120"
                        style={{ transform: 'rotate(-90deg)' }}
                    >

                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#e6e6e6"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#0FAF00" 
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            transition="stroke-dashoffset 0.35s"
                        />

                    </svg>

                    <div
                        style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#0FAF00',
                        }}
                    >
                        {`${progress}%`}
                    </div>

                </div>

            </div>

        </div>

        <div className='w-[40%] mt-20'>

            <span className='text-[#002147] text-2xl font-semibold'>Answers</span>

            <div className='flex items-center gap-[150px] mt-6 w-full'>
                <p className='text-[#6E6E71] flex text-xl whitespace-nowrap items-center gap-2'>Correct  <span className='bg-[#6555BC33] w-8 h-8 flex items-center justify-center text-[#6555BC] rounded-full p-4'>{quizResult?.correctAnswersCount}</span></p>
                <p className='text-[#6E6E71] flex text-xl whitespace-nowrap items-center gap-2'>Partially correct  <span className='bg-[#6555BC33] w-8 h-8 flex items-center justify-center text-[#6555BC] rounded-full p-4'>{quizResult?.partiallyCorrectAnswersCount}</span></p>
                <p className='text-[#6E6E71] flex text-xl whitespace-nowrap items-center gap-2'>Incorrect <span className='bg-[#6555BC33] w-8 h-8 flex items-center justify-center text-[#6555BC] rounded-full p-4'>{quizResult?.incorrectAnswersCount}</span></p>
            </div>

        </div>

        <div className='w-[40%] mt-20 flex items-center justify-center'>
            {quizResult?.passStatus ? <p className='text-3xl text-[#118300] font-semibold'>Well Done! You have passed</p> : <p className='text-3xl text-[#bc2727] font-semibold'>Unfortunately, you did not pass the quiz</p>}
        </div>

    </div>
  )

}


export default QuizResult