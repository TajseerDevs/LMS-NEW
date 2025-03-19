const mongoose = require("mongoose");


const AnswerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true }, // student doc object _id
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "questions", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quizzes", required: true },
  answerText: { type: String, required: true }, 
  isCorrect: { type: Boolean, required: true }, 
  feedback: { type: String }, 
  pointsAwarded: { type: Number, default: 0 },
}, { timestamps: true })


const Answer = mongoose.model("answers", AnswerSchema)


module.exports = Answer
