import React, { useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useAddQuizQuestionMutation } from '../store/apis/quizApis';
import { useSelector } from 'react-redux'
import { FaArrowRightLong } from "react-icons/fa6"



const DDInputs = ({questionObj , setQuestionObj , quizData , refetch}) => {

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
    const [feedback, setFeedback] = useState("")

    const [addQuizQuestion] = useAddQuizQuestionMutation()
    

    const handleAddOption = () => {

        if(options.length === 4){
            return alert("four options only allowed for mc question")
        }

        const newOption = {
          optionText: `Option ${options.length + 1}`,
          matchWith : `drop target with option ${options.length + 1}` ,
          isCorrect: true,  
          feedback    
        }
    
        setOptions([...options, newOption])

    }



    const handleCreateNewQuestion = async () => {
        
        if(!feedback) return alert("you must provide answer Clarify !")
        
        const updatedOptions = options.map(option => ({
            ...option,
            feedback: `${option.matchWith} is the correct drop answer`
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



    const handleDeleteOption = (indexToDelete) => {

        const updatedOptions = options.filter((_ , index) => index !== indexToDelete)
        
        const renumberedOptions = updatedOptions.map((option, index) => ({
          ...option,
          optionText: `Option ${index + 1}`,
          matchWith : `droped with option ${index + 1}` ,
        }))
      
        setOptions(renumberedOptions)

    }




  return (
    <div className="border p-4 rounded-lg shadow-md bg-white w-[80%] min-h-[600px]">
        
        <div className="flex items-center mb-8 mt-4 gap-4">

            <span className="font-semibold">1.</span>
            <input name='questionText' value={questionObj.questionText} onChange={(e) => setQuestionObj({...questionObj , questionText : e.target.value})} type='text' placeholder="Enter Question Name Here ..." className='text-black border rounded-lg w-[40%] p-4' />

        </div>

        <div className='ml-10 mb-8'>
            <button onClick={handleAddOption} className='flex items-center text-lg gap-2 text-[#403685] font-semibold'><MdAdd className='text-[#403685] font-semibold'/> Add Matching Pair</button>
        </div>


        <div className="mb-10 ml-10 gap-1 flex flex-col items-start space-y-6">
        
        {options.map((option , i) => (
        
            <div key={i} className="option flex items-center gap-12 w-[90%]">
                
                <input 
                    type="text"
                    className={`p-4 w-[500px] rounded-lg border-2 border-[#FFECB0] bg-[#F6F6F6] text-black}`}  
                    value={option.optionText}
                    onChange={(e) => {
                        const updatedOptions = [...options]
                        updatedOptions[i].optionText = e.target.value
                        setOptions(updatedOptions)
                    }}
                />
                
                <button className='text-lg'>
                    <FaArrowRightLong size={30}/>
                </button>

                <input 
                    type="text"
                    className={`p-4 w-[400px] rounded-lg border bg-[#F6F6F6] text-black}`}  
                    value={option.matchWith}
                    onChange={(e) => {
                        const updatedOptions = [...options]
                        updatedOptions[i].matchWith = e.target.value
                        setOptions(updatedOptions)
                    }}
                />

                <button onClick={() => handleDeleteOption(i)} className="text-red-500">
                    <FaTrash size={20} />
                </button>
                
            </div> 

        ))}
        
        
        </div>

        <div className="mt-2 p-2 ml-6 flex items-center gap-4">

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

        <div className="mt-8 p-2 ml-6 flex items-center gap-4">

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

        <div className="mt-12 ml-6 flex items-center justify-between gap-6">
        
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



export default DDInputs