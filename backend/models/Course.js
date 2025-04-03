const mongoose = require("mongoose")
const { Attachment , attachmentSchema } = require("./Attachment")



const ItemSchema = new mongoose.Schema({
  type: String,
  name: String,
  viewCount: { type: Number, default: 0 },
  views: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  attachments: [attachmentSchema],
  estimatedTime: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 }
  }
} , {timestamps : true});



ItemSchema.path('views').default(function () {
  return []
})


const SectionSchema = new mongoose.Schema({
  name: String,
  viewCount: { type: Number, default: 0 },
  views: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  items: [ItemSchema],
  isPreviewed : {type : Boolean , default : true}
} , {timestamps : true});



SectionSchema.path('views').default(function () {
  return []
})



const RatingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating cannot exceed 10"],
  },
})




const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId ,
    ref: "students" ,
    required: true ,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId ,
    ref: "users" ,
    required: true ,
  },
  text: {
    type: String,
    required: true,
  },
})





const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description : {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    default : 1 ,
    min: [1, "Rate cannot be less than one"],
    max: [5, "course max rate 10"],
  },
  category: {
    type: String,
    enum: ['k-12', 'University' , "Trainee"],
    required: true  
  },
  learningCategory: {
    type: String,
    enum: ['IT & Software', 'Design' , "Marketing" , "Science" , "Language" , "Trending"] ,
    required: true  
  },
  level : {
    type: String,
    enum: ['Beginner', 'Intermediate' , "Advanced"],
    required: true  
  },
  isPaid : {
    type : Boolean ,
    default : true
  },
  coursePic : {
    type: String,
    required : true ,
    default: null, 
  },
  tags : [{ type: String }],
  sections : [SectionSchema],
  instructorId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
    required: true,
    default : null
  },
  price : { type: Number , min : 0 , required : false } ,
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizes" }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "lessons" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "assigments" }],
  paymentCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
  ratings : [RatingSchema],
  feedbacks : [feedbackSchema],
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  extraInfo : {
    type: String,
    required: true,
  }
} , {timestamps : true})




CourseSchema.virtual("instructor", {
  ref: "instructors",
  localField: "instructorId",
  foreignField: "_id",
  justOne: true,
})



const Course = mongoose.model("courses" , CourseSchema)


module.exports = Course