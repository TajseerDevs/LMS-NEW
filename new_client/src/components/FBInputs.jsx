import React, { useState } from 'react'
import { FaTrash } from "react-icons/fa"
import { MdAdd , MdInfoOutline } from "react-icons/md"
import { useCreateFillInTheBlankQuestionMutation } from '../store/apis/quizApis'
import { useSelector } from 'react-redux'


const FBInputs = ({questionObj , setQuestionObj , quizData , refetch}) => {

    const initialQuestionObj = {
        type: "",
        questionText: "",
        points: 1,
        explanation: "",
        hint: "",
        options: []
    }
        
    const {token} = useSelector((state) => state.user)

    const [feedback, setFeedback] = useState("")
    const [answerText, setAnswerText] = useState("")
    const [randomizeChoice, setRandomizeChoice] = useState(true)

    const [createFillInTheBlankQuestion] = useCreateFillInTheBlankQuestionMutation()



    const handleCreateFillInTheBlankQuestion = async () => {

        const dashMatches = questionObj.questionText.match(/{dash}/g) || []
        const dashCount = dashMatches.length;
      
        const answerArray = answerText.split("|").map(ans => ans.trim()).filter(ans => ans !== "");
      
        if (dashCount === 0) {
          return alert("You must include at least one {dash} placeholder in the question.");
        }
      
        if (dashCount !== answerArray.length) {
          return alert(`You must provide exactly ${dashCount} answers separated by '|'`);
        }
      
      
        try {

          await createFillInTheBlankQuestion({
            token,
            courseId: quizData?.courseId,
            quizId: quizData?.quizId,
            questionText : questionObj.questionText ,
            feedback ,
            explanation : questionObj.explanation ,
            hint : questionObj.hint ,
            points : questionObj.points ,
            answerText
          })
        
          setQuestionObj(initialQuestionObj)

          await refetch()

        } catch (error) {
          console.log(error)
        }

    }

    
    

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white w-[80%] min-h-[600px]">
        
        <h3 className='text-[#686868] text-2xl font-semibold text-left p-2 ml-4'>Fill in the blank</h3>

        <div className="flex flex-col items-start p-2 mb-4 ml-4 mt-4 gap-4">

            <span className="font-semibold text-[#697386]">Fill in the blank</span>
            <input name='questionText' value={questionObj.questionText} onChange={(e) => setQuestionObj({...questionObj , questionText : e.target.value})} type='text' placeholder="Enter Question Text Here ..." className='text-black border rounded-lg w-[70%] p-4' />
            
            <span className='flex items-center text-left text-lg mt-4 text-[#605D5D] gap-4 w-[80%]'>
                <MdInfoOutline size={24} className='mb-auto mt-2'/>
                Please make sure to use the variable  &#123;dash&#125; in your question title to show the blanks in your question . <br /> You can use multiple  &#123;dash&#125; variables in one question .
            </span>
        
        </div>

        <div className="flex flex-col items-start p-2 mb-4 ml-4 gap-4">

            <span className="font-semibold text-[#697386]">Answers</span>
            <input name='answerText' value={answerText} onChange={(e) => setAnswerText(e.target.value)} type='text' placeholder="planet | orbits" className='text-black border rounded-lg w-[70%] p-4' />
            
            <span className='flex items-center text-left text-lg mt-2 text-[#605D5D] gap-4 w-[80%]'>
                <MdInfoOutline size={24} className='mb-auto mt-2'/>
                Separate multiple answers by a vertical bar |.  one answer per &#123;dash&#125; variable is defined in the question. 
                <br /> Example : Sun | Water | Moon            
            </span>
        
        </div>

        <div className='flex flex-col w-[70%] gap-2 ml-4 p-2 items-start'>

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

        <div className="mt-3 p-2 ml-4 flex items-center gap-4">

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

            <div className='flex flex-col w-[40%] gap-2 items-start'>

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

        <div className="mt-12 p-2 ml-4 flex items-center justify-between gap-6">
        
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
        
                <div className='mr-6 mt-2 flex items-center gap-5'>
                    <button onClick={handleCreateFillInTheBlankQuestion} className='capitalize bg-[#FFC200] text-[#002147] px-6 py-1 rounded-lg font-semibold'>create</button>
                    <FaTrash size={24} className='text-red-500'/>
                </div>
        
            </div>
        
    
        </div>

    )

}


export default FBInputs