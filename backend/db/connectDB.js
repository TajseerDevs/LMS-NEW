const mongoose = require("mongoose")


const connectDB = async () => {
    try {
        return mongoose.connect(process.env.MONGO_DB_URL)
            .then(() => console.log("LMS DATABASE CONNECTED SUCCESSFULLY"))
            .catch((err) => console.log(`FAILED TO CONNECT TO THE DATABASE : ERR : ${err}`))
    } catch (error) {
        console.log(error)        
    }
}

module.exports = connectDB 