import React, { useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { useAddQuizQuestionMutation } from '../store/apis/quizApis';
import { useSelector } from 'react-redux';



const TFInputs = ({addQuestion , dispatch , questionObj , setQuestionObj , quizData }) => {

    const initialQuestionObj = {
        type: "",
        questionText: "",
        points: 1,
        explanation: "",
        hint: "",
        options: []
    }

    const {token} = useSelector((state) => state.user)

    const [randomizeChoice, setRandomizeChoice] = useState(true)
    const [selectedAnswer, setSelectedAnswer] = useState("")
    const [feedback, setFeedback] = useState("")

    const [addQuizQuestion] = useAddQuizQuestionMutation()


    const handleCorrectAnswerChange = (correctAnswer) => {

        console.log(typeof correctAnswer)
      
        const optionsArray = [
            {
              optionText: "true",
              isCorrect: correctAnswer === "True", 
              feedback: correctAnswer === "True" ? "correct!" : feedback
            },
            {
              optionText: "false",
              isCorrect: correctAnswer === "False", 
              feedback: correctAnswer === "False" ? "correct!" : feedback 
            }  
        ]
        
        setQuestionObj((prev) => ({
          ...prev,
          options: optionsArray
        }))

    }



    const handleCreateNewQuestion = async () => {

        try {
            const response = await addQuizQuestion({token , courseId : quizData?.courseId , quizId : quizData?.quizId , question : questionObj }).unwrap()
            dispatch(addQuestion(response.question))
            setQuestionObj(initialQuestionObj)
            // await refetch()
        } catch (error) {
            console.log(error)
        }

    }



  return (

    <div className="border p-4 rounded-lg shadow-md bg-white w-[80%] h-[600px]">

      <div className="flex items-center mb-8 mt-4 gap-4">

        <span className="font-semibold">1.</span>
        <input name='questionText' value={questionObj.questionText} onChange={(e) => setQuestionObj({...questionObj , questionText : e.target.value})} type='text' placeholder="Enter Question Name Here ..." className='text-black border rounded-lg w-[40%] p-4' />

      </div>

      <div className="ml-10 mb-16 space-y-6">

        {["True", "False"].map((option, index) => (

            <span
                onClick={() => {setSelectedAnswer(option) ; handleCorrectAnswerChange(option)}}
                key={index}
                className={`flex items-center w-[40%] gap-2 border p-2 pl-4 rounded-lg cursor-pointer
                ${selectedAnswer
                    ? selectedAnswer === option
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    : "bg-transparent"
                }`}
            >
                {option}
            </span>

        ))}

      </div>

      <div className="mt-6 flex items-center gap-4">

        <div className='flex flex-col items-start w-[40%] gap-2'>

            <span className='ml-1 text-[#697386] text-lg'>Correct answer</span>

            <select value={selectedAnswer} onChange={(e) => {setSelectedAnswer(e.target.value) ; handleCorrectAnswerChange(e.target.value)}} className="border p-2 rounded w-full">
                <option disabled selected value="">Select the correct answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
            </select>

        </div>

        <div className='flex flex-col w-[60%] gap-2 items-start'>

            <label className='text-[#697386] text-lg' htmlFor="">Clarify answer</label>

            <input
                name='feedback'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                type="text"
                placeholder="Write answer Clarification"
                className="border p-2 rounded w-[90%]"
            />

        </div>

      </div>

      <div className="mt-8 flex items-center gap-4">

        <div className='flex flex-col items-start w-[40%] gap-2'>

            <span className='ml-1 text-[#697386] text-lg'>Explanation (optional)</span>

            <input
                name='explanation'
                value={questionObj.explanation}
                onChange={(e) => setQuestionObj({...questionObj , explanation : e.target.value})}
                type="text"
                placeholder="Write Question Explanation"
                className="border p-2 rounded w-full"
            />

        </div>

        <div className='flex flex-col w-[60%] gap-2 items-start'>

            <label className='text-[#697386] text-lg' htmlFor="">Hint (optional)</label>

            <input
                name='hint'
                value={questionObj.hint}
                onChange={(e) => setQuestionObj({...questionObj , hint : e.target.value})}
                type="text"
                placeholder="Write Question Hint"
                className="border p-2 rounded w-[90%]"
            />

        </div>

      </div>



      <div className="mt-12 flex items-center justify-between gap-6">

        <div className='flex items-center gap-10'>

            <label className="flex items-center text-[#697386] gap-3 cursor-pointer">

            <input
                type="checkbox"
                checked={randomizeChoice}
                onChange={() => setRandomizeChoice(!randomizeChoice)}
                className="hidden"
            />

            <button className={`w-12 h-6 flex items-center bg-gray-300 rounded-full transition duration-300 ${!randomizeChoice ? 'bg-yellow-500' : ''}`} onClick={() => {setRandomizeChoice(!randomizeChoice)}}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${!randomizeChoice ? 'translate-x-6' : ''}`}/>
            </button>

                Randomize Choice
            
            </label>

            <div className='flex items-center gap-2'>

                <label className='text-[#697386]' htmlFor="">Point for this question</label>

                <input
                    name='points'
                    value={questionObj.points}
                    onChange={(e) => setQuestionObj({...questionObj , points : e.target.value})}
                    type="number"
                    min="1"
                    className="border p-2 rounded w-16 text-center"
                    defaultValue={1}
                />

            </div>

        </div>

        <div className='mr-6 flex items-center gap-5'>
            <button onClick={handleCreateNewQuestion} className='capitalize bg-[#FFC200] text-[#002147] px-6 py-1 rounded-lg font-semibold'>create</button>
            <FaTrash size={24} className='text-red-500'/>
        </div>

      </div>

    </div>

    )
}

export default TFInputs