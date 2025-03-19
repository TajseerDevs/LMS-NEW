const Joi = require("joi")
const createError = require("../utils/createError")

const File = require("../models/File")
const User = require("../models/User")
const Course = require("../models/Course")
const Instructor = require("../models/Instructor")

const path = require("path")
const fs = require("fs")
const Assignment = require("../models/Assigment")
const Reminder = require("../models/Reminder")
const Quiz = require("../models/Quiz")
const Student = require("../models/Student")




const getCalendarEvents = async (req , res , next) => {

    try {
        
        const { startDate , endDate } = req.query

        const user = await User.findById(req.user._id)

        if (!user) {
            return next(createError("User not exist" , 400))
        }

        if (!startDate || !endDate) {
          return next(createError("Start date and end date for month are required" , 400))
        }
    
        const start = new Date(startDate)
        const end = new Date(endDate)
    
        if (isNaN(start)) {
          return next(createError("Invalid month start date format" , 400))
        }
    
        if (isNaN(end)) {
          return next(createError("Invalid month end date format" , 400))
        }

        if (end < start) {
          return next(createError("Month End date cannot be earlier than Month start date" , 400))  
        }

        if (start > end) {
          return next(createError("Month Start date cannot be later than Month end date" , 400))  
        }

        const studentDocObj = await Student.findOne({userObjRef : req.user._id})

        if (!studentDocObj) {
          return next(createError(`No Student found with this id ${req.user._id}` , 404))
        }

        const quizzes = await Quiz.find({
            dueDate: { $gte : start , $lte : end }
        }).lean()


        const assignments = await Assignment.find({
            dueDate: { $gte: start, $lte: end },
        })
        .populate({
            path: "submissions" , 
            select: "studentId" , 
        })
        .lean()


        const reminders = await Reminder.find({
            reminderDateTime: { $gte : start , $lte : end } ,
            active: true
        }).lean()


        if (!quizzes.length && !assignments.length && !reminders.length) {
            return res.status(200).json({
                message: "No events found for the specified month." , 
                quizzes : quizzes.length , 
                assignments : assignments.length , 
                reminders : reminders.length
            })
        }

        const eventsByDate = {}

        const groupEventsByDate = (events , dateField , type) => {

            events.forEach(event => {

                const eventDate = new Date(event[dateField]).toISOString().split('T')[0]
        
                if (!eventsByDate[eventDate]) {
                    eventsByDate[eventDate] = { quizzes: [] , assignments: [] , reminders: [] }
                }
        
                if (type === 'quizzes') {

                    const hasAnswered = event.submittedBy.some((submittedStudentId) => submittedStudentId.toString() === studentDocObj._id.toString())
                    eventsByDate[eventDate].quizzes.push({ ...event , hasAnswered }) 

                } else if (type === 'assignments') {

                    const hasSubmitted = event.submissions.some((submission) => submission.studentId.toString() === studentDocObj._id.toString())
                    eventsByDate[eventDate].assignments.push({ ...event , hasSubmitted })
                
                } else if (type === 'reminders') {
                    eventsByDate[eventDate].reminders.push(event)
                }

            })
        }

        groupEventsByDate(quizzes , 'dueDate' , 'quizzes')
        groupEventsByDate(assignments , 'dueDate' , 'assignments')
        groupEventsByDate(reminders , 'reminderDateTime' , 'reminders')


        const sortedEvents = Object.keys(eventsByDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .reduce((acc, date) => {
            acc[date] = eventsByDate[date]
            return acc
        }, {})

        res.status(200).json(sortedEvents)

    } catch (error) {
        next(error)
    }

}






module.exports = {getCalendarEvents}