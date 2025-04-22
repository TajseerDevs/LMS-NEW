const express = require("express")
const { protectRoutes } = require("../middlewares/auth")

const { 
    createAssignment , 
    submitAssignmentSubmission , 
    viewStudentSubmission , 
    addMarksToSubmission,
    updateAssignmentSubmission,
    deleteSubmissionFile,
    getAllStudentsSubmissions,
    getAssignmentDetails,
    getInstructorAssigments,
    getStudentAssigmentsSubmissions,
    getCourseLatestAssignments,
    getAssignmentSubmission,
    updateSubmission,
    checkAssignmentDueDate,
    getAllStudentAssignmentsSubmissions
} = require("../controllers/assignment.controller")


const router = express.Router()


router.get("/course/:courseId/latest" , protectRoutes , getCourseLatestAssignments)

router.get("/instructor" , protectRoutes , getInstructorAssigments)

router.post("/:courseId" , protectRoutes , createAssignment)

router.get("/check-due-date/:assignmentId" , protectRoutes , checkAssignmentDueDate)

router.get("/:courseId/student/:userId" , protectRoutes , getStudentAssigmentsSubmissions)

router.post("/:courseId/:assignmentId/submit" , protectRoutes , submitAssignmentSubmission)

router.put('/update-submission/:assignmentId/:submissionId' , protectRoutes , updateSubmission) // for the student

router.get("/submission/:assignmentId" , protectRoutes , getAssignmentSubmission) // for the student

router.get("/:assignmentId/submission/:userId" , protectRoutes , viewStudentSubmission) // for the instructor

router.get("/:assignmentId" , protectRoutes , getAssignmentDetails)

router.patch("/:assignmentId/submissions/:userId/marks" , protectRoutes , addMarksToSubmission)




router.put("/:courseId/:assignmentId/update" , protectRoutes , updateAssignmentSubmission)



router.delete("/:assignmentId/delete" , protectRoutes , deleteSubmissionFile)

router.get("/:assignmentId/submissions" , protectRoutes , getAllStudentsSubmissions)

router.get("/student-assignments/:courseId/submissions/:userId" , protectRoutes , getAllStudentAssignmentsSubmissions)



module.exports = router