const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: [true, "Course ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId , 
    required: false, 
  },
  sectionName: {
    type: String,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: [true, "Student ID is required"], 
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
    required: [true, "instructor ID is required"], 
  },
  instructorUserDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "instructor user ID is required"], 
  },
  questionOwnerName : {
    type: String,
    required: [true, "Question owner name is required"], 
  },
  question: {
    type: String,
    required: [true, "Question text is required"], 
    minlength: [5, "Question must be at least 10 characters"], 
    maxlength: [500, "Question can't be longer than 500 characters"], 
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "files",
    required: false, 
  },
  answers: [
    {
      instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructors",
        required: false,
      },
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: false,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
      answer: {
        type: String,
        required: [true, "Answer text is required"], 
        minlength: [2, "Answer must be at least 5 characters"], 
        maxlength: [500, "Answer can't be longer than 500 characters"], 
      },
      answerOwnerName : {
        type: String,
        required: [true, "answer owner name is required"], 
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



QuestionSchema.path('answers').validate(function(value) {
    return value.every(answer => answer.studentId && answer.instructorId);
  }, "Each answer must have both a studentId and an instructorId");
  


const Question = mongoose.model("questions", QuestionSchema)



module.exports = Question
