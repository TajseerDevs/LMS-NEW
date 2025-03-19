const mongoose = require('mongoose')


const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'quizzes',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  passScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: String,
    required: true
  },
  passStatus: {
    type: Boolean,
    required: true
  },
  correctAnswersCount: {
    type: Number,
    required: true
  },
  partiallyCorrectAnswersCount: {
    type: Number,
    required: true
  },
  incorrectAnswersCount: {
    type: Number,
    required: true
  },
  spentTime: {
    type: String,
    required: true
  },
}, {
  timestamps: true 
});


const QuizResult = mongoose.model('QuizResult', quizResultSchema)


module.exports = QuizResult
