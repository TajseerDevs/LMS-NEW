const Course = require("../models/Course") 
const Quiz = require("../models/Quiz")
const User = require("../models/User")
const Instructor = require("../models/Instructor")
const Student = require("../models/Student")

const createError = require("../utils/createError")
const Joi = require("joi")
const Answer = require("../models/Answer")
const StudentQuizResult = require("../models/StudentQuizResult")
const QuizResult = require("../models/QuizResult")





const createQuiz = async (req , res , next) => {

    try {
        
      const { courseId } = req.params

      const course = await Course.findById(courseId)

      if (!course) {
        return next(createError("Course not found" , 404))
      }

      const userId = req.user._id
        
      const instructor = await Instructor.findOne({userObjRef : userId})

      if (!instructor) {
        return next(createError("Instructor not exist" , 404))
      }

      if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
        return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
      }

      const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).optional(),
        duration: Joi.object({
          value: Joi.number().min(1).max(600).required(), 
          unit: Joi.string().valid("minutes", "hours").default("minutes")
        }).required(),
        maxScore: Joi.number().min(1).max(100).required(),
        dueDate: Joi.date().required().greater('now').messages({
          "date.greater": `"due Date" must be later than the current date`,
        }), 
        quizType: Joi.string()
          .valid(
            "true_false",
            "multiple_choice",
            "match",
            "drag_drop",
            "fill_in_blank" ,
            "mixed"
          )
          .required(),
        questions: Joi.array()
          .items(
            Joi.object({
              type: Joi.string()
                .valid(
                  "true_false",
                  "multiple_choice",
                  "match",
                  "drag_drop",
                  "fill_in_blank"
                )
                .required(),
              questionText: Joi.string().min(3).required(),
              points: Joi.number().min(1).max(100).default(1),
              explanation: Joi.string().optional(),
              hint: Joi.string().optional(),
              options: Joi.array()
                .items(
                  Joi.object({
                    optionText: Joi.string().required(),
                    isCorrect: Joi.boolean().required(),
                    feedback: Joi.string().optional(),
                    matchWith: Joi.string().when("type", {
                      is: "match",
                      then: Joi.string().required(), 
                    }),
                  })
                )
                .when("type", {
                  is: "multiple_choice",
                  then: Joi.array().min(2).required(),
                  otherwise: Joi.array().optional(),
                })
                .when("type", {
                  is: "true_false",
                  then: Joi.array()
                    .length(2)
                    .required()
                    .custom((value, helpers) => {

                      const trueOption = value.find((opt) => opt.optionText.toLowerCase() === "true")
                      const falseOption = value.find((opt) => opt.optionText.toLowerCase() === "false")
  
                      if (!trueOption || !falseOption) {
                        return helpers.message(
                          "True/False questions must have exactly two answers options : 'True' and 'False'"
                        )
                      }
  
                      return value

                    }),
                })
                .when("type", {
                  is: "match",
                  then: Joi.array()
                  .min(2)
                  .custom((value, helpers) => {

                    // Each optionText (e.g., "France", "Germany", "Spain") is unique
                    const hasDuplicateLeft = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.optionText === v.optionText))
              
                    if (hasDuplicateLeft) {
                      return helpers.message("Match options must have unique 'option Text' ")
                    }

                    // Each matchWith (e.g., "Paris", "Berlin", "Madrid") is unique.
                    const hasDuplicateRight = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.matchWith === v.matchWith))
              
                    if (hasDuplicateRight) {
                      return helpers.message("Match options must have unique match With")
                    }

                    // No matchWith is missing or empty , At least 2 pairs are provided 
                    const missingMatch = value.some((pair) => !pair.matchWith || pair.matchWith.trim() === "")

                    if (missingMatch) {
                      return helpers.message("Each match option must have a 'match With' value.")
                    }

                    return value

                  }).required()

                })
                .when("type", {
                  is: "drag_drop",
                  then: Joi.array()
                  .min(2)
                  .custom((value, helpers) => {

                    // Each optionText (e.g., "France", "Germany", "Spain") is unique
                    const hasDuplicateLeft = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.optionText === v.optionText))
              
                    if (hasDuplicateLeft) {
                      return helpers.message("Match options must have unique 'option Text' ")
                    }

                    // Each matchWith (e.g., "Paris", "Berlin", "Madrid") is unique.
                    const hasDuplicateRight = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.matchWith === v.matchWith))
              
                    if (hasDuplicateRight) {
                      return helpers.message("Match options must have unique match With")
                    }

                    // No matchWith is missing or empty , At least 2 pairs are provided 
                    const missingMatch = value.some((pair) => !pair.matchWith || pair.matchWith.trim() === "")

                    if (missingMatch) {
                      return helpers.message("Each match option must have a 'match With' value.")
                    }

                    return value

                  }).required()

                })
                .when("type", {
                  is: "fill_in_blank",
                  then: Joi.array()
                  .items(
                    Joi.object({
                      optionText: Joi.string().required(),
                      isCorrect: Joi.boolean().required(),
                      feedback: Joi.string().optional(),
                    })
                  )
                  .min(1)
                  .required()
                }),

            })

          )
          .min(1)
          .required(),
      })

      const { error , value } = schema.validate(req.body , {abortEarly : false})

      if (error) {
        return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
      }

      const { title , description , quizType , duration , questions , maxScore , dueDate } = value
        
      const totalPoints = questions.reduce((sum , question) => sum + question.points , 0)

      if (totalPoints > maxScore || totalPoints !== maxScore) {
        return next(createError("Total points of all questions must be equal to the quiz max score" , 400))
      }

      let convertedDuration = {
        value: duration.value,
        unit: duration.unit,
      }

      if (duration.unit === "hours") {
        convertedDuration.value = duration.value * 60
        convertedDuration.unit = "minutes"
      }

      const quiz = new Quiz({
        title,
        description,
        courseId ,
        instructorId : instructor._id ,
        duration: convertedDuration,
        questions,
        quizType ,
        maxScore ,
        dueDate
      })
        
      const savedQuiz = await quiz.save()

      course.quizzes.push(savedQuiz._id)

      await course.save()

      res.status(201).json({ message : `Quiz created and added to course : ${course.title} successfully.` , quiz : savedQuiz })

    } catch (error) {
      next(error)
    }

}




