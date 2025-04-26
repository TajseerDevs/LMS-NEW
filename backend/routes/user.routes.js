const express = require("express");
const { protectRoutes } = require("../middlewares/auth")

const { 
    register, 
    login , 
    updateProfile , 
    getLoggedUser, 
    uploadProfileImg, 
    uploadDocuments, 
    uploadVoice, 
    forgotPassword, 
    resetPassword, 
    getAllUsers, 
    getSingleStudentUser,
    deleteProfileImg
} = require("../controllers/user.controller")



const router = express.Router()


router.post("/register" , register)

router.post("/login" , login)

router.patch("/update-profile" , protectRoutes , updateProfile) // only text inputs (without profile image)

router.get("/", protectRoutes, getLoggedUser)

router.patch("/upload-profile-pic" , protectRoutes , uploadProfileImg)

router.delete("/delete-profile-pic" , protectRoutes , deleteProfileImg)

router.post("/upload-documents" , protectRoutes , uploadDocuments) // to upload documents types in general for the student

router.post("/upload-voice" , protectRoutes , uploadVoice) // ! TODO convert it to mime type check

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.get("/all-users" , protectRoutes , getAllUsers)

router.get("/single-user/:userId" , protectRoutes , getSingleStudentUser)



module.exports = router