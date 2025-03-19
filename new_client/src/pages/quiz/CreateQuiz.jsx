import React, { useEffect, useState } from 'react'
import { FaArrowRightLong , FaAngleLeft } from "react-icons/fa6";
import { useGetAllInstructorCoursesNoPagingQuery, useGetAllInstructorCoursesQuery } from '../../store/apis/instructorApis';
import { useDispatch, useSelector } from 'react-redux';
import { steps } from 'framer-motion';
import { reactHooksModuleName } from '@reduxjs/toolkit/query/react';
import { FaSearch } from "react-icons/fa";
import { RiAddBoxFill } from "react-icons/ri";

import emptyQuestionSvg from "../../assets/empty-question.svg"
import matching from "../../assets/matching.svg"
import tf from "../../assets/tf.svg"
import mc from "../../assets/mc.svg"
import fb from "../../assets/fb.svg"
import dd from "../../assets/dd.svg"

import { useCreateQuizMutation, useGetQuizQuestionsQuery, useUpdateQuizSettingsMutation } from '../../store/apis/quizApis'
import { updateQuiz, resetQuiz , addQuestion } from "../../store/slices/quizSlice"

import TFInputs from "../../components/TFInputs"
import MCInputes from '../../components/MCInputes'
import FBInputs from '../../components/FBInputs';
import MatchInputs from '../../components/MatchInputs';
import DDInputs from '../../components/DDInputs';




