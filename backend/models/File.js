const mongoose = require("mongoose")


const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  uniqueName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  user: {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "users" ,
    required : true
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
} , {timestamps : true})


const File = mongoose.model("files" , fileSchema)


module.exports = File
