const mongoose = require("mongoose");
const { Attachment , attachmentSchema } = require("./Attachment");


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
});



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
    enum: ['Technology', 'Business' , "Health" , "Arts" , "Science" , "Sport"],
    required: true  
  },
  coursePic: {
    type: String,
    default: null, 
  },
  tags: [{ type: String }],
  sections: [SectionSchema],
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
    required: true,
    default : null
  },
  price : { type: Number , min : 0 , required : true } ,
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizes" }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "lessons" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "assigments" }],
  paymentCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
  ratings: [RatingSchema],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  extraInfo : {
    type: String,
    required: false,
  }
} , {timestamps : true})



CourseSchema.virtual("instructor", {
  ref: "instructors",
  localField: "instructorId",
  foreignField: "_id",
  justOne: true,
});



const Course = mongoose.model("courses", CourseSchema);


module.exports = Course;