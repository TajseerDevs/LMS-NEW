const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ROLES = require("../utils/roles")
const crypto = require("crypto")



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type : String,
        required : true,
        select : false
    },
    // phone: {
    //     type: String,
    //     default: undefined, 
    // },
    phone : {
        type: String,
        required: true,
        unique: true,
        match: /^\+[0-9]+$/, 
    },
    role : {
        type : String ,
        required : true ,
        role: { type: String , required: true , enum: Object.values(ROLES) },
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
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
    lastLogin : {
        type: Date,
        required: true,
    },
    cartItems: {
        type: Array,
        default: [],
    },
    bookmarks: {
        type: [{type : mongoose.Schema.Types.ObjectId , ref : "courses"}],
        default: [],
    },
    wishlist: {
        type: [{type : mongoose.Schema.Types.ObjectId , ref : "courses"}],
        default: [],
    },
},{timestamps : true})




userSchema.methods.signJWT = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE})
}



userSchema.pre("save" , async function(next){

    if(!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword
 
})


userSchema.pre("deleteOne" , async function(next){

    const lists = await Listing.deleteMany({userRef : this._id})

    

    next()
 
})



userSchema.methods.getResetPasswordToken = function(){
    // create a token
    // .randomBytes(num_of_bytes) return a Buffer then we convert it to string
    const resetToken = crypto.randomBytes(20).toString("hex")

    // set the user resetPasswordToken key in the DB to the created token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex") 

    // set the reset token expire date (10 min)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

 

const User = mongoose.model("users" , userSchema)


module.exports = User



// use LMS-MERN-SCORM
// db.users.dropIndex("name_1")
// db["users"].find()
// db.users.dropIndex("name_1")
// db.parents.getIndexes()
// db.parents.dropIndex("email_1")
