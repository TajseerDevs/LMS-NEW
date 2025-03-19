const mongoose = require("mongoose");


const reminderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  reminderName: { type: String, required: true },
  reminderType: { type: String, enum: ['daily', 'weekly', 'once'], required: true },
  reminderDays: {
    type: [String],
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    default: [],
  },
  reminderTime: { type: String, required: true },
  reminderDateTime: { type: Date },  
  active: { type: Boolean , default: true },
}, { timestamps: true });



const Reminder = mongoose.model("reminders", reminderSchema)


module.exports = Reminder