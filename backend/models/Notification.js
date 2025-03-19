const mongoose = require("mongoose")


const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false 
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        default: null,
    },
    type : {
        type : String ,
        required : true ,
        enum: [
            "enroll_request",          
            "enroll_success",         
            "enroll_reject",
            "add_ticket_success",          
            "add_ticket_failed",           
            "ticket_solved",          
            "ticket_in_progress",          
            "course_created",            
            "course_update",            
            "course_deleted",           
            "course_sections_updated",           
            "course_items_updated",           
            "instructor_changed" ,
            "rating_received",          
            "question_reply",          
            "comment",                  
            "like",                     
            "reply",                    
            "admin_action",             
            "solved",                   
            "new_user_registration",    
            "user_role_updated",        
            "instructor_assigned",      
            "log_created",              
            "profile_updated",          
            "password_changed",         
            "course_rating_given",      
            "new_instructor_added",     
            "user_deleted",             
            "log_viewed",               
            "student_enrolled",         
            "enrollment_request_approved", 
            "enrollment_request_rejected"  ,
            "course_reminder"
        ],
    },
    message: {
        type: String,
        default: "",
    },
    read: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["sent" , "read"],
        default: "sent",
    },
}, { timestamps: true })




const Notification = mongoose.model("notifications", notificationSchema)



module.exports = Notification