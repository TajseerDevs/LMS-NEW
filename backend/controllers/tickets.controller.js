const Ticket = require("../models/Ticket")
const Joi = require("joi")
const User = require("../models/User")
const createError = require("../utils/createError")




const getAllUserTickets = async (req , res , next) => {

    try {

        const user = await User.findById(req.user._id)

        if (!user) {
            return next(createError("User does not exist", 400))
        }

        const page = parseInt(req.query.page) || 1
        const limit = 10

        const skip = (page - 1) * limit

        let userTickets = await Ticket.find({ userObjRef: user._id , isArchived : false })
         .skip(skip)
         .limit(limit)

        userTickets = userTickets.filter(ticket => ticket !== undefined && ticket !== null)

        res.status(200).json(userTickets)

    } catch (error) {
        next(error)
    }
}




const addNewTicket = async (req , res , next) => {

    const ticketSchema = Joi.object({
        regarding : Joi.string().valid("content" , "technical").required(),
        priority : Joi.string().valid("Low" , "Medium" , "urgent").optional(),
        subject : Joi.string().required(),
        details : Joi.string().required(),
        info : Joi.string().required(),
        courseId: Joi.string().required(),
    })

    const { value, error } = ticketSchema.validate(req.body, {
        abortEarly: false,
    })

    if (error) {
        return next(createError("Inavlid Ticket Credentials" , 500))
    }

    try {
        
        const {regarding , subject , details , info , courseId , priority } = value

        if(!regarding || !subject || !details || !info) { 
            return next(createError("Invalid Ticket Credentials" , 400))
        }

        const newTicket = new Ticket({
            regarding,
            subject ,
            details,
            info ,
            userObjRef : req.user._id ,
            courseRef: courseId
        })

        // if user provide the ticket priority we add it if not it will be a Low default value
        if(priority){ 
            newTicket.priority = priority
        }

        await newTicket.save()

        res.status(201).json(newTicket)

    } catch (error) {
        next(error)
    }
}





const deleteTicket = async (req , res , next) => {

    try {
        
        const {ticketId} = req.params

        let ticket = await Ticket.findById(ticketId)

        if(!ticket){
            return next(createError("given Ticket not exist" , 404))
        }

        if(ticket.userObjRef.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return next(createError("you don't have access to delete this ticket" , 401))
        }

        if(ticket.status === "inProgress"){
            return next(createError("you don't have access to delete the in progress tickets" , 401))            
        }

        ticket.isArchived = true

        await ticket.save()

        res.status(200).json({msg : "ticket deleted successfully"})

    } catch (error) {
        next(error)
    }
}




const getFilteredTickets = async (req , res , next) => {

    try {
        
        const filterSchema = Joi.object({
            regarding: Joi.string().valid("content", "technical"),
            status: Joi.string().valid("pending", "inProgress", "closed"),
            priority: Joi.string().valid("Low", "Medium", "urgent"),
            isArchived: Joi.boolean(),
            courseRef: Joi.string().hex().length(24) ,
            page: Joi.number().min(1).default(1)
        })

        const { error, value } = filterSchema.validate(req.query, { abortEarly: false })
        
        if (error) {
            return res.status(400).json({ success: false, errors: error.details.map(err => err.message)})
        }

        const { regarding , status , priority , courseRef , isArchived , page } = value

        let filter = {}

        if (regarding) filter.regarding = regarding
        if (status) filter.status = status
        if (priority) filter.priority = priority
        if (courseRef) filter.courseRef = courseRef
        if (isArchived !== undefined) filter.isArchived = isArchived

        filter.userObjRef = req.user._id

        const limit = 10
        const skip = (page - 1) * limit

        const totalDocuments = await Ticket.countDocuments(filter)
        const totalPages = Math.ceil(totalDocuments / limit)
        
        const tickets = await Ticket.find(filter).populate("userObjRef courseRef").skip(skip).limit(limit)

        res.status(200).json({
            totalDocuments,
            totalPages,
            currentPage: page,
            tickets
        })

    } catch (error) {
        next(error)
    }

}




module.exports = {
    getAllUserTickets , 
    addNewTicket , 
    deleteTicket ,
    getFilteredTickets
}