const express = require("express")
const { protectRoutes } = require("../middlewares/auth")

const { 
    getAllCourses, 
    getCourseById , 
    getItemAttachment, 
    modifyCourseSection, 
    modifyItemInSection,
    deleteCourseSection,
    removeItemFromSection,
    deleteAttachment,
    startItemActivity,
    changeSectionName,
    changeItemName,
    suggestTopCourses,
    searchCoursesByTitle,
    searchCoursesByInstructor,
    searchCoursesByTags,
    addFaqQuestion,
    replyFaqAnswer,
    getCourseQuestions,
    incrementSectionView,
    incrementAttachmentView,
    getNotEnrolledCourses,
    searchCoursesByDuration,
    suggestTopRatedCourses,
    suggestMostEnrolledCourses,
    getCourseByCategory,
    getNewestCourses,
    getTotalCoursesCount,
    getRandomFeedbacks,
    getCoursesLearningCategories,
} = require("../controllers/course.controller")


const router = express.Router()


router.get("/" , protectRoutes , getAllCourses)

router.get("/not-enrolled" , protectRoutes , getNotEnrolledCourses)
  
router.get("/suggest-top-courses" , protectRoutes , suggestTopCourses)

router.get("/:courseId" , protectRoutes , getCourseById)

router.get("/download/:attachmentId" , protectRoutes , startItemActivity)

router.get("/item-attachment/:attachmentId" , protectRoutes , getItemAttachment)

router.patch("/modify-course-section/:courseId/:sectionId", protectRoutes , modifyCourseSection)

router.delete("/delete-course-section/:courseId/:sectionId" , protectRoutes , deleteCourseSection)

router.patch('/modify-section-item/:courseId/sections/:sectionId/items/:itemId', protectRoutes , modifyItemInSection)

router.delete('/remove-section-item/:courseId/sections/:sectionId/items/:itemId', protectRoutes , removeItemFromSection)

router.delete('/delete-attachment/:courseId/sections/:sectionId/items/:itemId/attachments/:attachmentId', protectRoutes  , deleteAttachment)

router.put('/:courseId/sections/:sectionId', protectRoutes ,  changeSectionName)

router.put('/:courseId/sections/:sectionId/items/:itemId' , protectRoutes , changeItemName)


router.get("/search-courses/by-instructor" , protectRoutes , searchCoursesByInstructor)

router.get("/search-courses/by-tags" , protectRoutes , searchCoursesByTags)

router.get("/search-courses/by-duration" , protectRoutes , searchCoursesByDuration)

router.post("/add-faq-course" , protectRoutes , addFaqQuestion)

router.patch("/reply-faq-answer" , protectRoutes , replyFaqAnswer)

router.get("/faq/:courseId/questions" , protectRoutes , getCourseQuestions)

router.post('/section-view/:courseId/sections/:sectionId/view' , protectRoutes , incrementSectionView)

router.post('/item-view/:courseId/sections/:sectionId/:attachmentId/view' , protectRoutes , incrementAttachmentView)



// NEEDS TEST , MOVE THEM FROM HERE

router.get("/search-courses/by-title" , protectRoutes ,  searchCoursesByTitle)

router.get("/suggest-top-rated-courses" , protectRoutes ,  suggestTopRatedCourses)

router.get("/suggest-most-enrolled-courses" , protectRoutes ,  suggestMostEnrolledCourses)

router.get('/:category' , protectRoutes , getCourseByCategory)

router.get('/newest' , protectRoutes , getNewestCourses)

router.get('/count' , protectRoutes , getTotalCoursesCount)

router.get('/random-feedbacks' , protectRoutes , getRandomFeedbacks)





module.exports = router
