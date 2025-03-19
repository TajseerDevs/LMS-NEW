const Joi = require("joi")
const createError = require("../utils/createError")
const File = require("../models/File")
const User = require("../models/User")
const path = require("path")
const fs = require("fs")
const Conversation = require("../models/Conversation")
const Message = require("../models/Message")
const Group = require("../models/Group")




const sendMessage = async (req , res , next) => {

    try {
        
        const { sender , text , conversationId } = req.body

        let uploadedFile = null

        if (!sender || text === undefined || !conversationId) {
            return next(createError("Invalid message credentials"))
        }

        const conversation = await Conversation.findById(conversationId)

        if (!conversation) {
          return next(createError("Conversation not found" , 404))
        }

        if (conversation.isGroup) {

            const group = await Group.findById(conversation.group)

            if (!group || !group.members.includes(sender)) {
              return next(createError("You are not a member of this group" , 403))
            }

          }

          if (req.files && req.files.file) {

            const file = req.files.file

            const uploadDir = path.join(__dirname, "../uploads/messages_files")

            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true })
            }      

            const uniqueName = `${Date.now()}_${file.name}`
            const filePath = path.join(uploadDir , uniqueName)

            await file.mv(filePath)

            uploadedFile = await File.create({
                originalName: file.name,
                uniqueName,
                filePath: `/uploads/messages_files/${uniqueName}`,
                fileType: file.mimetype,
                fileSize: file.size,
                user: sender,
            })

        }

        const message = new Message({
            conversationId,
            sender,
            text,
            file: uploadedFile?._id || null ,
            readBy: [sender],
        })

        await message.save()

        if (!conversation.readBy.includes(sender)) {
            conversation.readBy.push(sender)
        }

        conversation.lastMessage = message

        await conversation.save()
    
        res.status(201).json(message)

    } catch (error) {
        next(error)
    }

}




const markMessageAsRead = async (req, res, next) => {

    try {

        const { messageId } = req.params

        const userId = req.user._id

        const message = await Message.findById(messageId)

        if (!message) {
            return next(createError("Message not found", 404))
        }

        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId)
            await message.save()
        }

        res.status(200).json({ message: "Message marked as read", updatedMessage: message })

    } catch (error) {
        next(error)
    }

}




// ! todo add the pagging feature to get the 10 messages before the top current message
const getAllMessages = async (req, res, next) => {

    try {

        const { conversationId } = req.params
        const limit = 10 

        const conversation = await Conversation.findById(conversationId)

        if (!conversation) {
            return next(createError("Conversation not found", 404))
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(limit)             
            .populate("sender", "name email profilePic") 
            .populate("file")

        res.status(200).json({ 
            messages : messages.reverse() ,  
            hasMore: messages.length === limit,
        })

    } catch (error) {
        next(error)
    }
}



const getAllPrevMessages = async (req, res, next) => {

    try {
    
      const { conversationId, messageId } = req.params
  
      const conversation = await Conversation.findById(conversationId)
  
      if (!conversation) {
        return next(createError("Conversation not found", 404))
      }
  
      let messagesBefore = []
      let messagesAfter = []
      let currentMessage = null
  
      if (messageId) {

        const message = await Message.findById(messageId)
  
        if (!message) {
          return next(createError("Message not found" , 404))
        }
  
        messagesBefore = await Message.find({
          conversationId: conversationId,
          createdAt: { $lt: message.createdAt },
        })
        .sort({ createdAt: -1 }) 
        .limit(10) 
        .populate("sender" , "name email profilePic")
        .populate("file")
  
        currentMessage = await Message.findById(messageId)
        .populate("sender" , "name email profilePic")
        .populate("file")
  
        messagesAfter = await Message.find({
          conversationId: conversationId,
          createdAt: { $gt: message.createdAt }, 
        })
        .sort({ createdAt : 1 }) 
        .populate("sender", "name email profilePic")
        .populate("file");
     
    }
  
      res.status(200).json({
        messages : [...messagesBefore.reverse() , currentMessage , ...messagesAfter] ,
        hasMoreBefore : messagesBefore.length === 10 , 
        hasMoreAfter : messagesAfter.length > 0 , 
      })

    } catch (error) {
      next(error)
    }

  }
  
  
  



module.exports = {
    sendMessage , 
    markMessageAsRead , 
    getAllMessages , 
    getAllPrevMessages
}