const mongoose = require("mongoose")


const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignments",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    submissionFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "files",
      required: true,
    },
    marks: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    answerText: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)


const Submission = mongoose.model("submissions" , submissionSchema)


module.exports = Submission
