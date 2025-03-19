const mongoose = require("mongoose")


const ParentSchema = new mongoose.Schema({
    userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
    studentsEnrolled: [
        {
          studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
          fullName: { type: String, required: true },
          relation: { type: String, enum: ["father", "mother", "guardian"], required: true },
          gradeLevel: { 
            type: String, 
            enum: ["K-12", "university", "training"], 
            required: true 
          },        
        },
    ],
})


ParentSchema.virtual('user', {
    ref: 'users',
    localField: 'userObjRef',
    foreignField: '_id',
    justOne: true
});


const Parent = mongoose.model("parents" , ParentSchema)


module.exports = Parent