const CreateQuiz = () => {

  const dispatch = useDispatch()

  const {token} = useSelector((state) => state.user)
  const quizData = useSelector((state) => state.quiz)
  const questions = useSelector((state) => state.quiz.questions)
  const [activeStep , setActiveStep] = useState(1)

  const {data : quizQuestions , refetch } = useGetQuizQuestionsQuery({token , quizId : quizData?.quizId , courseId : quizData?.courseId} , {skip : activeStep !== 2})

  const [questionObj , setQuestionObj] = useState({
    type : "" ,
    questionText : "" ,
    points : 0 ,
    explanation : "" ,
    hint : "" ,
    options : []
  })

  console.log(quizQuestions)


  
  useEffect(() => {
    localStorage.setItem("quizData", JSON.stringify(quizData))
  }, [quizData])

  console.log(quizData)
  const isValidQuizData = quizData?.courseId && quizData?.quizId && quizData?.courseId !== "" && quizData?.quizId !== ""


  const [page , setPage] = useState(1)
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [createQuiz] = useCreateQuizMutation()
  const [updateQuizSettings] = useUpdateQuizSettingsMutation()

  const [quiz, setQuiz] = useState(() => {
    const savedQuiz = localStorage.getItem("quizData")
    return savedQuiz ? JSON.parse(savedQuiz) : ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    dispatch(updateQuiz({ [name]: value }))
  }



  const handleDurationChange = (e) => {

    const { name, value } = e.target
  
    if (name === "durationValue") {
      dispatch(updateQuiz({ duration: { ...quizData.duration, value: Number(value) } }));
    }
  
    if (name === "durationUnit") {
      dispatch(updateQuiz({ duration: { ...quizData.duration, unit: value } }));
    }

  }


  const handleShffledQuestionsChange = (e) => {

    const { name, type, checked } = e.target
  
    if (name === "shuffledQuestions") {
      dispatch(updateQuiz({ shuffledQuestions: checked }))
    }

  }


  const handleToggleShuffled = () => {
    dispatch(updateQuiz({ shuffledQuestions: !quizData.shuffledQuestions }))
  }


  const handleIsOneWayChange = (e) => {

    const { name, type, checked } = e.target
  
    if (name === "isOneWay") {
      dispatch(updateQuiz({ isOneWay: checked }))
    }

  }


  const handleToggleIsOneWay = () => {
    dispatch(updateQuiz({ isOneWay: !quizData.isOneWay }))
  }




  const handleNextStep = async () => {

    if(quizData?.courseId && quizData?.quizId){
      return setActiveStep(2)
    }
    
    if (!quizData.title || !quizData.description || !quizData.courseId) {
      return alert("Please complete all required step one fields")
    }

    const { title, description, courseId } = quizData

    try {
      
      const res = await createQuiz({title , description , courseId , token}).unwrap()
      dispatch(updateQuiz({ quizId : res.quiz._id }))
      setQuiz(res.quiz)

    } catch (error) {
      console.log(error)
    }

    setActiveStep(2)

  }



  const backToStepOne = () => {

    if(activeStep !== 2){
      return
    }

    if(activeStep === 2){
      setActiveStep(1)
    }else{
      return alert("Please complete all step one fields before continuing.")      
    }

  }



  const goToStepTwo = () => {
    if((activeStep === 1 || activeStep === 3) && quizData?.title && quizData?.description && quizData?.courseId){
      setActiveStep(2)
    }else{
      return alert("Please complete all step one fields before continuing.")
    }
  }



  const goToStepThree = () => {
    if(activeStep === 2 && quizData?.questions.length !== 0){
      setActiveStep(3)
    }else{
      return
    }
  }



  const {data : instructorCourses} = useGetAllInstructorCoursesNoPagingQuery({token})



  const handleUploadQuizSettings = async () => {

    try {
      const response = await updateQuizSettings({token , courseId : quizData?.courseId , quizId : quizData?.quizId , duration : quizData?.duration , dueDate : quizData?.dueDate , maxScore : quizData?.maxScore , passScore : quizData?.passScore , shuffledQuestions : quizData?.shuffledQuestions , isOneWay : quizData?.isOneWay}).unwrap()
      dispatch(resetQuiz())
      setActiveStep(1)
    } catch (error) {
      console.log(error)
    }

  }



  const getQuestionImage = (type) => {
    switch (type) {
      case 'true_false':
        return tf ; 
      case 'multiple_choice':
        return mc; 
      case 'match':
        return matching; 
      case 'drag_drop':
        return dd;  
      case 'fill_in_blank':
        return fb; 
      default:
        return '/images/default.png'; 
    }
  };


  const clearLocalStorage = () => {
    localStorage.removeItem("quizData")
  }


  console.log(quizData)


  return (

    <div className='p-4'>

      <div className='flex gap-6 ml-2 mb-2 cursor-pointer'>
      
        <div onClick={backToStepOne} className='flex gap-3 items-center justify-center'>
          <span className={`border-4 p-2 px-3 rounded-full ${activeStep === 1 ? "text-[#FFC200]" : "text-[#465668]"} ${activeStep === 1 ? "border-[#FFC200]" : "border-gray-400"}`}>01</span>
          <span className={`text-lg font-semibold mb-1 ${activeStep === 1 ? "text-[#FFC200]" : "text-[#465668]"}`}>Quiz Information</span>
          <FaArrowRightLong className={`text-lg font-semibold  ${activeStep === 1 ? "text-[#FFC200]" : "text-[#465668]"}`} size={25}/>
        </div>
      
        <div onClick={goToStepTwo} className='flex gap-3 items-center justify-center'>
          <span className={`border-4 p-2 px-3 rounded-full ${activeStep === 2 ? "text-[#FFC200]" : "text-[#465668]"} ${activeStep === 2 ? "border-[#FFC200]" : "border-gray-400"}`}>02</span>
          <span className={`text-lg font-semibold mb-1 ${activeStep === 2 ? "text-[#FFC200]" : "text-[#465668]"}`}>Questions</span>
          <FaArrowRightLong className={`text-lg font-semibold  ${activeStep === 2 ? "text-[#FFC200]" : "text-[#465668]"}`} size={25}/>
        </div>
      
        <div onClick={goToStepThree} className='flex gap-3 items-center justify-center'>
          <span className={`border-4 p-2 px-3 rounded-full ${activeStep === 3 ? "text-[#FFC200]" : "text-[#465668]"} ${activeStep === 3 ? "border-[#FFC200]" : "border-gray-400"}`}>03</span>
          <span className={`text-lg font-semibold mb-1 ${activeStep === 3 ? "text-[#FFC200]" : "text-[#465668]"}`}>Quiz Setting</span>
          <FaArrowRightLong className={`text-lg font-semibold  ${activeStep === 3 ? "text-[#FFC200]" : "text-[#465668]"}`} size={25}/>
        </div>

        </div>

        {
          activeStep === 1 && (

          <div className='p-6 border-dotted border-2 mt-16 w-[60%]'>

            <h1 className='text-4xl capitalize font-semibold text-[#002147]'>Quiz Title</h1>

            <div className='mt-10'>

              <div className='flex justify-start flex-col'>
                <label className='p-2 text-[#797979] text-xl font-semibold' htmlFor="">Quiz Title</label>
                <input name='title' onChange={handleInputChange} value={quizData?.title} className='p-4 rounded-lg mt-2' type="text" placeholder='Add Quiz title here' />
              </div>

              <div className='flex mt-10 justify-start flex-col'>
                <label className='p-2 text-[#797979] text-xl font-semibold' htmlFor="">Quiz Description</label>
                <textarea name='description' onChange={handleInputChange} value={quizData?.description} className='p-4 rounded-lg mt-2 h-[250px]' type="text" placeholder='Add Quiz title here' />
              </div>

              <div className='flex mt-10 justify-start flex-col'>

                <label className='p-2 text-[#797979] text-xl font-semibold' htmlFor="">Course Name</label>

                <select value={quizData?.courseId || ""} onChange={(e) => dispatch(updateQuiz({ courseId: e.target.value }))} className='w-[30%] p-4 ml-2' name="courseId">

                  <option value="" disabled selected>Choose course</option>

                  {instructorCourses?.map((course) => (
                    <option key={course?._id} value={course?._id}>{course?.title}</option>
                  ))}

                </select>

              </div>

              <div className='flex mt-4 items-center gap-4 justify-end'>
                {/* handle the view of reset button , api call also to reset the , delete the created quiz */}
                <button onClick={() => dispatch(resetQuiz())} className='text-[#403685] border-2 border-[#403685] px-5 font-semibold py-2 capitalize rounded-lg'>reset</button> 
                {/* <button className='text-[#403685] border-2 border-[#403685] px-5 font-semibold py-2 capitalize rounded-lg'>cancel</button> */}
                <button onClick={handleNextStep} className='text-[#002147] bg-[#FFC200] px-5 font-semibold py-2 capitalize rounded-lg'>Save & Continue</button>
                {/* <button onClick={goToStepTwo} className='text-[#002147] bg-[#FFC200] px-5 font-semibold py-2 capitalize rounded-lg'>Complete step two</button> */}
              </div>

            </div>

          </div>

          )

        }

        {

          activeStep === 2 && (
            
            <div className='p-4 mt-4'>

              <div className='flex flex-col p-4 w-full bg-white'>

                <div className='text-[#002147] mb-1 flex items-center gap-4 font-semibold text-2xl'>
                  <FaAngleLeft size={25}/>
                  <span className='mb-1'>Quiz : {quizData?.title}</span>
                </div>

                <span className='ml-6 mt-3 text-[#545454] font-semibold text-lg'>
                  {quizData?.description}
                </span>

              </div>

              {/* sidebar */}

              <div className='w-full flex'>

                <div className="w-[500px] mt-1 h-[1000px] bg-white p-4 flex flex-col">

                  <div className='flex mb-2 items-center justify-between'>
                    
                    <h2 className="text-2xl text-[#002147] font-semibold mb-4">Questions</h2>

                    <button onClick={() => setShowQuestionTypes(!showQuestionTypes)} className="flex items-center mb-2">
                      <RiAddBoxFill className='text-[#FFC200]' size={28} />
                    </button>

                  </div>

                  {showQuestionTypes && (

                    <div className="bg-white w-[300px] ml-20 shadow-md rounded-md mb-4 p-4 border">

                      <h3 className="text-lg font-semibold mb-2">Select Question Type</h3>

                      <ul className="space-y-3">

                        <li onClick={() => {setQuestionObj({...questionObj , type : "true_false"}) ; setShowQuestionTypes(false)}} className="flex w-fit cursor-pointer text-lg items-center gap-3">
                          <img src={tf} alt="True/False" className="w-5 h-5" />
                          True/False
                        </li>

                        <li onClick={() => {setQuestionObj({...questionObj , type : "multiple_choice"}) ; setShowQuestionTypes(false)}} className="flex cursor-pointer text-lg items-center gap-3">
                          <img src={mc} alt="Multiple Choice" className="w-5 h-5" />
                          Multiple Choice
                        </li>

                        <li onClick={() => {setQuestionObj({...questionObj , type : "fill_in_blank"}) ; setShowQuestionTypes(false)}} className="flex cursor-pointer text-lg items-center gap-3">
                          <img src={fb} alt="Fill in the Blanks" className="w-5 h-5" />
                          Fill in the Blanks
                        </li>

                        <li onClick={() => {setQuestionObj({...questionObj , type : "drag_drop"}) ; setShowQuestionTypes(false)}} className="flex cursor-pointer text-lg items-center gap-3">
                          <img src={dd} alt="Drag & Drop" className="w-5 h-5" />
                          Drag & Drop
                        </li>

                        <li onClick={() => {setQuestionObj({...questionObj , type : "match"}) ; setShowQuestionTypes(false)}} className="flex cursor-pointer text-lg items-center gap-3">
                          <img src={matching} alt="Matching" className="w-5 h-5" />
                          Matching
                        </li>

                      </ul>

                    </div>

                  )}

                  <div className="relative mb-4">

                    <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />

                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      placeholder="Search Question"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                  <div className="space-y-4">

                    {quizQuestions?.length === 0 ? (

                      <p className='text-lg p-2 capitalize'>No questions found .</p>

                    ) : (
                      quizQuestions?.map((question , index) => (

                        <div key={index} className="border cursor-pointer flex items-center gap-4 p-4 rounded-md shadow-md">

                          <img src={getQuestionImage(question?.type)} alt={question?.type} className="mb-2 h-8 w-8" />
                          <p className="font-semibold mb-2 text-[18px]">{question?.questionText}</p>

                        </div>

                      ))

                    )}

                  </div>

                </div>

                <div className={`flex-1 flex ${questionObj.type === "" && "items-center justify-center"}  bg-[#f5f5f5] w-[1000px] mt-1 p-16 text-center`}>

                  {questionObj.type === "" && <div className="w-[600px] mb-24 p-8 rounded-lg max-w-lg">

                    <div className="flex justify-center mb-4">

                      <img
                        src={emptyQuestionSvg}
                        alt="Quiz Icon"
                        className="w-36 h-36"
                      />

                    </div>

                    <h2 className="text-2xl capitalize font-bold text-gray-800 mb-2">
                      Add your question here
                    </h2>

                    <p className="text-gray-500">
                      You haven’t added any questions yet. <br /> Start by adding one!
                    </p>

                  </div>}

                  {
                    questionObj.type === "true_false" && <TFInputs refetch={refetch} dispatch={dispatch} addQuestion={addQuestion}  quizData={quizData} questionObj={questionObj} setQuestionObj={setQuestionObj} />
                  }

                  {
                    questionObj.type === "multiple_choice" && <MCInputes refetch={refetch} quizData={quizData} questionObj={questionObj} setQuestionObj={setQuestionObj} />
                  }

                  {
                    questionObj.type === "fill_in_blank" && <FBInputs  refetch={refetch} quizData={quizData} questionObj={questionObj} setQuestionObj={setQuestionObj} />
                  }

                  {
                    questionObj.type === "match" && <MatchInputs  refetch={refetch} quizData={quizData} questionObj={questionObj} setQuestionObj={setQuestionObj} />
                  }

                  {
                    questionObj.type === "drag_drop" && <DDInputs  refetch={refetch} quizData={quizData} questionObj={questionObj} setQuestionObj={setQuestionObj} />
                  }

                </div>

              </div>

            </div>

          )

        }


        {

          activeStep === 3 && (

            <div className='p-6  mt-16 w-full'>
              
              <div className='flex flex-col p-4 w-full bg-white'>

                <div className='text-[#002147] mb-1 flex items-center gap-4 font-semibold text-2xl'>
                  <FaAngleLeft onClick={() => setActiveStep(2)} className='cursor-pointer' size={25}/>
                  <span className='mb-1'>Quiz : {quizData?.title}</span>
                </div>

                <span className='ml-6 mt-3 text-[#545454] font-semibold text-lg'>
                  {quizData?.description}
                </span>

              </div>


              <div className='w-[60%] mt-20'>

                <h1 className='text-xl p-4 border-2 border-dotted capitalize font-semibold text-[#002147]'>Quiz Setting</h1>

                <div className='p-4 border-2 border-dotted h-[480px]'>
                  
                  <div className='pt-10 pl-2'>

                    <div className='flex mt-4 w-full items-center gap-28'> 

                      <div className='flex flex-col'>
                      
                        <span className='mb-4 text-[#002147] text-xl font-semibold'>Quiz Duration</span>
                        
                        <div className='flex items-center gap-6'>

                          <input name="durationValue" onChange={handleDurationChange} value={quizData?.duration?.value} className='p-2 border rounded-lg w-[220px]'  type="number" min={0} />
                          
                          <select name="durationUnit" onChange={handleDurationChange} value={quizData?.duration?.unit} className='w-[250px] border rounded-lg p-2' id="">
                            <option value="minutes">Minutes</option>
                            <option value="hours">hours</option>
                          </select>

                        </div>
                       
                      </div>

                      <div className='flex flex-col'>

                        <span className='mb-4 text-[#002147] text-xl font-semibold'>Quiz Due Date</span>
                        
                        <div className='flex items-center gap-8'>

                          <input name="dueDate" onChange={handleInputChange} value={quizData?.dueDate} className='p-2 border rounded-lg w-[500px]'  type="date" />

                        </div>

                      </div>

                    </div>

                    <div className='flex mt-16 w-full items-center gap-28'>

                      <div>

                        <span className='mb-4 text-[#002147] text-xl font-semibold'>Quiz Score</span>
                          
                        <div className='flex mt-4 items-center gap-8'>
                          <input name="maxScore" onChange={handleInputChange} value={quizData?.maxScore} className='p-2 border rounded-lg w-[500px]'  type="number" min={0} />
                        </div>

                      </div>

                      <div>

                        <span className='mb-4 text-[#002147] text-xl font-semibold'>Passing Grade</span>
                          
                        <div className='flex mt-4 items-center gap-8'>
                          <input name="passScore" onChange={handleInputChange} value={quizData?.passScore} className='p-2 border rounded-lg w-[500px]'  type="number" min={0} />
                        </div>

                      </div>

                    </div>

                    <div className='flex items-center gap-16'>

                    <div className='flex items-center mt-16 gap-10'>

                        <label className="flex items-center text-lg text-[#002147] font-semibold gap-3 cursor-pointer">

                        <input
                            name="shuffledQuestions"
                            type="checkbox"
                            checked={quizData?.shuffledQuestions}
                            onChange={handleShffledQuestionsChange}
                            className="hidden"
                        />

                        <button className={`w-12 h-6 flex items-center bg-gray-300 rounded-full transition duration-300 ${quizData?.shuffledQuestions ? 'bg-yellow-500' : ''}`} onClick={handleToggleShuffled}>
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${quizData?.shuffledQuestions ? 'translate-x-6' : ''}`}/>
                        </button>

                            Randomize Choice

                        </label>
                    
                    </div>

                    <div className='flex items-center mt-16 gap-10'>

                        <label className="flex items-center text-lg text-[#002147] font-semibold gap-3 cursor-pointer">

                        <input
                            name="isOneWay"
                            type="checkbox"
                            checked={quizData?.isOneWay}
                            onChange={handleIsOneWayChange}
                            className="hidden"
                        />

                        <button className={`w-12 h-6 flex items-center bg-gray-300 rounded-full transition duration-300 ${quizData?.isOneWay ? 'bg-yellow-500' : ''}`} onClick={handleToggleIsOneWay}>
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${quizData?.isOneWay ? 'translate-x-6' : ''}`}/>
                        </button>

                          One-Way Quiz

                        </label>
                    
                    </div>
                    
                    </div>

                  </div>

                </div>

                <div className='p-4 mt-10 flex items-center justify-between'>

                  <button onClick={() => {dispatch(resetQuiz()) ; setActiveStep(1)}} className='text-[#403685] font-semibold text-xl'>Cancel</button>

                  <div className='flex items-center gap-6'>
                    <button className='border-2 border-[#403685] px-5 py-2 rounded-lg text-[#403685] font-semibold'>Save as Draft</button>
                    <button onClick={handleUploadQuizSettings} className='px-5 py-2 rounded-lg text-[#002147] bg-[#FFC200] font-semibold'>Publish</button>
                  </div>

                </div>

              </div>

            </div>
          )

        }

    </div>

  )

}



export default CreateQuiz



// const addNewQuestion = (type) => {
//   const newQuestion = {
//     type,
//     questionText: "",
//     points: 1,
//     explanation: "",
//     hint: "",
//     options: [
//       {
//         optionText: "",
//         matchWith: "",
//         isCorrect: false,
//         feedback: "",
//       },
//     ],
//   };

// Append the new question while keeping the previous ones
//   setQuizData((prev) => ({
//     ...prev,
//     questions: [...prev.questions, newQuestion], 
//   }));
// };