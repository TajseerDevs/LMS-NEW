const mongoose = require("mongoose");


const groupSchema = new mongoose.Schema(
  {
    name: { type: String , required: true , unique: true} , 
    picture: { type: String , default: null }, 
    description: { type: String , default: "" }, 
    members: [{ type: mongoose.Schema.Types.ObjectId , ref: "users" }],
    groupCreatorId:{ type: mongoose.Schema.Types.ObjectId , ref: "users" }, 
    conversation: { type: mongoose.Schema.Types.ObjectId , ref: "conversations" , required: true },
  },
  { timestamps: true }
)


const Group = mongoose.model("groups" , groupSchema)


module.exports = Group
