const mongoose = require("mongoose");



const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["true_false" , "multiple_choice" , "match" , "drag_drop" , "fill_in_blank"] ,
    required: true,
  },
  questionText: { type: String, required: true },
  points: { type: Number, default: 1 }, 
  explanation: { type: String, required: false, default: "" },
  hint: { type: String }, 
  options: [
    {
      optionText: { type: String, required: true }, 
      matchWith: { type: String, default: "" },
      isCorrect: { type: Boolean, required: true }, 
      feedback: { type: String, required: false, default: "" }, 
    },
  ],
  }, { timestamps: true })
  
  

  


const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: false },
  courseId: { type : mongoose.Schema.Types.ObjectId, ref: "courses", required: true },
  instructorId: { type : mongoose.Schema.Types.ObjectId, ref: "instructors", required: true },
  quizType: {
    type: String,
    enum: ["true_false" , "multiple_choice" , "match" , "drag_drop" , "fill_in_blank" , "mixed"],
    required: true,
    default: "mixed",
  },
  questions: [QuestionSchema],
  duration: {
    value: { type: Number, required: false },
    unit: { type: String, enum: ["minutes", "hours"], default: "minutes" }
  },
  maxScore: { type : Number , required: false },
  passScore: { type : Number , required: false },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "answers" }],
  submittedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }],
  dueDate: {
    type: Date,
    required: false,
  },
  shuffledQuestions : {type : Boolean , default : false},
  isOneWay : {type : Boolean , default : false},
  }, { timestamps: true })
 
  


  // mongoose pre save hook to calculate the maxScore each time before we save the quiz document object   
  QuizSchema.pre("save", function (next) {
    this.maxScore = this.questions.reduce((total, question) => total + (question.points || 1) , 0)
    next()
  })
  


  const Quiz = mongoose.model("quizzes" , QuizSchema)



  module.exports = Quiz
  