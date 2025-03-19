const Joi = require("joi")
const createError = require("../utils/createError")
const Conversation = require("../models/Conversation")
const File = require("../models/File")
const User = require("../models/User")
const Message = require("../models/Message")
const Group = require("../models/Group")
const path = require("path")
const fs = require("fs")




const createConversation = async (req , res , next) => {

    try {
        
        const { senderId , receiverId } = req.body

        const existingConversation = await Conversation.findOne({
            members: { $all : [senderId , receiverId]} ,
            isGroup : false
        })

        if(existingConversation){
            return next(createError("Chat already exist" , 400))
        }
        
        const conversation = new Conversation({
            members: [senderId , receiverId],
        })
        
        await conversation.save()

        res.status(201).json(conversation)

    } catch (error) {
        next(error)
    }

}




const getUserConversations = async (req, res, next) => {

    try {

        const userConversations = await Conversation.find({
            members: req.user._id,
        }).select("members readBy isGroup").populate("members lastMessage")

        res.status(200).json(userConversations)

    } catch (error) {
        next(error)
    }

}




const getUserConversation = async (req, res, next) => {

    try {

        const conversation = await Conversation.findById(req.params.conversationId)

        if (!conversation) {
            return next(createError("Conversation not found", 404))
        }

        if (conversation.isGroup) {

            const group = await Group.findOne({ conversation : conversation._id })

            if (!group) {
                return next(createError("Group not found", 404))
            }

            const messages = await Message.find({ conversationId: conversation._id })

            const userId = req.user._id

            for (let message of messages) {
                if (!message.readBy.includes(userId)) {
                    message.readBy.push(userId)
                    await message.save()
                }
            }

            return res.status(200).json({group , conversation}) 

        } else {

            const messages = await Message.find({ conversationId: conversation._id })

            const userId = req.user._id

            for (let message of messages) {
                if (!message.readBy.includes(userId)) {
                    message.readBy.push(userId)
                    await message.save()
                }
            }

            return res.status(200).json(conversation) 
        }

    } catch (error) {
        next(error)
    }

}




const markMessagesAsReadInConversation = async (req, res, next) => {

    try {

        const { conversationId } = req.params
        const userId = req.user._id

        const messages = await Message.find({
            conversationId,
            readBy: { $ne: userId }
        })

        const updatePromises = messages.map((message) => {
            if (!message.readBy.includes(userId)) {
                message.readBy.push(userId)
                return message.save()
            }
        })

        await Promise.all(updatePromises)

        res.status(200).json({ message: "All messages marked as read" })

    } catch (error) {
        next(error)
    }

}





module.exports = {
    createConversation , 
    getUserConversations ,
    getUserConversation , 
    markMessagesAsReadInConversation
}