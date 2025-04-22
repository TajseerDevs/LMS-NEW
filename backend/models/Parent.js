const mongoose = require("mongoose")


const ParentSchema = new mongoose.Schema({
  userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
  studentsEnrolled: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
      fullName: { type: String, required: true },
      educationLevel: { 
        type: String, 
        enum: ["K-12", "university", "training"], 
        required: true 
      },   
      relation: {
        role: {
          type: String,
          enum: ["father", "mother", "guardian"],
          required: true
        },
        emergencyNumber: {
          type: String,
          required: true,
          match: /^\+[0-9]+$/
        },
        emergencyEmail: {
          type: String,
          required: true,
          match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 
        },
      }, 
      specialNeeds : {
        type : Boolean ,
        required: true,
        default : false          
      }     
    },
  ],
})



ParentSchema.virtual('user', {
  ref: 'users',
  localField: 'userObjRef',
  foreignField: '_id',
  justOne: true
})



const Parent = mongoose.model("parents" , ParentSchema)



module.exports = Parent


