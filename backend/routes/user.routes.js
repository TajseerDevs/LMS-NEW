const express = require("express");
const { register, login , updateProfile , getLoggedUser, uploadProfileImg, uploadDocuments, uploadVoice, forgotPassword, resetPassword, newRegister, getAllUsers} = require("../controllers/user.controller");
const { protectRoutes } = require("../middlewares/auth");


const router = express.Router();


router.post("/register" , register)

router.post("/login" , login)

router.patch("/update-profile" , protectRoutes , updateProfile)

router.get("/", protectRoutes, getLoggedUser)

router.patch("/upload-profile-pic" , protectRoutes , uploadProfileImg)

router.post("/upload-documents" , protectRoutes , uploadDocuments)

router.post("/upload-voice" , protectRoutes , uploadVoice)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.get("/all-users" , protectRoutes , getAllUsers)



module.exports = router;