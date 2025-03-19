const mongoose = require("mongoose")


const CertificateSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructors",
      required: true,
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    status: {
      type: String,
      enum: ["issued", "pending"],
      default: "pending",
    },
    certificateURL: {
      type: String,
      required: false, // This can store a link to the generated certificate (e.g., PDF or image)
    },
}, { timestamps: true })
  


const Certificate = mongoose.model("certificates", CertificateSchema)  


module.exports = Certificate 
  