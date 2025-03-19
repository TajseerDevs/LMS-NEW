const Notification = require("../models/Notification")
const createError = require("../utils/createError")



const getNotifications = async (req , res , next) => {

    try {
        
        const loggedUserId = req.user._id

        // strictPopulate: false will not throw an error if the from key is null value
        const notifications = await Notification.find({to : loggedUserId}).populate({path : "from" , options : {strictPopulate: false}}).sort({ createdAt: -1 }) 
 

        const updatedNotifications = await Promise.all(

            notifications.map(async (noti) => {

                const updatedNotification = await Notification.findByIdAndUpdate(
                    noti._id,
                    { read: true, status: "read" },
                    { new: true }
                ).populate({
                    path: "from",
                    select: "name email",
                    options: { strictPopulate: false }
                });

                return updatedNotification
                
            })

        );

        res.status(200).json(updatedNotifications)       

    } catch (error) {
        next(error)
    }

}





const deleteNotifications = async (req , res , next) => {

    try {
        
        const loggedUserId = req.user._id

        const notifications = await Notification.find({to : loggedUserId})

        await Promise.all((notifications.map((noti) => {
            return Notification.findByIdAndDelete(noti._id)
        })))

        res.status(200).json({msg : "user notifications deleted successfully"})       

    } catch (error) {
        next(error)
    }

}





const deleteNotification = async (req , res , next) => {

    try {
        
        const {notificationId} = req.params
        const loggedUserId = req.user._id

        const notification = await Notification.findById(notificationId)

        if(!notification){
            return next(createError("Notification not found" , 404))
        }

        if(notification.to.toString() !== loggedUserId.toString()){
            return next(createError("you don't have access to delete this notification" , 401))
        }

        await Notification.findByIdAndDelete(notificationId)

        res.status(200).json({msg : "notification deleted successfully"})       

    } catch (error) {
        next(error)
    }

}







module.exports = {getNotifications , deleteNotifications , deleteNotification}