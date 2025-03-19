import React, { useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useAddQuizQuestionMutation } from '../store/apis/quizApis';
import { useSelector } from 'react-redux';



const MCInputes = ({questionObj , setQuestionObj , quizData , refetch}) => {

    const initialQuestionObj = {
        type: "",
        questionText: "",
        points: 1,
        explanation: "",
        hint: "",
        options: []
    }
    
    const {token} = useSelector((state) => state.user)
    
    const [options, setOptions] = useState([])
    const [randomizeChoice, setRandomizeChoice] = useState(true)
    const [selectedAnswer, setSelectedAnswer] = useState("")
    const [feedback, setFeedback] = useState("")


    const [addQuizQuestion] = useAddQuizQuestionMutation()


    const handleAddOption = () => {

        if(options.length === 4){
            return alert("four options only allowed for mc question")
        }

        const newOption = {
          optionText: `Option ${options.length + 1}`,
          isCorrect: false,  
          feedback: ""    
        }
    
        setOptions([...options, newOption])

    }



    const handleCreateNewQuestion = async () => {

        if(!feedback) return alert("you must provide answer Clarify !")

        const updatedOptions = options.map(option => ({
            ...option,
            feedback: option.isCorrect ? "Correct!" : feedback
        }))
        
        const updatedQuestion = {
            ...questionObj,
            options: updatedOptions
        }

        try {
                
            await addQuizQuestion({token , courseId : quizData?.courseId , quizId : quizData?.quizId , question : updatedQuestion})
            setQuestionObj(initialQuestionObj)
            setOptions([])
            await refetch()

        } catch (error) {
            console.log(error)
        }

    }


    console.log(questionObj)



    const handleDeleteOption = (indexToDelete) => {

        const updatedOptions = options.filter((_ , index) => index !== indexToDelete)
        
        const renumberedOptions = updatedOptions.map((option, index) => ({
          ...option,
          optionText: `Option ${index + 1}`,
        }))
      
        setOptions(renumberedOptions)

    }



    const handleCorrectAnswerChange = (selectedValue) => {

        const updatedOptions = options.map((option, index) => {

          if (index === parseInt(selectedValue)) {
            return { ...option, isCorrect: true }
          } else {
            return { ...option, isCorrect: false }
          }

        })
      
        setOptions(updatedOptions)

    }


    console.log(options)
    console.log(feedback)
    console.log(questionObj)



  return (
    <div className="border p-4 rounded-lg shadow-md bg-white w-[80%] min-h-[600px]">

      <div className="flex items-center mb-8 mt-4 gap-4">

        <span className="font-semibold">1.</span>
        <input name='questionText' value={questionObj.questionText} onChange={(e) => setQuestionObj({...questionObj , questionText : e.target.value})} type='text' placeholder="Enter Question Name Here ..." className='text-black border rounded-lg w-[40%] p-4' />

      </div>

      <div className='ml-10 mb-8'>
        <button onClick={handleAddOption} className='flex items-center text-lg gap-2 text-[#403685] font-semibold'><MdAdd className='text-[#403685] font-semibold'/> Add Option</button>
      </div>
      
      <div className="mb-16 ml-10  flex flex-col items-start space-y-6">


      {options.map((option, i) => (

            <div key={i} className="option flex items-center gap-4 w-[500px]">

                <input
                    type="text"
                    className={`p-2 w-full rounded-lg border ${
                        option.isCorrect ? "bg-green-500 text-white" : "bg-[#F6F6F6] text-black"
                    }`}                
                    value={option.optionText}
                    onChange={(e) => {
                        const updatedOptions = [...options]
                        updatedOptions[i].optionText = e.target.value
                        setOptions(updatedOptions)
                    }}
                />

                <button onClick={() => handleDeleteOption(i)} className="text-red-500">
                    <FaTrash size={20} />
                </button>

            </div>

        ))}


      </div>


      <div className="mt-6 p-2 flex items-center gap-4">

        <div className='flex flex-col items-start w-[40%] gap-2'>

            <span className='ml-1 text-[#697386] text-lg'>Correct answer</span>

            <select value={selectedAnswer} onChange={(e) => {setSelectedAnswer(e.target.value) ; handleCorrectAnswerChange(e.target.value)}} className="border p-2 rounded w-full">
                
                <option disabled selected value="">Select the correct answer</option>

                {options.map((option, i) => (
                    <option key={i} value={i}>
                        {option.optionText}
                    </option>
                ))}

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

      <div className="mt-8 p-2 flex items-center gap-4">

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



export default MCInputes