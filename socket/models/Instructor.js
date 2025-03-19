const mongoose = require("mongoose")


const InstructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email structure"],
    },
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