const createQuizv2 = async (req , res , next) => {

  try {

    const { courseId } = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    const userId = req.user._id
        
    const instructor = await Instructor.findOne({userObjRef : userId})

    if (!instructor) {
      return next(createError("Instructor not exist" , 404))
    }

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
    }

    const schema = Joi.object({
      title: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).optional(),
    })

    const { error , value } = schema.validate(req.body , {abortEarly : false})

    if (error) {
      return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
    }

    const { title , description } = value

    const quiz = new Quiz({
      title,
      description,
      courseId ,
      instructorId : instructor._id ,
    })

    const savedQuiz = await quiz.save()

    course.quizzes.push(savedQuiz._id)

    await course.save()

    res.status(201).json({ message : `Quiz created and added to course : ${course.title} successfully.` , quiz : savedQuiz })

  } catch (error) {
    next(error)
  }

}



const addQuizQuestion = async (req , res , next) => {

  try {
    
    const { quizId , courseId} = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    const userId = req.user._id
      
    const instructor = await Instructor.findOne({userObjRef : userId})

    if (!instructor) {
      return next(createError("Instructor not exist" , 404))
    }

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
    }

    const schema = Joi.object({
      question: Joi.object({
            type: Joi.string()
              .valid(
                "true_false",
                "multiple_choice",
                "match",
                "drag_drop",
                "fill_in_blank"
              )
              .required(),
            questionText: Joi.string().min(3).required(),
            points: Joi.number().min(1).max(100).default(1),
            explanation: Joi.string().allow("").optional(),
            hint: Joi.string().allow("").optional(),
            options: Joi.array()
              .items(
                Joi.object({
                  optionText: Joi.string().required(),
                  isCorrect: Joi.boolean().required(),
                  feedback: Joi.string().allow("").optional(),
                  matchWith: Joi.string().when("type", {
                    is: "match",
                    then: Joi.string().required(), 
                  }),
                })
              )
              .when("type", {
                is: "multiple_choice",
                then: Joi.array().min(2).required(),
                otherwise: Joi.array().optional(),
              })
              .when("type", {
                is: "true_false",
                then: Joi.array()
                  .length(2)
                  .required()
                  .custom((value, helpers) => {

                    const trueOption = value.find((opt) => opt.optionText.toLowerCase() === "true")
                    const falseOption = value.find((opt) => opt.optionText.toLowerCase() === "false")

                    if (!trueOption || !falseOption) {
                      return helpers.message(
                        "True/False questions must have exactly two answers options : 'True' and 'False'"
                      )
                    }

                    return value

                  }),
              })
              .when("type", {
                is: "match",
                then: Joi.array()
                .min(2)
                .custom((value, helpers) => {

                  // Each optionText (e.g., "France", "Germany", "Spain") is unique
                  const hasDuplicateLeft = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.optionText === v.optionText))
            
                  if (hasDuplicateLeft) {
                    return helpers.message("Match options must have unique 'option Text' ")
                  }

                  // Each matchWith (e.g., "Paris", "Berlin", "Madrid") is unique.
                  const hasDuplicateRight = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.matchWith === v.matchWith))
            
                  if (hasDuplicateRight) {
                    return helpers.message("Match options must have unique match With")
                  }

                  // No matchWith is missing or empty , At least 2 pairs are provided 
                  const missingMatch = value.some((pair) => !pair.matchWith || pair.matchWith.trim() === "")

                  if (missingMatch) {
                    return helpers.message("Each match option must have a 'match With' value.")
                  }

                  return value

                }).required()

              })
              .when("type", {
                is: "drag_drop",
                then: Joi.array()
                .min(2)
                .custom((value, helpers) => {

                  // Each optionText (e.g., "France", "Germany", "Spain") is unique
                  const hasDuplicateLeft = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.optionText === v.optionText))
            
                  if (hasDuplicateLeft) {
                    return helpers.message("Match options must have unique 'option Text' ")
                  }

                  // Each matchWith (e.g., "Paris", "Berlin", "Madrid") is unique.
                  const hasDuplicateRight = value.some((v , i) => value.find((pair , idx) => idx !== i && pair.matchWith === v.matchWith))
            
                  if (hasDuplicateRight) {
                    return helpers.message("Match options must have unique match With")
                  }

                  // No matchWith is missing or empty , At least 2 pairs are provided 
                  const missingMatch = value.some((pair) => !pair.matchWith || pair.matchWith.trim() === "")

                  if (missingMatch) {
                    return helpers.message("Each match option must have a 'match With' value.")
                  }

                  return value

                }).required()

              })
              .when("type", {
                is: "fill_in_blank",
                then: Joi.array()
                .items(
                  Joi.object({
                    optionText: Joi.string().required(),
                    isCorrect: Joi.boolean().required(),
                    feedback: Joi.string().optional(),
                  })
                )
                .min(1)
                .required()
              }),

          })

        .min(1)
        .required(),
    })

    const { error , value } = schema.validate(req.body , {abortEarly : false})

    if (error) {
      return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
    }

    const { question } = value

    quiz.questions.push(question)

    await quiz.save()

    await course.save()

    res.status(201).json({ message : `Question created and added to quiz : ${quiz.title} successfully.` , quiz , question })

  } catch (error) {
    next(error)
  }

}




