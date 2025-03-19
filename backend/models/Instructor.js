const mongoose = require("mongoose")


const InstructorSchema = new mongoose.Schema({
    userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
    coursesTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }]
});



InstructorSchema.virtual('user', {
    ref: 'users',
    localField: 'userObjRef',
    foreignField: '_id',
    justOne: true
});



const Instructor = mongoose.model("instructors" , InstructorSchema)


module.exports = Instructor