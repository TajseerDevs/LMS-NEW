const mongoose = require("mongoose")


const ticketSchema = new mongoose.Schema({
    regarding: {
        type : String ,
        required : true,
        enum : ["content" , "technical"]
    },
    subject : {
        type : String ,
        required : true
    },
    details : {
        type : String ,
        required : true
    },
    info : {
        type : String ,
        required : true
    },
    userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
    status : {
        type : String ,
        required : true,
        enum : ["pending" , "inProgress" , "closed"],
        default : "pending"
    },
    priority : {
        type : String ,
        required : true,
        enum : ["Low" , "Medium" , "urgent"],
        default : "Low"
    },
    supportTeamResponse : {
        type : String ,
    },
    courseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: function () {
          return this.regarding === "content"
        },
    },
    isArchived : {
        type : Boolean ,
        default : false
    }
},{timestamps : true})



const Ticket = mongoose.model("tickets" , ticketSchema)


module.exports = Ticket