const express = require("express")

const { protectRoutes } = require("../middlewares/auth")

const { 
    getAllStudentCourses, 
    courseEnrolRequest, 
    getMyEnrolmentRequests, 
    checkEnrollmentStatus, 
    addCourseRating,
    getCourseCompletionPercentage,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    getAvgLessonsProgress,
    getWeakAreas,
    assignAdaptiveContent,
    getBookMarks,
    addToBookMark,
    removeFromBookMark,
    generateCertificate,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleActiveFlag,
    getAllReminders,
    addNote,
    getAllNotesForCourse,
    getNotesForItem,
    updateNote,
    deleteNote,
    exportPdfNotes,
    getAllCoursesCompletionPercentage,
    getAllStudentsCourseCompletionPercentage,
    setCourseLastProgress,
    getCourseLastProgress,
    addFeedback,
    getCourseFeedbacks,
    deleteCourseFeedback,
    calculateStudentAttendance,
    getStudentProgress,
    enrollFreeCourse,
    checkFeedbackStatus,
    getStudentEnrolledCourses
} = require("../controllers/student.controller")


const { listCategoriesWithCourses , getCategoriesTypes , getCoursesLearningCategories } = require("../controllers/course.controller")



const router = express.Router()


router.get("/" , protectRoutes , getAllStudentCourses)

router.get("/enrolled-courses" , protectRoutes , getStudentEnrolledCourses)

router.post('/enroll-free/:courseId' , protectRoutes , enrollFreeCourse)

router.post("/enroll/:courseId", protectRoutes , courseEnrolRequest)

router.get("/enrolment-requests" , protectRoutes , getMyEnrolmentRequests)

router.get("/check-enrollment/:courseId" , protectRoutes , checkEnrollmentStatus)

router.post("/rate/:courseId" , protectRoutes , addCourseRating) 

router.get("/course-completion-percentage/:courseId" , protectRoutes , getCourseCompletionPercentage)

router.get("/courses-completion-percentage" , protectRoutes , getAllCoursesCompletionPercentage)

router.get("/course-students-completion-percentage/:courseId" , protectRoutes , getAllStudentsCourseCompletionPercentage)

router.post("/add-whishlist/:courseId" , protectRoutes , addToWishlist)

router.patch("/remove-whishlist/:courseId" , protectRoutes , removeFromWishlist)

router.get("/whishlist" , protectRoutes , getWishlist)

router.get("/avg-lessons-progress" , protectRoutes , getAvgLessonsProgress)

router.get("/weak-areas" , protectRoutes , getWeakAreas)

router.get("/adaptive-content/assign/:userId/:lessonId" , protectRoutes , assignAdaptiveContent)

router.get("/list-courses-by-categories" , protectRoutes , listCategoriesWithCourses) 

router.get("/categories-types" , protectRoutes , getCategoriesTypes)

router.get('/learning-category' , protectRoutes , getCoursesLearningCategories)



router.post("/add-bookmark/:courseId" , protectRoutes , addToBookMark)

router.patch("/remove-bookmark/:courseId" , protectRoutes , removeFromBookMark)

router.get("/bookmarks" , protectRoutes , getBookMarks)



router.post('/generate-certificate/:courseId' , protectRoutes , generateCertificate)



router.post('/reminders' , protectRoutes , addReminder)

router.get('/reminders' , protectRoutes , getAllReminders)

router.put('/reminders/:reminderId' , protectRoutes , updateReminder)

router.patch('/reminders/:reminderId/toggle-active' , protectRoutes , toggleActiveFlag)

router.delete('/reminders/:reminderId' , protectRoutes , deleteReminder)



router.post("/notes/:courseId/sections/:sectionId/items/:itemId" , protectRoutes , addNote)

router.get("/notes/:courseId" , protectRoutes , getAllNotesForCourse)

router.get("/notes/:courseId/sections/:sectionId/items/:itemId" , protectRoutes , getNotesForItem)

router.put("/notes/:courseId/sections/:sectionId/items/:itemId/notes/:noteId" , protectRoutes , updateNote)

router.delete("/notes/:courseId/sections/:sectionId/items/:itemId/notes/:noteId" , protectRoutes , deleteNote)

router.get("/notes/export-pdf/:courseId" , protectRoutes , exportPdfNotes)


router.post("/set-last-progress" , protectRoutes , setCourseLastProgress)

router.get("/course-last-progress/:courseId" , protectRoutes , getCourseLastProgress)


router.post("/:courseId/feedback" , protectRoutes , addFeedback)

router.get("/:courseId/feedbacks" , protectRoutes , getCourseFeedbacks)

router.delete("/:courseId/feedbacks/:feedbackId" , protectRoutes , deleteCourseFeedback)

router.get("/attendance-avg" , protectRoutes , calculateStudentAttendance)

router.get("/courses-progress" , protectRoutes , getStudentProgress)

router.get("/course/check-feedback-status/:courseId" , protectRoutes , checkFeedbackStatus)
    


module.exports = router