const createFillInTheBlankQuestion  = async (req , res , next) => {

  try {
    
    const { quizId , courseId } = req.params
    const { questionText, feedback, explanation, hint, points, answerText } = req.body

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    const userId = req.user._id
      
    const instructor = await Instructor.findOne({userObjRef : userId})

    if (!instructor) {
      return next(createError("Instructor not exist" , 404))
    }

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
    }

    const dashMatches = questionText.match(/{dash}/g) || []
    const dashCount = dashMatches.length

    const answerArray = answerText.split("|").map(ans => ans.trim()).filter(ans => ans !== "")

    if (dashCount !== answerArray.length) {
      return res.status(400).json({ error: `You must provide exactly ${dashCount} answers.` })
    }

    const options = answerArray.map((answer) => ({
      optionText: answer ,
      isCorrect: true , 
      feedback: feedback  
    }))

    const newQuestion = {
      type: "fill_in_blank",
      questionText,
      options,
      feedback,
      explanation,
      hint,
      points,
      courseId,
      quizId,
    }

    quiz.questions.push(newQuestion)

    await quiz.save()

    await course.save()

    res.status(201).json({ message : `Question created and added to quiz : ${quiz.title} successfully.` , quiz })

  } catch (error) {
    next(error)
  }

}




const updateQuizSettings = async (req , res , next) => {

  try {
    
    const { quizId , courseId } = req.params
    const {duration , dueDate , maxScore , passScore , shuffledQuestions , isOneWay} = req.body

    const requiredFields = ["duration", "dueDate", "maxScore", "passScore", "shuffledQuestions", "isOneWay"];
    const missingFields = requiredFields.filter(field => req.body[field] === undefined);
    
    if (missingFields.length > 0 || !duration.value || !duration.unit) {
      return next(createError(`Missing fields: ${missingFields.join(", ")}`, 400));
    }
    
    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    const userId = req.user._id
      
    const instructor = await Instructor.findOne({userObjRef : userId})

    if (!instructor) {
      return next(createError("Instructor not exist" , 404))
    }

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
    }

    const totalPoints = quiz.questions.reduce((sum , question) => sum + question.points , 0)

    if (totalPoints > Number(maxScore) || totalPoints !== Number(maxScore)) {
      return next(createError("Total points of all questions must be equal to the quiz max score" , 400))
    }

    if(passScore > Number(maxScore)){
      return next(createError("pass score must be less then max score" , 400))
    }

    let convertedDuration = {
      value: duration.value,
      unit: duration.unit,
    }

    if (duration.unit === "hours") {
      convertedDuration.value = duration.value * 60
      convertedDuration.unit = "minutes"
    }

    quiz.duration = convertedDuration
    quiz.dueDate = new Date(dueDate)
    quiz.maxScore = Number(maxScore)
    quiz.passScore = passScore
    quiz.shuffledQuestions = shuffledQuestions  
    quiz.isOneWay = isOneWay 

    const savedQuiz = await quiz.save()
    
    await course.save()

    res.status(200).json({ message : `Quiz settings has been updated successfully.` , quiz : savedQuiz })

  } catch (error) {
    next(error)
  }

}




