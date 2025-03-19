const express = require("express")

const { protectRoutes } = require("../middlewares/auth")
const { sendMessage , markMessageAsRead, getAllMessages, getAllPrevMessages } = require("../controllers/message.controller")




const router = express.Router()


router.post("/" , protectRoutes , sendMessage)

router.get("/mark-as-read/:messageId" , protectRoutes , markMessageAsRead)

router.get("/all-messages/:conversationId" , protectRoutes , getAllMessages)

router.get("/prev-messages/:conversationId/:messageId" , protectRoutes , getAllPrevMessages)




module.exports = router