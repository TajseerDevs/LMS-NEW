const express = require("express")
const path = require("path")

const { setScormLogs , getScormLogs, getUserAttachmentLogs, getAllUserLogs, getUserSpecificScormLog, getStudentCourseLogs } = require("../controllers/scorm.controller")
const { protectRoutes } = require("../middlewares/auth")


const router = express.Router()



// TODO ADD THE AUTH CASE FOR THIS ROUTE , STILL NEEDS SOME UPDATE
router.post("/:userId/:attachmentId/set-log" , setScormLogs)


router.get("/:userId/:attachmentId/get-log" , protectRoutes , getScormLogs)


router.get("/all/logs"  , protectRoutes , getAllUserLogs)


router.get("/all/student/logs/:studentId/:courseId"  , protectRoutes , getStudentCourseLogs)


router.get("/logs/:attachmentId"  , protectRoutes , getUserAttachmentLogs)


router.get("/:userId/:courseId/:sectionId/:itemId/:attachmentId/log" , protectRoutes , getUserSpecificScormLog)
  


module.exports = router