const getCourseLastestQuizzes = async (req , res , next) => {

  try {
    
    const { courseId } = req.params
    const page =  parseInt(req.query.page) || 1
    const limit = 3

    const course = await Course.findById(courseId)

    if(!course){
      return next(createError("Course not found" , 404))
    }

    const quizzes = await Quiz.find({courseId}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()
    
    if(!quizzes){
      return res.status(200).json({msg : "no quizzes for this course"})
    }

    const studentDoc = await Student.findOne({userObjRef : req.user._id})

    if(!studentDoc){
      return next(createError("student not exist" , 404))
    }
    
    const quizIds = quizzes.map((quiz) => quiz._id)

    const quizResults = await QuizResult.find({
      studentId : studentDoc._id,
      quizId: { $in: quizIds },
    }).select("quizId")


    const submittedQuizIds = new Set(quizResults.map((result) => result.quizId.toString()))

    const quizzesWithSubmission = quizzes.map((quiz) => ({
      ...quiz,
      hasSubmission: submittedQuizIds.has(quiz._id.toString()),
    }))
    
    const totalQuizzes = await Quiz.countDocuments({courseId})

    res.status(200).json({
      currentPage: page,
      totalQuizzes ,
      totalPages : Math.ceil(totalQuizzes / limit) ,
      quizzes : quizzesWithSubmission
    })

  } catch (error) {
    next(error)
  }

}




const getQuizDetails = async (req , res , next) => {

  try {
    
    const { quizId } = req.params

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    res.status(200).json(quiz)

  } catch (error) {
    next(error)
  }

}




const getQuizQuestions = async (req , res , next) => {

  try {
    
    const { quizId , courseId } = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    const userId = req.user._id
      
    const instructor = await Instructor.findOne({userObjRef : userId})

    if (!instructor) {
      return next(createError("Instructor not exist" , 404))
    }

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not the course instructor or admin to create a new quiz" , 403))
    }

    res.status(200).json(quiz.questions)

  } catch (error) {
    next(error)
  }

}




const getInstructorQuizzes = async (req , res , next) => {

  try {
        
    const page = parseInt(req.query.page) || 1
    const limit = 8
    const skip = (page - 1) * limit

    const instructor = await Instructor.findOne({userObjRef : req.user._id})

    const quizzes = await Quiz.find({
      instructorId: instructor._id,
      $and: [
        { "duration.value": { $exists: true, $ne: null } },
        { maxScore: { $exists: true, $ne: null } },
        { passScore: { $exists: true, $ne: null } }
      ]
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }) 
    .populate("courseId") 
    .populate("answers") 
    .exec()

    const totalQuizzes = await Quiz.countDocuments({ instructorId: instructor._id,
      $and: [
        { "duration.value": { $exists: true, $ne: null } },
        { maxScore: { $exists: true, $ne: null } },
        { passScore: { $exists: true, $ne: null } }
      ]
    })

    res.json({
      quizzes,
      totalPages: Math.ceil(totalQuizzes / limit),
      currentPage: page,
      totalQuizzes
    })

  } catch (error) {
    next(error)
  }

}



