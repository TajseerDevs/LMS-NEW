const express = require("express")
const { protectRoutes } = require("../middlewares/auth")

const { 
    createQuiz , 
    submitAnswers ,
    getAllQuizzes, 
    updateQuiz, 
    updateQuizQuestion , 
    getStudentResults, 
    getAllInstructorQuizzes,
    createQuizv2,
    addQuizQuestion,
    getQuizQuestions,
    createFillInTheBlankQuestion,
    updateQuizSettings,
    getInstructorQuizzes,
    getCourseLastestQuizzes,
    getQuizDetails,
    submitQuizAnswers,
    getQuizSubmissionResult,
    checkQuizSubmission
} = require("../controllers/quiz.controller")



const router = express.Router()


// router.post("/create-quiz/:courseId" , protectRoutes , createQuiz)

router.post("/create-quiz/:courseId" , protectRoutes , createQuizv2)

router.patch("/add-quiz-question/:courseId/:quizId" , protectRoutes , addQuizQuestion)

router.patch("/add-quiz-question/fill-in-blank/:courseId/:quizId" , protectRoutes , createFillInTheBlankQuestion)

router.patch("/settings/:courseId/:quizId" , protectRoutes , updateQuizSettings)

router.get("/course/:courseId/quizzes-latest" , protectRoutes , getCourseLastestQuizzes)

router.get("/:quizId/details" , protectRoutes , getQuizDetails)

router.get('/:quizId/:courseId/questions' , protectRoutes , getQuizQuestions)

router.get("/instructor/quizzes" , protectRoutes , getInstructorQuizzes)
 
router.post("/submit-answers/:quizId" , protectRoutes , submitQuizAnswers)

router.get("/submission-result/:quizId" , protectRoutes , getQuizSubmissionResult)

router.get('/:quizId/check-submission' , protectRoutes , checkQuizSubmission)





router.get("/results" , protectRoutes , getStudentResults)

router.get('/course/quizzes/:courseId' , protectRoutes ,  getAllQuizzes)

router.get('/instructor/quizzes' , protectRoutes , getAllInstructorQuizzes)

router.put('/course/:courseId/quizzes/:quizId' , protectRoutes , updateQuiz)

router.put('/course/:courseId/quizzes/:quizId/questions/:questionId' , protectRoutes , updateQuizQuestion)




module.exports = router