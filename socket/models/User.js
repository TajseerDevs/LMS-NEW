const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const ROLES = {
    STUDENT: "student",
    PARENT: "parent",
    INSTRUCTOR: "instructor",
    ADMIN: "admin"
};


const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        unique : true,
    },
    email: {
        type : String,
        required : true,
        unique : true,
    },
    password: {
        type : String,
        required : true,
        select : false
    },
    age: {
        type : Number,
        required : true,
        min: [0, "Age cannot be negative"],
    },
    phone: {
        type: String,
        default: undefined, 
    },
    
    role : {
        type : String ,
        required : true ,
        role: { type: String , required: true , enum: Object.values(ROLES) },
    },
    profilePic: {
        type: String,
        default: null, 
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isInstructor : {
        type : Boolean,
        default : false
    },
    adminOfAdmins : {
        type : Boolean,
        default : false
    },
    isAccepted : {
        type : Boolean,
        default : true
    },
    isOnline : {
        type : Boolean ,
        default : false
    },
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'parents' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cartItems : [ 
        {
            quantity : {type : Number , default : 1} ,
            courseId : {type : mongoose.Schema.Types.ObjectId , ref : "courses"}
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courses", 
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courses", 
        }
    ],
},{timestamps : true})




userSchema.methods.signJWT = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE})
}


 

const User = mongoose.model("users" , userSchema)


module.exports = User