// ! needs some update to check if there is an existing quiz result document object 
const submitQuizAnswers = async (req , res , next) => {

  try {

    const { quizId } = req.params

    const {answers , timeLeft } = req.body

    const studentDoc = await Student.findOne({userObjRef : req.user._id})
    
    const instructorDoc = await Instructor.findOne({userObjRef : req.user._id})

    if(!studentDoc && !instructorDoc){
      return next(createError("you can't make a quiz submission"))
    }
    
    if(!answers){
      return next(createError("Quiz answers are required"))
    }

    if(timeLeft === undefined){
      return next(createError("Quiz spent time is missing"))
    }

    const quiz = await Quiz.findById(quizId)
        
    if (!quiz) {
      return next(createError("Quiz not found" , 404))
    }

    if (quiz.submittedBy.includes(studentDoc._id)) {
      return next(createError("You have already submitted this quiz" , 400))
    }

    const initialTimeInSeconds = quiz.duration?.unit === "hours" ? quiz.duration.value * 60 * 60 : quiz.duration.value * 60

    const spentTime = initialTimeInSeconds - timeLeft
    const spentMinutes = Math.floor(spentTime / 60)
    const spentSeconds = spentTime % 60

    let totalScore = 0
    let maxScore = quiz.maxScore || 0
    let passScore = quiz.passScore || 0

    let correctAnswersCount = 0
    let partiallyCorrectAnswersCount = 0
    let incorrectAnswersCount = 0


    quiz.questions.forEach((question) => {
      
      const userAnswer = answers[question._id]

      let questionScore = 0

      if (!userAnswer) {
        incorrectAnswersCount++
        return
      }


      switch (question.type) {

        case "true_false":
          if (userAnswer.toString() === question.options.find(opt => opt.isCorrect).optionText) {
            questionScore = question.points
            correctAnswersCount++
          } else {
            incorrectAnswersCount++
          }
          break


        case "multiple_choice":
          const correctOption = question.options.find(opt => opt.isCorrect).optionText
          if (userAnswer === correctOption) {
            questionScore = question.points
            correctAnswersCount++
          } else {
            incorrectAnswersCount++
          }
          break

          case "fill_in_blank":

            const correctAnswers = question.options.filter(opt => opt.isCorrect).map(opt => opt.optionText)
            
            const pointPerCorrect = question.points / correctAnswers.length
                      
            if (JSON.stringify(userAnswer) === JSON.stringify(correctAnswers)) {
              
              questionScore = question.points
              correctAnswersCount++

            } else if (userAnswer.length === correctAnswers.length) {

              let correctCount = 0

              userAnswer.forEach((ans, idx) => {

                if (ans === correctAnswers[idx]) {
                  questionScore += pointPerCorrect
                  correctCount++
                }

              })
          
              if (correctCount === correctAnswers.length) {
                correctAnswersCount++
              } else if (correctCount > 0) {
                partiallyCorrectAnswersCount++
              } else {
                incorrectAnswersCount++
              }

            } else {
              incorrectAnswersCount++
            }
          
            totalScore += questionScore
            break

        case "match":
          const correctMatches = Object.fromEntries(question.options.map(opt => [opt.optionText, opt.matchWith]))
          const pointPerMatch = question.points / Object.keys(correctMatches).length
          let correctMatchesCount = 0

          Object.entries(userAnswer).forEach(([option, match]) => {
            if (correctMatches[option] === match) {
              questionScore += pointPerMatch
              correctMatchesCount++
            }
          })

          if (correctMatchesCount === Object.keys(correctMatches).length) {
            correctAnswersCount++
          } else if (correctMatchesCount > 0) {
            partiallyCorrectAnswersCount++
          } else {
            incorrectAnswersCount++
          }
          break


        case "drag_drop":
          const correctDrops = Object.fromEntries(question.options.map(opt => [opt.optionText, opt.matchWith]))
          const pointPerDrop = question.points / Object.keys(correctDrops).length
          let correctDropsCount = 0

          Object.entries(userAnswer).forEach(([option, drop]) => {
            if (correctDrops[option] === drop) {
              questionScore += pointPerDrop
              correctDropsCount++
            }
          });

          if (correctDropsCount === Object.keys(correctDrops).length) {
            correctAnswersCount++
          } else if (correctDropsCount > 0) {
            partiallyCorrectAnswersCount++
          } else {
            incorrectAnswersCount++
          }
          break

        default:
          incorrectAnswersCount++
          break

      }

      totalScore += questionScore

    })


    const percentage = ((totalScore / maxScore) * 100).toFixed(2)
    const passStatus = totalScore >= passScore ? "Passed" : "Failed"


    const quizResult = new QuizResult({
      studentId : studentDoc._id ,
      quizId,
      courseId : quiz.courseId,
      totalScore: totalScore.toFixed(2),
      maxPossibleScore: maxScore,
      passScore,
      percentage: `${percentage}%`,
      passStatus : passStatus === "Passed" ? true : false,
      correctAnswersCount,
      partiallyCorrectAnswersCount,
      incorrectAnswersCount,
      spentTime: `${spentMinutes}m ${spentSeconds}s`,
    })

    await quizResult.save()

    quiz.submittedBy.push(studentDoc._id)
    
    await quiz.save()


    res.status(200).json({
      quizId,
      totalScore: totalScore.toFixed(2),
      maxPossibleScore: maxScore,
      passScore,
      percentage: `${percentage}%`,
      passStatus,
      correctAnswersCount,
      partiallyCorrectAnswersCount,
      incorrectAnswersCount,
      spentTime: `${spentMinutes}m ${spentSeconds}s`
    })


  } catch (error) {
    console.error("Error in quiz submission:", error)
    next(error)
  }

}




