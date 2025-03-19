const mongoose = require('mongoose')


const EnrollmentSchema = new mongoose.Schema({
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
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'canceled'],
    default: 'active',
  }
}, { timestamps: true });


const Enrollment = mongoose.model('enrollments' , EnrollmentSchema)


module.exports = Enrollment
