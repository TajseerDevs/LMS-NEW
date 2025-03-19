const mongoose = require('mongoose')
const Schema = mongoose.Schema


const attachmentSchema = new Schema({
  file_path: {
    type: String,
    required: true,
  },
  activityFileName: {
    type: String,
    required: true
  },
  launchUrl: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['Video', 'Image' , "Activity" , "Document"],
    required: true
  },
  trackingInfo: [{ type: mongoose.Schema.Types.ObjectId , ref: "trackings" }],
  scormLog : { type: mongoose.Schema.Types.ObjectId , ref: "Lesson" } ,
  courseId : { type: mongoose.Schema.Types.ObjectId , ref: "courses" } ,
  fileId : { type: mongoose.Schema.Types.ObjectId , ref: "files" } ,
  scormVersion : {
    type: String,
    enum: ['1.2', "2004"],
  },

} , {timestamps : true})


const Attachment = mongoose.model('attachments', attachmentSchema)


module.exports = {attachmentSchema , Attachment}