const getQuizSubmissionResult = async (req , res , next) => {

  try {
    
    const { quizId } = req.params

    const quizResult = await QuizResult.findOne({ quizId })
    .populate('courseId')
    .populate('quizId')
    .populate({
      path: 'studentId',
      populate: {
        path: 'userObjRef',
        model: 'users', 
      }
    })

    if (!quizResult) {
      return next(createError(404 , "Quiz result not found for the given quiz"))
    }

    res.status(200).json(quizResult)

  } catch (error) {
    next(error)
  }

}




const checkQuizSubmission =  async (req  , res , next) => {

  try {
    
    const { quizId } = req.params

    const quiz = await Quiz.findById(quizId)
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    const studentDoc = await Student.findOne({userObjRef : req.user._id})

    if(!studentDoc){
      return next(createError("Student not exist"))
    }

    const alreadySubmitted = quiz.submittedBy.includes(studentDoc._id)

    res.status(200).json({ submitted: alreadySubmitted })

  } catch (error) {
    next(error)    
  }

}










// 
const submitAnswers = async (req , res , next) => {

    try {
        
      const { quizId , courseId} = req.params
      const { answers } = req.body

      if(!answers){
        return next(createError("No answers been provided" , 400))
      }

      const userId = req.user._id
    
      const user = await User.findById(userId)
        
      if (!user) {
        return next(createError("Not Authorized" , 401))
      }
    
      const studentDoc = await Student.findOne({userObjRef : userId})
    
      if(!studentDoc){
        return next(createError("Student not exist" , 404))
      }
    
      const course = await Course.findById(courseId)
    
      if(!course){
        return next(createError("Course not exist" , 404))
      }
    
      if (!course.studentsEnrolled.includes(studentDoc._id)) {
        return next(createError("Student is not enrolled in this course" , 400))
      }

      const quiz = await Quiz.findById(quizId).populate('questions')
        
      if (!quiz) {
        return next(createError("Quiz not found" , 404))
      }

      if(new Date() > new Date(quiz.dueDate)) {
        return next(createError(`The Quiz is past , its due date of ${quiz.dueDate.toLocaleString()}` , 400))
      }

      if (quiz.submittedBy.includes(studentDoc._id)) {
        return next(createError("You have already submitted answers for this quiz" , 400))
      }
      
      let totalScore = 0
      const answerIds = []
        
        for (const answer of answers) {
            
          const question = quiz.questions.find(q => q._id.toString() === answer.questionId)
         
          if (!question) {
            return next(createError(`Question ID ${answer.questionId} not found in this quiz`, 400))
          }

          if(question.type === "true_false"){

            if (question.options.length !== 2) {
              return next(createError("True/False questions must have exactly two options", 400))
            }
              
            const correctOptions = question.options.filter(option => option.isCorrect)

            if (correctOptions.length !== 1) {
              return next(createError("Exactly one option must be marked as correct for True/False questions" , 400))
            }

          }

          let newAnswer

          if (question.type === "match" || question.type === "drag_drop") {

            const correctMatches = question.options.filter(option => option.isCorrect)

            let questionPoints = question.points
            let pointsPerMatch = questionPoints / correctMatches.length
          
            let totalQuestionScore = 0

            let feedbackMessage = ''
            const userAnswerText = []
          
            for (const match of answer.matches) {

              const correctMatch = correctMatches.find(option => option.optionText === match.optionText && option.matchWith === match.matchWith)
                  
                if (correctMatch) {
                  totalQuestionScore += pointsPerMatch
                  userAnswerText.push({ optionText: match.optionText, matchWith: match.matchWith })
                  feedbackMessage += `Correct! ${match.optionText} matches ${match.matchWith}. `
                } else {
                  feedbackMessage += `Incorrect! ${match.optionText} does not match ${match.matchWith}. `
                }
              }
          
              newAnswer = new Answer({
                studentId: studentDoc._id,
                questionId: question._id,
                answerText: JSON.stringify(userAnswerText),  
                quizId: quiz._id,
                isCorrect: totalQuestionScore === questionPoints, 
                feedback: feedbackMessage,
                pointsAwarded: totalQuestionScore, 
              })
          
              await newAnswer.save()

              quiz.answers.push(newAnswer._id)
              
              answerIds.push(newAnswer._id)

              totalScore += totalQuestionScore

          }else {
            // true_false , multiple_choice , fill_in_blank quizzes cases
            const correctOption = question.options.find(option => option.isCorrect)
  
            const isCorrect = answer.answerText === correctOption.optionText
  
            newAnswer = new Answer({
              studentId : studentDoc._id ,
              questionId: question._id,
              answerText: answer.answerText,
              quizId : quiz._id ,
              isCorrect,
              feedback: isCorrect ? correctOption.feedback : 'Incorrect , try again.',
              pointsAwarded: isCorrect ? question.points : 0 ,
            })
              
            await newAnswer.save()

            answerIds.push(newAnswer._id)
  
            quiz.answers.push(newAnswer._id)
  
            if (isCorrect) {
              totalScore += question.points
            }

          }

        }

        quiz.submittedBy.push(studentDoc._id)

        await quiz.save()

        const studentQuizResult = new StudentQuizResult({
          studentId: studentDoc._id,
          courseId,
          quizId,
          totalScore : totalScore = totalScore.toFixed(2) ,
          maxScore: quiz.maxScore,
          answers: answerIds,
        })

        await studentQuizResult.save()

        res.status(200).json({
          message: 'Quiz submitted successfully',
          totalScore,
          maxScore: quiz.maxScore,
        })

    } catch (error) {
      next(error)
    }

}




