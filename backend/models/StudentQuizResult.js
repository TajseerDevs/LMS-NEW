const mongoose = require('mongoose');


const studentQuizResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'quizzes',
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true, 
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'answers',
      required: true,
    },
  ],
} , {timestamps : true})




const StudentQuizResult = mongoose.model('studentQuizResults', studentQuizResultSchema)


module.exports = StudentQuizResult