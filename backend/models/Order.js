const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "users" ,
        required : true
    },
    courses : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "courses" ,
                required : true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
              },
            price : {
                type : Number , 
                required : true ,
                min : 0
            }
        }
    ],
    totalAmount : {
        type : Number ,
        required : true ,
        min : 0
    } ,
    stripeSessionId : {
        type : String ,
        unique : true
    }
} , {timestamps : true})



const Order = mongoose.model("orders" , orderSchema)


module.exports = Order