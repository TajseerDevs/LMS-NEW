const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const jwt = require("jsonwebtoken")

const User = require("./models/User")
const Course = require("./models/Course")
const Instructor = require("./models/Instructor")
const Student = require("./models/Student")
const Group = require("./models/Group")


const createError = require("../backend/utils/createError")
const connectDB = require("./db/connectDB")


require("dotenv").config()


const app = express()


app.use(cors({
  origin : "http://localhost:3000",
  credentials: true
}))

app.use(express.json())


const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] 
  },
})



// custom middleware to check that only logged users could access our socket server
io.use(async (socket, next) => {

  const token = socket.handshake.headers.authorization?.split(' ')[1]

  try {

    if (!token) {
      return socket.emit('error', "Authentication error : No token provided")
    }

    const decodedToken = jwt.verify(token , process.env.JWT_SECRET)
    
    const user = await User.findById(decodedToken.id)
    
    if(!user){
      return socket.emit('error', "User not authenticated")
    }
  
    socket.user = user
    
    next()
    
  } catch (error) {
    return next(createError(error , 401))
  }

})




let users = []
const whiteboardSessions = {}


const addUser = (userId , socketId) => {
  !users.some((user) => user?.userId === userId) && users.push({ userId, socketId, status: 'online' })
}


const getUser = (userId) => {
  const user = users.find((user) => user.userId === userId)
  return user
}


const removeUser = (socketId) => {
  users = users.filter((user) => user?.socketId !== socketId)
}


const isValidUser = (socket) => {
  return socket.user && socket.user._id 
}



const isInstructor = async (sessionId, userId) => {

  const session = whiteboardSessions[sessionId]

  if (!session) return { error: 'Session not found' }

  const course = await Course.findById(session.courseId).lean()

  if (!course) return { error: 'Course not found' }

  if (course.instructorId.toString() !== userId.toString()) {
    return { error: 'Unauthorized action' }
  }

  return { session }

}




const getGroupMembers = async (groupId) => {
  const group = await Group.findById(groupId).populate("members")
  return group ? group.members.map((member) => member._id.toString()) : []
};



// ! TODO fileUploaded event



