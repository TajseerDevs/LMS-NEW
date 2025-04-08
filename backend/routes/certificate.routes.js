const express = require("express")
const { protectRoutes } = require("../middlewares/auth")
const { generateCertificate, getMyCertificates } = require("../controllers/certificate.controller")


const router = express.Router()


router.post("/generate-certificate/:courseId" , protectRoutes , generateCertificate)

router.get("/my-certificates" , protectRoutes , getMyCertificates)


module.exports = router
