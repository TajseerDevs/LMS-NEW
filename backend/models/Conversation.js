const mongoose = require("mongoose")


const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    isGroup: {
      type: Boolean,
      default: false,
    },
    readBy: [String],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages" 
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "groups", default: null },
  },
  { timestamps: true }
)


const Conversation = mongoose.model("conversations" , conversationSchema)


module.exports = Conversation



// version 2
// const conversationSchema = new mongoose.Schema(
//   {
//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
//     isGroup: {
//       type: Boolean,
//       default: false,
//     },
//     messages: [{type: mongoose.Schema.Types.ObjectId, ref: "messages"}],
//     group: { type: mongoose.Schema.Types.ObjectId, ref: "groups", default: null },
//   },
//   { timestamps: true }
// )