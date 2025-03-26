    const express = require("express")
    const path = require("path")
    const cors = require("cors")
    const bodyParser = require('body-parser');
    const morgan = require("morgan")
    const fileUpload = require("express-fileupload");
    const compression = require("compression")
    const mongoSanitize = require("express-mongo-sanitize")
    const fs = require("fs")
    const rateLimit = require('express-rate-limit')
    const helmet = require('helmet')

    require("dotenv").config()


    const app = express() 

    const PORT = process.env.PORT || 8000

    const scormRoutes = require("./routes/scorm.routes")
    const userRoutes = require("./routes/user.routes")
    const instructorRoutes = require("./routes/instructor.routes")
    const courseRoutes = require("./routes/course.routes")
    const studentRoutes = require("./routes/student.routes")
    const adminRoutes = require("./routes/admin.routes")
    const notificationRoutes = require("./routes/notification.routes")
    const ticketsRoutes = require("./routes/tickets.routes")
    const parentRoutes = require("./routes/parent.routes")
    const cartRoutes = require("./routes/cart.routes")
    const paymentRoutes = require("./routes/payment.routes")
    const couponRoutes = require("./routes/coupon.routes")
    const messageRoutes = require("./routes/message.routes")
    const conversationRoutes = require("./routes/conversation.routes")
    const groupRoutes = require("./routes/group.routes")
    const quizRoutes = require("./routes/quiz.routes")
    const assignmentRoutes = require("./routes/assignment.routes")
    const calendarRoutes = require("./routes/calendar.routes")


    const connectDB = require("./db/connectDB")
    const errorHandler = require("./middlewares/errorHandler")

    

    app.use(express.json())

    app.use((req, res, next) => {
      res.setHeader("Content-Security-Policy", "frame-ancestors 'self' http://10.10.30.40:3000");
      res.setHeader("X-Frame-Options", "ALLOW-FROM http://10.10.30.40:3000");
      next();
    })
  
    app.use(cors())
    

    const limiter = rateLimit({ 
      windowMs : 50 * 60 * 1000 , // each one hour
      limit: 50,
      handler: (req , res , next) => {
        res.status(429).json({
          success: false,
          error: "You have exceeded the requests number limit !",
          status: 429, 
        })
      }
    })


    app.use(bodyParser.json()) // Parses incoming request body into JSON format.
    app.use(express.static(path.join(__dirname , "public"))) // Serves static files , from the public directory
    app.use(express.urlencoded({extended: true})) // allows parsing of nested objects 
    app.use(compression()) // Reduces response size, improving performance and reducing bandwidth usage.
    app.use(mongoSanitize()) // prevent NoSQL injection attacks.
    // app.use(limiter) // requests rate limiting



    app.use(
      fileUpload({
        limits: { fileSize: 150 * 1024 * 1024 }, // Limit file size to 150MB
        abortOnLimit : true, 
        createParentPath: true , 
      })
    )


    app.get('/download/:filename', (req, res) => {
      const filePath = path.join(__dirname, 'uploads', req.params.filename)
      res.download(filePath); 
    });


    const uploadsDir = path.join(__dirname, "uploads/images")
    const docsUploadsDir = path.join(__dirname, "uploads/documents")
    const voicesUploadsDir = path.join(__dirname, "uploads/voices")

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    if (!fs.existsSync(docsUploadsDir)) {
      fs.mkdirSync(docsUploadsDir, { recursive: true })
    }

    if (!fs.existsSync(voicesUploadsDir)) {
      fs.mkdirSync(voicesUploadsDir, { recursive: true })
    }

    if(process.env.NODE_ENV !== "development"){
      app.use(morgan("dev"))
    }
  

    app.use(function(req , res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })  


    app.use("/uploads" , express.static(path.join(__dirname , "uploads")))
    app.use("/public" , express.static(path.join(__dirname , "public")))

    
    
    app.use("/api/v1/user" , userRoutes)
    app.use("/api/v1/scorm" , scormRoutes)
    app.use("/api/v1/instructor" , instructorRoutes)
    app.use("/api/v1/parent" , parentRoutes)
    app.use("/api/v1/courses" , courseRoutes)
    app.use("/api/v1/student" , studentRoutes)
    app.use("/api/v1/notification" , notificationRoutes)
    app.use("/api/v1/tickets" , ticketsRoutes)
    app.use("/api/v1/admin" , adminRoutes)
    app.use("/api/v1/cart" , cartRoutes)
    app.use("/api/v1/payment" , paymentRoutes)
    app.use("/api/v1/coupon" , couponRoutes)
    app.use("/api/v1/message" , messageRoutes)
    app.use("/api/v1/conversation" , conversationRoutes)
    app.use("/api/v1/group" , groupRoutes)
    app.use("/api/v1/quiz" , quizRoutes)
    app.use("/api/v1/assignment" , assignmentRoutes)
    app.use("/api/v1/calendar" , calendarRoutes)



    app.use(errorHandler)


    const start = async () => {
      try {
        app.listen(PORT , () => console.log(`LMS SERVER STARTED ON PORT ${PORT}`))
        await connectDB()
      } catch (error) {
        console.log(error)
      }
    }

    start() 










    // Bulk Write Operations
    // MongoDB supports bulk write operations, which allow you to perform many updates or insertions in a single request. This reduces the overhead of multiple round-trip queries to the database.
    // Bulk Write Operations:

    // Instead of calling notification.save() inside a loop, we create an array of operations (notificationOps) that are all inserted at once using Notification.bulkWrite(notificationOps). This dramatically reduces the number of queries sent to MongoDB.
    // Efficient Update for Students:

    // We still use updateMany to remove the course ID from all students' coursesEnrolled. This is efficient because MongoDB processes the update for all matching documents in a single query.


    // const students = await Student.find({ coursesEnrolled : course._id });

    // // Step 2: Create bulk write operations for notifications
    // const notificationOps = students.map((student) => ({
    //     insertOne: {
    //         document: {
    //             from: req.user._id,  // The instructor or admin deleting the course
    //             to: student.userObjRef,  // Use the userObjRef to get the ID of the student
    //             type: "course_deleted",  // Notification type
    //             message: `The course "${course.title}" has been deleted.`,  // The message to send
    //         },
    //     },
    // }));

    // // Bulk insert notifications
    // await Notification.bulkWrite(notificationOps);


  // how to calculate rate limiting for our server
  // Total requests = Total Server requests Capacity pre hour ÷ Number of Users.
  // 100,000 ÷ 1,000 = 100 requests per hour per user
