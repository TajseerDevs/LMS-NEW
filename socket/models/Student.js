const mongoose = require("mongoose");



const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  userObjRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: "reminders" }],
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "parents" },
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


const Student = mongoose.model("students", StudentSchema)


module.exports = Student