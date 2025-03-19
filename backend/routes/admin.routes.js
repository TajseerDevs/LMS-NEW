const express = require("express");
const { protectRoutes , adminAuth } = require("../middlewares/auth");

const { 
    updateEnrolmentStatus , 
    getAllEnrolmentsRequestsForAdmin , 
    getAllUsersByAdmin, 
    getSingleUser,
    createNewUser,
    updateUser,
    deleteUser,
    changeRole,
    getAllUserLogs,
    getSingleUserLog,
    changeCourseInstructor,
    getFilteredCourses,
    getAllInstructors,
    getInstructorCourses,
    getStudentsInCourse,
    getAllTickets,
    changeTicketStatus,
    supportTeamResponse,
    getFilteredTickets,
    deleteTicket,
    acceptInstructorRegistration,
    getAllTechnicalTickets,
    importStudentsFromExcel,
    createAndAssignCourse,
    approveOrDeclineCourse,
    getAllInstructorsUsers,
    getAllCoursesWithInstructors,
    declineReason,
    getAllCoursesByAdmin,
    getArchivedTickets,
    getSummary,
    getTicketsSummary,
    getUsersWithCoursesAndLogs,
    getCoursesForUser,
    getUsersPerMonth,
    getCoursesPerMonth,
    getStudentsWith100PercentCompletion,
    getSectionViewCount,
    getAttachmentViewCount,
    getInstructorCoursesPerMonth,
    getDailySales,
    getMonthlySales
} = require("../controllers/admin.controller")


const router = express.Router()


// ADMIN STUDENTS ROUTES
router.patch("/student/update-enrolment-status/:courseId/:studentId" , protectRoutes , adminAuth , updateEnrolmentStatus)

router.get("/student/all-enrolments" , protectRoutes , adminAuth , getAllEnrolmentsRequestsForAdmin)



// TODO UPDATE ALL ROUTES THAT CONTAIN USER DOC OBJECT
// ADMIN USER ROUTES
router.get("/user/get-all" , protectRoutes , adminAuth , getAllUsersByAdmin) 

router.get("/user/single-user/:userId" , protectRoutes , adminAuth , getSingleUser)

router.post("/user/create-user" , protectRoutes , adminAuth , createNewUser)

router.post("/user/import-students", protectRoutes , adminAuth , importStudentsFromExcel)

router.put("/user/update-user/:userId" , protectRoutes , adminAuth , updateUser)

router.delete("/user/delete-user/:userId" , protectRoutes , adminAuth , deleteUser)

router.put("/user/update-user-role/:userId" , protectRoutes , adminAuth , changeRole)

router.get("/user/all-logs/:userId" , protectRoutes , adminAuth , getAllUserLogs)

router.get("/user/single-log/:userId/:attachmentId" , protectRoutes , adminAuth , getSingleUserLog)



// ADMIN COURSE ROUTES
router.patch("/course/change-course-instructor/:courseId" , protectRoutes , adminAuth , changeCourseInstructor)

router.get("/course/get-all" , protectRoutes , adminAuth , getAllCoursesByAdmin) 

router.get("/course/filtered-courses" , protectRoutes , adminAuth , getFilteredCourses)

router.get("/course", protectRoutes, adminAuth , getAllCoursesWithInstructors)

router.patch("/course/:courseId/approve-or-decline" , protectRoutes , adminAuth , approveOrDeclineCourse)

router.patch("/course/:courseId/decline-reason" , protectRoutes , adminAuth , declineReason)



// ADMIN INSTRUCTOR ROUTES
router.get("/instructor" , protectRoutes , adminAuth , getAllInstructors)

router.get("/instructor/all-users" , protectRoutes , adminAuth , getAllInstructorsUsers)

router.patch("/instructor/accept-registration/:instructorId" , protectRoutes , adminAuth , acceptInstructorRegistration)

router.get("/instructor/:instructorId/courses" , protectRoutes , adminAuth , getInstructorCourses)

router.get("/instructor/:instructorId/courses/:courseId" , protectRoutes , adminAuth , getStudentsInCourse)

router.post("/instructor/create-and-assign" , protectRoutes , adminAuth , createAndAssignCourse)



// ADMIN TICKETS ROUTES
router.get("/tickets" , protectRoutes , adminAuth , getAllTickets)

router.patch("/tickets/:ticketId" , protectRoutes , adminAuth , changeTicketStatus)

router.post("/tickets/:ticketId/support" , protectRoutes , adminAuth , supportTeamResponse)

router.get("/tickets/filtered" , protectRoutes , adminAuth , getFilteredTickets)

router.delete("/tickets/:ticketId", protectRoutes, adminAuth , deleteTicket)

router.get("/tickets/technical", protectRoutes, adminAuth, getAllTechnicalTickets)

router.get("/tickets/archived", protectRoutes, adminAuth, getArchivedTickets)



// summary routes
router.get("/data/summary" , protectRoutes , adminAuth , getSummary)

router.get("/data/tickets/summary" , protectRoutes , adminAuth , getTicketsSummary)

router.get("/data/users-per-month" , protectRoutes , adminAuth , getUsersPerMonth)

router.get("/data/courses-per-month" , protectRoutes , adminAuth , getCoursesPerMonth)

router.get("/data/students-full-completion" , protectRoutes , adminAuth , getStudentsWith100PercentCompletion)

router.get('/data/:courseId/sections/:sectionId/section/views/count' , protectRoutes , adminAuth , getSectionViewCount)

router.get('/data/:courseId/sections/:sectionId/item/:itemId/attachment/:attachmentId/attachment/views/count' , protectRoutes , adminAuth , getAttachmentViewCount)

router.get("/data/instructors/courses-per-month" , protectRoutes , adminAuth , getInstructorCoursesPerMonth)

router.get("/data/sales/daily", protectRoutes , adminAuth , getDailySales)

router.get("/data/sales/monthly", protectRoutes , adminAuth , getMonthlySales)



// scorm routes
router.get('/scorm/courses-logs' , protectRoutes , adminAuth , getUsersWithCoursesAndLogs)

router.get('/scorm/user-courses/:userId' , protectRoutes , adminAuth , getCoursesForUser)



module.exports = router
