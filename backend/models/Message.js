const mongoose = require("mongoose")



const MessageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId , 
        ref: "conversations" , 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId , 
        ref: "users" , 
        required: true 
    },
    text: { 
        type: String , 
        default: "" 
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "files"
    },
    isRead: { type: Boolean, default: false },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  }, { timestamps: true })
  

  const Message = mongoose.model("messages" , MessageSchema)


  module.exports = Message

  

// version 2
//   const MessageSchema = new mongoose.Schema({
//     text: { 
//         type: String , 
//         default: "" 
//     },
//     file: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "files"
//     },
//     isRead: { type: Boolean, default: false },
//   }, { timestamps: true })


  