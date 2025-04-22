const express = require("express")

const { protectRoutes } = require("../middlewares/auth")

const {
     createCourse, 
     getAllInstructorCourses, 
     viewCourseStudents, 
     deleteCourse, 
     addSectionToCourse,
     addItemToSection,
     uploadScormFile,
     updateCourse,
     getInstructorContentTickets,
     getDeclineReason,
     uploadContentFile,
     getCourseStudentLogs,
     changeSectionPreview,
     getAllInstructorCoursesNoPaging,
     getInstructorInsights,
     getInstructorUngradedSubmissions,
     getRandomInstructorCourses,
     getRandomStudentsWithCompletion,
     getTwoRandomUngradedSubmissions,
     getCourseStudentDetails,
     getInstructorProfile
} = require("../controllers/instructor.controller")


const router = express.Router()


router.get('/profile' , protectRoutes , getInstructorProfile)

router.get('/insights' , protectRoutes , getInstructorInsights)

router.get('/assignments-submission/insights' , protectRoutes , getInstructorUngradedSubmissions)

router.get('/random-courses' , protectRoutes , getRandomInstructorCourses)

router.get('/random-students-completion' , protectRoutes , getRandomStudentsWithCompletion)

router.get("/random-ungraded-submissions" , protectRoutes , getTwoRandomUngradedSubmissions)


router.get('/course/:courseId/students/insights' , protectRoutes , getCourseStudentDetails)



router.post("/create-course" , protectRoutes , createCourse)

router.post("/update-course/:courseId" , protectRoutes , updateCourse)

router.get("/all-instructor-courses" , protectRoutes , getAllInstructorCourses)

router.get("/courses" , protectRoutes , getAllInstructorCoursesNoPaging)

router.get("/view-students/:courseId" , protectRoutes , viewCourseStudents) 

router.post("/add-course-section/:courseId" , protectRoutes , addSectionToCourse)

router.patch("/add-section-item/:courseId/:sectionId" , protectRoutes , addItemToSection)

router.patch("/change-section-preview/:courseId/:sectionId" , protectRoutes , changeSectionPreview)

router.delete("/delete-course/:courseId" , protectRoutes , deleteCourse)

router.patch("/upload-scorm/:courseId/:sectionId/:itemId" , protectRoutes , uploadScormFile)

router.patch("/upload-content/:courseId/:sectionId" , protectRoutes , uploadContentFile)

router.get("/tickets/content", protectRoutes , getInstructorContentTickets)

router.get("/course/decline-reason/:courseId", protectRoutes , getDeclineReason)

router.get("/course/students-logs/:courseId" , protectRoutes , getCourseStudentLogs)



module.exports = router

