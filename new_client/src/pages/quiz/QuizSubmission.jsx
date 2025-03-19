import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosObj } from '../../utils/axios'
import { useDrag, useDrop } from "react-dnd"
import { formatQuizDuration } from '../../utils/formatQuizDuration'
import { FaArrowLeft } from "react-icons/fa6";
import formatDate from '../../utils/formatDate'
import TimerComponent from '../../components/TimerComponent'
import PurpleBtn from '../../components/PurpleBtn'
import YellowBtn from '../../components/YellowBtn'
import QuizSubmissionPopUp from '../../components/QuizSubmissionPopUp'
import { useSubmitQuizAnswersMutation } from '../../store/apis/quizApis'
import { toast } from 'react-toastify'



const QuizSubmission = () => {

  // ! add check if the user already have a submission for the quiz

  const {quizId} = useParams()
  const navigate = useNavigate()

  const {token} = useSelector((state) => state.user)

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})

  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [droppedOptions, setDroppedOptions] = useState({})
  const [quizSubmissionPopUp, setQuizSubmissionPopUp] = useState(false)
  
  const [submitQuizAnswers] = useSubmitQuizAnswersMutation()
  

  useEffect(() => {

    setLoading(true)

    const checkQuizSubmission = async () => {
      try {
        const response = await axiosObj.get(`/quiz/${quizId}/check-submission`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSubmitted(response.data.submitted)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }finally{
        setLoading(true)
      }
    }
  
    checkQuizSubmission()
  
  } , [quizId , token])




  useEffect(() => {
    if(submitted){
      localStorage.removeItem(`timer-time-left-${quizId}`)
      setTimeout(() => {
        navigate(`/quiz-result/${quizId}`)
      }, 100)
    }
  } , [submitted , quizId , token , navigate])




  useEffect(() => { 
  
    setLoading(true)
  
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
        setLoading(false)
      }finally{
        setLoading(false)                
      }
    }
  
    getQuizDetails()
  
  } , [quizId , token])




  useEffect(() => {
    const savedDraft = localStorage.getItem(`quiz-draft-${quizId}`)
    if (savedDraft) {
      const { answers, droppedOptions } = JSON.parse(savedDraft)
      setAnswers(answers || {})
      setDroppedOptions(droppedOptions || {})
    }
  }, [quizId])

  


  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev , [questionId]: value }
      localStorage.setItem(`quiz-draft-${quizId}`, JSON.stringify({ answers: updatedAnswers, droppedOptions }));
      return updatedAnswers
    })
  }


  
  const handleBlankAnswerChange = (questionId, index, value) => {

    setAnswers((prev) => {

      const updatedAnswers = { ...prev }

      if (!updatedAnswers[questionId]) {
        updatedAnswers[questionId] = []
      }

      updatedAnswers[questionId][index] = value;
  
      localStorage.setItem(`quiz-draft-${quizId}`, JSON.stringify({ answers: updatedAnswers, droppedOptions }));
      
      return updatedAnswers

    })

  }



  const handleMatchChange = (questionId, optionText, matchWith) => {

    setDroppedOptions((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [matchWith]: optionText, 
      },
    }));
  
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [optionText]: matchWith,
      },
    }))

  };
  



  const handleSubmit = async () => {

    const timeLeft = localStorage.getItem(`timer-time-left-${quizId}`)
    const parsedTimeLeft = timeLeft ? parseInt(timeLeft , 10) : 0

    if (!answers || Object.keys(answers).length === 0) {
     return toast.info("Please answer all questions before submitting") 
    }

    try {
      const res = await submitQuizAnswers({token , quizId ,  answers , timeLeft : parsedTimeLeft}).unwrap()
      localStorage.removeItem(`quiz-draft-${quizId}`)
      localStorage.removeItem(`timer-time-left-${quizId}`)
      setQuizSubmissionPopUp(false)
      navigate(`/quiz-result/${quizId}`)
      console.log(res)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }

  }




  const DraggableOption = ({ questionId, optionText, droppedOptions , index }) => {

    if (Object.values(droppedOptions[questionId] || {}).includes(optionText)) {
      return null
    }
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: `option-${questionId}`,
      item: { questionId, optionText },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))
  
    return (
      <div ref={drag} className={`p-3 border rounded bg-white cursor-pointer min-h-[60px] w-full flex items-center gap-2 shadow-md ${isDragging ? "opacity-50" : "opacity-100"}`}>
        <span className='bg-[#FFC200] p-2 rounded-lg'>0{index + 1}</span>
        <span>{optionText}</span>
      </div>
    )

  }
  
  



  const DropZoneMatch = ({ questionId, matchWith, droppedOption, onDrop }) => {

    const [{ isOver }, drop] = useDrop(() => ({
      accept: `option-${questionId}`,
      drop: (item) => onDrop(questionId, item.optionText, matchWith),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }))

    return (
      <div ref={drop} className={`p-3 border rounded bg-gray-100 text-center min-h-[67px] flex items-center justify-center ${isOver ? "bg-blue-200" : "bg-gray-100"}`}>

        {droppedOption ? (
          <div className="p-3 border rounded bg-white w-full shadow-md">{droppedOption}</div>
        ) : (
          matchWith
        )}

      </div>
    )

  }



  const handleReset = (questionId) => {

    setAnswers((prev) => {
      const updatedAnswers = { ...prev } 
      delete updatedAnswers[questionId]
      return updatedAnswers
    })
  
    setDroppedOptions((prev) => {
      const updatedDroppedOptions = { ...prev }
      delete updatedDroppedOptions[questionId]
      return updatedDroppedOptions
    })

  }
  

  const onTimeUp = () => {
    console.log("time finished")
  }



  if (loading) return <p className="text-center text-gray-600">Loading quiz...</p>



  console.log(quiz)
  console.log(answers)




  return (

    <div className="w-full h-full mx-auto p-6 bg-[#f9f9f9da] rounded">
      
      <div className="flex items-center justify-between gap-12 p-2 rounde text-white">

        <div className='flex items-center gap-12'>
        
          <button onClick={() => navigate(`/quiz-details/${quiz?._id}`)} className='text-[#FFC200] flex items-center gap-2 text-xl mb-0.5 font-semibold'><FaArrowLeft size={30}/>Back</button>

          <div className='flex items-start gap-1 flex-col'>
            <h1 className="text-3xl capitalize text-[#403685] font-bold">{quiz?.title}</h1>
            <p className="text-[#6E6E71]">Graded Quiz . {quiz?.duration && quiz?.duration?.value && quiz?.duration?.unit && formatQuizDuration(quiz?.duration)} . {quiz?.maxScore} points</p>
          </div>

        </div>

        <div className='flex items-start mr-4 gap-1 flex-col'>
          <h1 className="text-md capitalize text-[#002147] font-bold">Due Date : <span className='text-[#000000]'>{formatDate(quiz?.dueDate)}</span></h1>
          <h1 className="text-md capitalize flex items-center gap-1 text-[#002147] font-bold">Timer : <span className='text-[#000000]'><TimerComponent onTimeUp={onTimeUp} quizId={quiz?._id} duration={quiz?.duration}/></span></h1>
        </div>

      </div>

      <hr className='m-4' />

      <div className='flex flex-col gap-2'>

        {quiz?.questions?.map((question , index) => (

          <div key={question?._id} className="mb-6 w-[55%] mt-10 mx-auto p-4 rounded">

            {
              question?.type !== "fill_in_blank" && 
                <p className="font-semibold flex items-center text-[#002147] text-2xl justify-between">
                  <span className='flex items-center gap-8'>{index + 1} .  {question?.questionText} {(question?.type === "match" || question?.type === "drag_drop") && droppedOptions[question?._id] && Object.keys(droppedOptions[question?._id]).length > 0 && <button className='underline px-4 py-1 rounded-lg text-[18px]' onClick={() => handleReset(question?._id)}>Reset</button>}</span>  <span className="text-sm bg-[#D9D2FF] p-2 rounded-lg text-[#403685]">{question?.points} points</span>
                </p>
            }
           

            {
              question?.type == "fill_in_blank" && 
                <p className="font-semibold flex items-center text-[#002147] text-2xl justify-between">
                  {index + 1} .  Fill in the Blank <span className="text-sm bg-[#D9D2FF] p-2 rounded-lg text-[#403685]">{question?.points} points</span>
                </p>
            }
 

            {!submitted && question?.type === "true_false" && (

              <div className="flex flex-col mt-4 w-[70%] gap-6">

                {["true", "false"].map((option) => (

                  <div key={option} className={`flex ${answers[question?._id] === option ? "bg-[#FFC200]" : "bg-white"} text-[#000000] p-3 text-lg cursor-pointer items-center gap-2`} onClick={() => handleAnswerChange(question?._id , option)}>
                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span> 
                  </div>

                ))}

              </div>

            )}



            {!submitted && question?.type === "multiple_choice" && (

              <div className="flex flex-col mt-4 w-[70%] gap-6">

                {question?.options?.map((option, index) => (

                  <div key={index} className={`flex ${answers[question?._id] === option?.optionText ? "bg-[#FFC200]" : "bg-white"} text-[#000000] p-3 text-lg cursor-pointer items-center gap-2`} onClick={() => handleAnswerChange(question?._id , option?.optionText)} >

                    <span>{option?.optionText}</span>

                  </div>

                ))}

              </div>

            )}



            {
              !submitted && question?.type === "fill_in_blank" && (

                <div className="flex mt-4 text-lg w-[80%] gap-3">

                  {question?.questionText?.split("{dash}").map((part, index) => (

                    <span key={index} className="flex items-center gap-1">

                      {part}

                      {index < question?.questionText?.split("{dash}").length - 1 && (

                        <input
                          type="text"
                          value={answers[question?._id]?.[index] || ""}
                          onChange={(e) => handleBlankAnswerChange(question?._id , index , e.target.value)}
                          className="border p-2 rounded-lg m-2"
                          placeholder=""
                        />

                      )}

                    </span>

                  ))}

                </div>

              )

            }



            {(question?.type === "match" || question?.type === "drag_drop") && (

              <div className="grid grid-cols-2 gap-4 mt-4">

                <div className="space-y-4">

                  {question?.options?.map((option , index) => (

                    <DraggableOption
                      key={option?.optionText}
                      questionId={question?._id}
                      optionText={option?.optionText}
                      droppedOptions={droppedOptions}
                      index={index} 
                    />

                  ))}

                </div>


                <div className="space-y-4">

                  {question.options.map((option) => (

                    <DropZoneMatch
                      key={option?.matchWith}
                      questionId={question?._id}
                      matchWith={option?.matchWith}
                      droppedOption={droppedOptions[question?._id]?.[option?.matchWith]}
                      onDrop={handleMatchChange}
                    />

                  ))}

              </div>

            </div>

          )}
          
          </div>

        ))}

      </div>
      
      <div className='flex items-center gap-4 w-[80%] mt-12 justify-end'>
        <PurpleBtn text="save draft"/>
        <YellowBtn onClick={() => setQuizSubmissionPopUp(true)} text="submit"/>
      </div>

      {quizSubmissionPopUp && <QuizSubmissionPopUp onConfirm={handleSubmit} onClose={() => setQuizSubmissionPopUp(!quizSubmissionPopUp)} />}

    </div>

  )

}



export default QuizSubmission