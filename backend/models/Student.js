const mongoose = require("mongoose");



const BadgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    badgeType: {
      type: String,
      enum: ["bronze", "silver", "gold", "premium"], 
      required: true,
    },
    description: { type: String }, 
    dateAwarded: { type: Date, default: Date.now }, 
    level: { type: Number, required: false }, 
  },
  { timestamps: true }
)



const StudentSchema = new mongoose.Schema({
  userObjRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: "reminders" }],
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "parents" },
  badges: [BadgeSchema],
  courseProgress: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      progress: {
        sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "sections" },
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "items" },
        timestamp: { type: Date },       
      },
    },
  ],
} , {
  toObject : {virtuals : true} ,
  toJSON : {virtuals : true} ,
})



StudentSchema.virtual("user", {
  ref: "users",
  localField: "userObjRef",
  foreignField: "_id",
  justOne: true,
})


const Student = mongoose.model("students" , StudentSchema)


module.exports = Student