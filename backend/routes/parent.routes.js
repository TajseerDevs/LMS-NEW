const express = require("express")
const { protectRoutes } = require("../middlewares/auth")
const { getMyStudents, getSpecificStudentLog, getParentStudentsCourses, assignStudentsToParent } = require("../controllers/parent.controller")



const router = express.Router()


router.get("/students/get-all-students" , protectRoutes , getMyStudents)

router.get('/students/courses/:studentId' , protectRoutes , getParentStudentsCourses)

router.get('/students/:studentId/logs/:attachmentId' , protectRoutes , getSpecificStudentLog)

router.post("/assign-students" , protectRoutes , assignStudentsToParent)


module.exports = router