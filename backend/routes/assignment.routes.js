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
    getCourseLatestAssignments
} = require("../controllers/assignment.controller")


const router = express.Router()


router.get("/course/:courseId/latest" , protectRoutes , getCourseLatestAssignments)

router.get("/instructor" , protectRoutes , getInstructorAssigments)

router.post("/:courseId" , protectRoutes , createAssignment)

router.get("/:courseId/student/:userId" , protectRoutes , getStudentAssigmentsSubmissions)

router.post("/:courseId/:assignmentId/submit" , protectRoutes , submitAssignmentSubmission)     

router.put("/:courseId/:assignmentId/update" , protectRoutes , updateAssignmentSubmission)

router.get("/:assignmentId/submission/:userId" , protectRoutes , viewStudentSubmission)

router.patch("/:assignmentId/submissions/:userId/marks" , protectRoutes , addMarksToSubmission)

router.delete("/:assignmentId/delete" , protectRoutes , deleteSubmissionFile)

router.get("/:assignmentId/submissions" , protectRoutes , getAllStudentsSubmissions)

router.get("/:assignmentId" , protectRoutes , getAssignmentDetails)



module.exports = router