const getStudentResults = async (req , res , next) => {

  try {
    
    const { courseId, quizId} = req.query
    const page = Number(req.query.page) || 1

    const limit = 10

    const query = {}

    if (courseId) query.courseId = courseId
    if (quizId) query.quizId = quizId

    const pageInt = parseInt(page , 10)
    const skip = (pageInt - 1) * limit

    const [results, totalResults] = await Promise.all([StudentQuizResult.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userObjRef' , select : "firstName lastName profilePic"}
      })
      .populate('quizId' , "-questions") 
      .populate('courseId' , "title ") 
      .populate('answers')
      .skip(skip)
      .limit(limit),
      StudentQuizResult.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalResults / limit)

    res.status(200).json({
      message: 'Results fetched successfully',
      results,
      totalResults,
      totalPages,
      currentPage: pageInt,
    })

  } catch (error) {
    next(error)
  }

}




const getAllQuizzes = async (req , res , next) => {

    try {
        
        const { courseId } = req.params
        const page = Number(req.query.page) || 1

        const limit = 10

        const skip = (page - 1) * limit

        const userId = req.user._id
      
        const course = await Course.findById(courseId)

        if (!course) {
            return next(createError('Course not found' , 404))
        }
        
        if (req.user.role === "admin") {

        } else if (req.user.role === "instructor") {

            const instructorDoc = await Instructor.findOne({ userObjRef: userId })

            if (!instructorDoc) {
              return next(createError("Instructor not found", 404))
            }

            if (course.instructorId.toString() !== instructorDoc._id.toString()) {
              return next(createError("You are not the instructor of this course", 403))
            }

          } else if (req.user.role === "student") {

            const studentDoc = await Student.findOne({ userObjRef: userId })

            if (!studentDoc) {
              return next(createError("Student not found", 404))
            }

            if (!course.studentsEnrolled.includes(studentDoc._id)) {
              return next(createError("Student is not enrolled in this course", 400))
            }

          } else {
            return next(createError("Unauthorized role", 403))
          }
      
        const totalQuizzes = await Quiz.countDocuments({ courseId })

        const totalPages = Math.ceil(totalQuizzes / limit)

        const quizzes = await Quiz.find({ courseId }).select("-answers -submittedBy").skip(skip).limit(limit)

        res.status(200).json({
            currentPage: page ,
            totalPages ,
            totalQuizzes ,
            quizzes,
        })

    } catch (error) {
        next(error)
    }

  }




  const getAllInstructorQuizzes = async (req , res , next) => {

    try {
      
      const page  = Number(req.query.page) || 1

      const instructor = await Instructor.findOne({userObjRef : req.user._id})

      if (!instructor) {
        return next(createError("Instructor not found", 404))
      }

      const quizzes = await Quiz.find({ instructorId : instructor._id })
      .skip((page - 1) * 10) 
      .limit(10) 
      .populate('courseId') 
      .populate('instructorId')

      const totalQuizzes = await Quiz.countDocuments({ instructorId : instructor._id })

      res.status(200).json({
        quizzes ,
        currentPage: page ,
        totalPages: Math.ceil(totalQuizzes / 10) ,
        totalQuizzes ,
      })

    } catch (error) {
      next(error)
    }

  }




  // needs update
  const updateQuiz = async (req , res , next) => {

    try {
        
        const { quizId , courseId } = req.params
        const userId = req.user._id

        const course = await Course.findById(courseId)

        if (!course) {
          return next(createError("Course not found" , 404))
        }

        const instructorDoc = await Instructor.findOne({ userObjRef: userId })

        if (!instructorDoc) {
          return next(createError("Instructor not found" , 404))
        }

        if (course.instructorId.toString() !== instructorDoc._id.toString()) {
          return next(createError("You are not the instructor of this course" , 403))
        }

        const schema = Joi.object({
            title: Joi.string().min(3).max(100).optional(),
            description: Joi.string().max(500).optional(),
            duration: Joi.number().min(1).optional(),
            maxScore: Joi.number().min(1).max(100).optional(),
            quizType: Joi.string()
              .valid("true_false", "multiple_choice", "match", "drag_drop", "fill_in_blank")
              .optional(),
            questions: Joi.array()
              .items(
                Joi.object({
                  type: Joi.string()
                    .valid("true_false", "multiple_choice", "match", "drag_drop", "fill_in_blank")
                    .required(),
                  questionText: Joi.string().min(3).required(),
                  points: Joi.number().min(1).max(100).default(1),
                  explanation: Joi.string().optional(),
                  hint: Joi.string().optional(),
                  options: Joi.array()
                    .items(
                      Joi.object({
                        optionText: Joi.string().required(),
                        isCorrect: Joi.boolean().required(),
                        feedback: Joi.string().optional(),
                      })
                    )
                    .when("type", {
                      is: "multiple_choice",
                      then: Joi.array().min(2).required(),
                      otherwise: Joi.array().optional(),
                    }),
                })
              )
              .min(1)
              .optional(),
          })

        const { error , value } = schema.validate(req.body, { abortEarly: false })

        if (error) {
          return next(createError(error.details.map((err) => err.message.replace(/"/g, "")).join(", ") , 400))
        }

        const { title, description, quizType, duration, questions, maxScore } = value

        const quiz = await Quiz.findById(quizId)

        if (!quiz) {
          return next(createError("Quiz not found" , 404))
        }
      
        if (title) quiz.title = title
        if (description) quiz.description = description
        if (quizType) quiz.quizType = quizType
        if (duration) quiz.duration = duration

        if (questions) {

            const totalPoints = questions.reduce((sum, question) => sum + question.points , 0)

            if (totalPoints > maxScore || totalPoints !== maxScore) {
              return next(createError("Total points of all questions must equal the max score" , 400))
            }

            quiz.questions = questions

        }

        if (maxScore) quiz.maxScore = maxScore

        const updatedQuiz = await quiz.save()

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz: updatedQuiz,
        })

    } catch (error) {
        next(error)
    }

  }




// needs update
  const updateQuizQuestion  = async (req , res , next) => {

    try {
        
        const { quizId , courseId , questionId } = req.params
        const userId = req.user._id

        const course = await Course.findById(courseId)

        if (!course) {
          return next(createError("Course not found", 404))
        }

        const instructorDoc = await Instructor.findOne({ userObjRef: userId })

        if (!instructorDoc) {
          return next(createError("Instructor not found", 404))
        }
    
        if (course.instructorId.toString() !== instructorDoc._id.toString()) {
          return next(createError("You are not the instructor of this course", 403))
        }

        const quiz = await Quiz.findById(quizId)
        
        if (!quiz) {
          return next(createError("Quiz not found", 404))
        }

        const question = quiz.questions.find((q) => q._id.toString() === questionId)
        
        if (!question) {
          return next(createError("Question not found" , 404))
        }

        const schema = Joi.object({
            questionText: Joi.string().min(3).optional(),
            points: Joi.number().min(1).max(100).optional(),
            explanation: Joi.string().optional(),
            hint: Joi.string().optional(),
            options: Joi.array()
              .items(
                Joi.object({
                  optionText: Joi.string().required(),
                  isCorrect: Joi.boolean().required(),
                  feedback: Joi.string().optional(),
                })
              )
              .optional(),
          })

          const { error , value } = schema.validate(req.body, { abortEarly: false })

          if (error) {
            return next(createError(error.details.map((err) => err.message.replace(/"/g, "")).join(", ") , 400))
          }

          Object.assign(question, value)

          const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points , 0)
          
          if (totalPoints > maxScore || totalPoints !== maxScore) {
            return next(createError("Total points of all questions must equal the max score", 400))
          }

          const updatedQuiz = await quiz.save()

          res.status(200).json({
            message: "Question updated successfully",
            quiz: updatedQuiz,
          })

    } catch (error) {
      next(error)
    }

  }





module.exports = {
  createQuiz , 
  createQuizv2 ,
  addQuizQuestion ,
  createFillInTheBlankQuestion ,
  updateQuizSettings ,
  getCourseLastestQuizzes ,
  getQuizQuestions ,
  getInstructorQuizzes ,
  submitQuizAnswers ,
  getQuizSubmissionResult ,
  checkQuizSubmission ,
  submitAnswers , 
  getStudentResults , 
  getAllQuizzes , 
  getQuizDetails ,
  getAllInstructorQuizzes ,
  updateQuiz , 
  updateQuizQuestion ,
}