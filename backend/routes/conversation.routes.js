const express = require("express")

const { protectRoutes } = require("../middlewares/auth")
const { createConversation, getUserConversations, markMessagesAsReadInConversation, getUserConversation } = require("../controllers/conversation.controller")



const router = express.Router()


router.post("/" , protectRoutes , createConversation)

router.get("/" , protectRoutes , getUserConversations)

router.get("/:conversationId" , protectRoutes , getUserConversation)

router.get("/mark-conversation-as-read/:conversationId" , protectRoutes , markMessagesAsReadInConversation)





module.exports = router