io.on("connection" , (socket) => {

  console.log("User connected :", socket?.user?._id) 


  socket.on("addUser" , (userId) => {

    if (!isValidUser(socket)) {
      return socket.emit('error', "User not authenticated")
    }

    addUser(userId , socket.id)
    io.emit("getUsers" , users)

  })


  socket.emit("testEvent", { message: "Hello from the server" })




  socket.on("startConversation" , ({ senderId , receiverId , conversationId }) => {

    const userReceiver = getUser(receiverId)
    const userSender = getUser(senderId)

    if (userReceiver) {

      io.to(userReceiver?.socketId).emit("startConversation", {
        senderId,
        conversationId,
      })

    }

    if (userSender) {

      io.to(userSender?.socketId).emit("startConversation", {
        senderId,
        conversationId,
      })
      
    }

  })




  socket.on("sendMessage" , ({
    senderId,
    receiverId,
    text,
    file,
    convId,
    senderUsername,
    _id,
    createdAt,
    senderAvatar,
    isForwarded
  }) => {
    
    if (!isValidUser(socket)) {
      return socket.emit('error', "User not authenticated")
    }

    const user = getUser(receiverId)

    const message = {
      senderId ,
      receiverId ,
      senderUsername ,
      text ,
      _id ,
      convId ,
      senderAvatar ,
      file ,
      createdAt
    }

    io.to(user?.socketId).emit("getMessage" , message)

  })





  socket.on("messageDeleted" , ({ messageId , conversationId , members , senderId }) => {

    members.map((member) => {

      const userReceiver = getUser(member)

      io.to(userReceiver?.socketId).emit("messageDeleted", {
        senderId,
        conversationId,
        messageId,
      })

      return true
    
    })

  })






  socket.on("groupCreated", ({ groupId , groupName , addedUsers , createdBy , conversationId }) => {

    addedUsers.forEach((userId) => {

      const user = getUser(userId)

      if (user) {

        io.to(user?.socketId).emit("groupCreated" , {
          groupId,
          groupName,
          createdBy,
          conversationId
        })

      }

    })

  })






  socket.on("groupUpdated", async ({ groupId , groupName , conversationId , addedUsers , updatedBy }) => {

    addedUsers.forEach((userId) => {

      const user = getUser(userId)

      if (user) {

        io.to(user?.socketId).emit("addedToGroup", {
          groupId,
          groupName,
          conversationId,
          addedBy: updatedBy,
        })

      }

    })

    const groupMembers = await getGroupMembers(groupId)

    groupMembers.forEach((memberId) => {

      const member = getUser(memberId)

      if (member && !addedUsers.includes(memberId)) {

        io.to(member?.socketId).emit("groupUpdated", {
          groupId,
          groupName,
          conversationId,
          addedUsers,
          updatedBy,
        })

      }

    })

  })






  socket.on("groupInfoUpdated", async ({ groupId , updatedInfo , updatedBy , conversationId  }) => {

    try {

      const groupMembers = await getGroupMembers(groupId)
  
      groupMembers.forEach((memberId) => {

        const member = getUser(memberId)
  
        if (member) {

          io.to(member?.socketId).emit("groupInfoUpdated", {
            groupId,
            updatedInfo, 
            updatedBy,
            conversationId, 
          })

        }

      })

    } catch (error) {
      console.error("Error notifying members about group info update:" , error)
    }

  })






  socket.on("removedFromGroup", async ({ groupId , removedUserId , removedBy , conversationId  }) => {

    try {

      const removedUser = getUser(removedUserId)
  
      if (removedUser) {

        io.to(removedUser?.socketId).emit("removedFromGroup" , {
          groupId,
          removedBy ,
          conversationId
        })

      }
  
      const groupMembers = await getGroupMembers(groupId)
  
      groupMembers.forEach((memberId) => {

        const member = getUser(memberId)
  
        if (member && memberId !== removedUserId) {

          io.to(member?.socketId).emit("removedFromGroup", {
            groupId,
            removedUserId,
            removedBy,
          })

        }

      })

    } catch (error) {
      console.error("Error notifying about user removal from group:" , error)
    }

  })






  socket.on("groupDeleted", async ({ groupId , deletedBy , conversationId }) => {

    try {

      const groupMembers = await getGroupMembers(groupId)
  
      groupMembers.forEach((memberId) => {

        const member = getUser(memberId)
  
        if (member) {

          io.to(member?.socketId).emit("groupDeleted", {
            groupId,
            deletedBy,
            message: "The group has been deleted.",
            conversationId,
          })

        }

      })

    } catch (error) {
      console.error("Error notifying about group deletion:", error);
    }

  })
  
  





  // send the notification to the parent also if one who receive the notification is a student 
  socket.on('sendNotification' , ({receiverId , notification}) => {

    if (!isValidUser(socket)) {
      return socket.emit('error', "User not authenticated")
    }

    const user = getUser(receiverId)

    io.to(user.socketId).emit('getNotification' , notification)

  })





  socket.on('createSession' , async ({ sessionId , courseId }) => {

    if (socket?.user?.role !== 'instructor') {
      return socket.emit('error', 'Only teachers can create a session')
    }

    const course = await Course.findById(courseId)

    const courseInstructor = await Instructor.findById(course.instructorId)

    if (!courseInstructor) {
      return socket.emit('error', 'course instructor not exist')
    }
    
    if (!course || course.instructorId.toString() !== courseInstructor._id.toString()) {
      return socket.emit('error', 'You are not authorized to create a session for this course , course instructor only')
    }

    whiteboardSessions[sessionId] = {
      courseId,
      instructorId : courseInstructor._id ,
      boardState: [],
    }

    socket.join(sessionId)

    io.to(sessionId).emit('sessionCreated', { sessionId , courseId })

    console.log(`Session created: ${sessionId} for course ${courseId}`)

  })






  socket.on('joinSession', async ({ sessionId }) => {
    
    const session = whiteboardSessions[sessionId]

    if (!session) {
      return socket.emit('error', 'Session not found')
    }

    const course = await Course.findById(session.courseId)

    const studentDoc = await Student.findOne({userObjRef : socket?.user?._id})

    if (!studentDoc) {
      return socket.emit('error', 'Student not exist')
    }

    if (!course || !course.studentsEnrolled.includes(studentDoc._id)) {
      return socket.emit('error', 'You are not enrolled in this course')
    }

    socket.join(sessionId)

    socket.emit('boardState', session.boardState)

    io.to(sessionId).emit('userJoined', { userId : socket.user._id })

    console.log(`User ${socket.user.name} joined session ${sessionId}`)
  
  })






  socket.on('draw' , async ({ sessionId , drawData }) => {
    
    const session = whiteboardSessions[sessionId]

    const course = await Course.findById(session.courseId)

    const courseInstructor = await Instructor.findById(course.instructorId)

    if (!courseInstructor) {
      return socket.emit('error' , 'course instructor not exist')
    }

    if (!session || session.instructorId.toString() !== courseInstructor._id.toString()) {
      return socket.emit('error', 'You are not authorized to draw on this board , course instructor only')
    }

    session.boardState.push(drawData)

    io.to(sessionId).emit('drawUpdate' , drawData)

  })





  socket.on('clearBoard' , async ({ sessionId }) => {

    const session = whiteboardSessions[sessionId]

    const course = await Course.findById(session.courseId)

    const courseInstructor = await Instructor.findById(course.instructorId)

    if (!courseInstructor) {
      return socket.emit('error', 'course instructor not exist')
    }

    if (!session || session.instructorId.toString() !== courseInstructor._id.toString()) {
      return socket.emit('error', 'You are not authorized to clear this board')
    }

    session.boardState = []

    io.to(sessionId).emit('boardCleared')

    console.log(`Board cleared for session ${sessionId}`)

  })



  socket.on("disconnect" , () => {
    console.log("User disconnected :" , socket?.user?._id)
    removeUser(socket.id)
    io.emit("getUsers" , users)
  })


})




const PORT = 5000 

server.listen(PORT, async () => {
  await connectDB()
  console.log(`Socket server listening on port ${PORT}`)
})















 





