const Joi = require("joi")
const Course = require("../models/Course")
const Student = require("../models/Student")
const StudentCourseRequest = require("../models/studentCourseRequests")
const User = require("../models/User")
const createError = require("../utils/createError")
const Parent = require("../models/Parent")
const Ticket = require("../models/Ticket")
const Instructor = require("../models/Instructor")
const bcrypt = require("bcrypt")
const ROLES = require("../utils/roles")
const ScormLog = require("../models/ScormLogSchema");
const { ObjectId } = require('mongodb');
const Notification = require('../models/Notification')
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const postmarkTransport = require("nodemailer-postmark-transport");
const generateEmailHTML = require('../utils/emailTemplate');
const Lesson = require("../models/ScormLogSchema")
const Order = require("../models/Order")
const mongoose = require("mongoose")




// ADMIN STUDENTS CONTROLLERS

const updateEnrolmentStatus = async (req , res , next) => {

    try {
        
        const {courseId , studentId} = req.params
        const {newStatus} = req.body

        const course = await Course.findById(courseId)

        if(!course){
          return next(createError("course not found" , 404))
        }

        const studentReqEnrolment = await StudentCourseRequest.findOne({courseId : course._id , studentId})

        const studentDoc = await Student.findById(studentId).populate("user")

        if (!studentDoc) {
          return next(createError("Student not found", 404))
        }

        // Extract user document from studentDoc
        const userDoc = studentDoc.user

        if (!userDoc) {
          return next(createError("Associated user not found", 404));
        }

        if(!studentReqEnrolment){
          return next(createError("student with this id doesn't request enrolment for this course" , 404))
        }

        const validStatusTypes = ["pending" , "approved" , "rejected"]

        if(!validStatusTypes.includes(newStatus)){
          return next(createError("Invalid course request status type" , 400))
        }

        const updatedStudentReqEnrolment = await StudentCourseRequest.findByIdAndUpdate(studentReqEnrolment._id , {status : newStatus} , {new : true})

        if(newStatus === "approved"){
          // operator structure : {$operator : {db_key : value}}
          await Student.findByIdAndUpdate(studentId , {$push : {coursesEnrolled : course._id}} , {new : true})
          await User.findByIdAndUpdate(userDoc._id , {$push : {coursesEnrolled : course._id}} , {new : true})
          await Course.findByIdAndUpdate(courseId , {$push : {studentsEnrolled : studentId}} , {new : true})
          const newNotification = new Notification({
            from : req.user._id ,
            to : userDoc._id ,
            courseId ,
            type : "enrollment_request_approved" , 
            message : `your enrolment request has been approved for course : ${course.title}`
          })

          await newNotification.save()
          return res.status(200).json(updatedStudentReqEnrolment)

        }

        // to remove the course enrollment for this student if he was already approved before and the new status is rejected
        if(studentReqEnrolment.status === "approved" && newStatus === "rejected"){
          await Student.findByIdAndUpdate(studentId , {$pull : {coursesEnrolled : course._id}} , {new : true})
          await Course.findByIdAndUpdate(courseId , {$pull : {studentsEnrolled : studentId}} , {new : true})
          const newNotification = new Notification({
            from : req.user._id ,
            to : userDoc._id ,
            courseId ,
            type : "enrollment_request_rejected" , 
            message : `your enrolment request has been rejected for course : ${course.title}`
          })

          await newNotification.save()
          return res.status(200).json(updatedStudentReqEnrolment)
          
        }   

        res.status(200).json(updatedStudentReqEnrolment)

    } catch (error) {
      next(error)
    }

}




const getAllEnrolmentsRequestsForAdmin = async (req , res , next) => {

    try {
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        const allEnrolmentRequests = await StudentCourseRequest.find()
          .skip(skip)
          .limit(limit)
          .populate("courseId", "title")
          .populate("studentId", "name");
    
        const totalEnrolments = await StudentCourseRequest.countDocuments();

        res.status(200).json({
          totalEnrolments,
          totalPages: Math.ceil(totalEnrolments / limit),
          currentPage: page,
          enrolments: allEnrolmentRequests,
        });

    } catch (error) {
        next(error)
    }

}




// ADMIN USER CONTROLLERS

const getAllUsersByAdmin = async (req , res , next) => {

  const page = Number(req.query.page) || 1;
  const limit = 10
  const skip = (page - 1) * limit;

  try {
    
    const users = await User.find().skip(skip).limit(limit)
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users ,
      totalUsers ,
      page , 
      totalPages : Math.ceil(totalUsers / limit)
    });
  
  } catch (error) {
    next(error)  
  }

}




const getSingleUser = async (req , res , next) => {

  const {userId} = req.params

  try {
    
    const user = await User.findById(userId)

    if(!user){
      return next(createError("user not exist" , 404))
    }

    res.status(200).json(user)

  } catch (error) {
    next(error)    
  }

}




const createNewUser = async (req , res , next) => {

  const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    role: Joi.string().valid('student', 'instructor' , 'admin').required() ,
    age: Joi.number().integer().min(3).max(100).required()
    .when('role', {
      is: 'student',
      then: Joi.number().max(100), 
      otherwise: Joi.number().min(25)
    })
  })
  
  const {value , error} = userSchema.validate(req.body , {abortEarly : false})

  if (error) {
    return res.status(400).json({ errors: error.details })
  }

  try {
    
    const loggedInUser = req.user

    const { name, email, password, role, age , phone} = value

    if (role === "admin") {

      if (loggedInUser.role !== "admin" || !loggedInUser.adminOfAdmins) {
        return next(createError("Only an admin with the adminOfAdmins privilege can create a new admin user" , 403))
      }

    }

    const newUser = new User({
      name ,
      email ,
      password ,
      age ,
      phone ,
      role ,
      isInstructor: (role === 'instructor' || role === 'admin')  ? true : false ,
      isAccepted: role !== "instructor" ,
      isAdmin : role === "admin" ? true : false
    })

    await newUser.save()

    newUser.password = undefined

    let userDocument

    if (role === 'instructor' || role === 'admin') {

      userDocument = new Instructor({
        name,
        email,
        userObjRef: newUser._id,
        coursesTeaching: [],
      });
      
      await userDocument.save()

    } else if (role === 'student') {

      userDocument = new Student({
        name,
        age,
        userObjRef: newUser._id,
        coursesEnrolled: [],
      });

      await userDocument.save()

      let parentEmail = `${name.trim().replace(/\s+/g, '').toLowerCase()}@parent.com`

      const existingParent = await Parent.findOne({ email: parentEmail })

      if (existingParent) {
        parentEmail = `${name.trim().replace(/\s+/g, '').toLowerCase()}${Date.now()}@parent.com`
      }
  
      const parent = new Parent({
        name: `${name}'s Parent` , 
        email : parentEmail ,
        userObjRef : newUser._id ,
        studentsEnrolled : [userDocument._id] ,
      })

      await parent.save()

    }

    res.status(201).json(newUser)

  } catch (error) {
    next(error)
  }

}





// const importStudentsFromExcel = async (req, res, next) => {
//   try {
//     if (!req.files || !req.files.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const file = req.files.file;

//     const transporter = nodemailer.createTransport(
//       postmarkTransport({
//         auth: {
//           apiKey: "5098548c-6d4b-4370-8e7f-321ebd60eca0",
//         },
//       })
//     );

//     const workbook = XLSX.read(file.data, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const students = XLSX.utils.sheet_to_json(worksheet);

//     for (const studentData of students) {
//       const { Name, Email, Age, ParentName, ParentEmail, ParentAge } = studentData;

//       const trimmedName = Name ? Name.trim() : '';
//       const trimmedEmail = Email ? Email.trim() : '';
//       const trimmedParentName = ParentName ? ParentName.trim() : '';
//       const trimmedParentEmail = ParentEmail ? ParentEmail.trim() : '';
//       const trimmedParentAge = ParentAge ? ParentAge : null;

//       if (!trimmedName || !trimmedEmail || !Age || !trimmedParentName || !trimmedParentEmail || !trimmedParentAge) {
//         return res.status(400).json({ error: "Invalid data in Excel sheet" });
//       }

//       const existingStudentUser = await User.findOne({ email: trimmedEmail });

//       if (existingStudentUser) {
//         return res.status(400).json({ error: `Student email already exists: ${trimmedEmail}` });
//       }

//       const existingParentUser = await User.findOne({ email: trimmedParentEmail });

//       if (existingParentUser) {
//         return res.status(400).json({ error: `Parent email already exists: ${trimmedParentEmail}` });
//       }

//       const studentPassword = "student123@";
//       const parentPassword = "parent123@";

//       const newStudentUser = new User({
//         name: trimmedName,
//         email: trimmedEmail,
//         password: studentPassword,
//         role: "student",
//         age: Age,
//         isAccepted: true,
//       });

//       await newStudentUser.save();

//       const newStudent = new Student({
//         name: trimmedName,
//         age: Age,
//         userObjRef: newStudentUser._id,
//         coursesEnrolled: [],
//         parentId: null,
//       });

//       await newStudent.save();

//       const newParentUser = new User({
//         name: trimmedParentName,
//         email: trimmedParentEmail,
//         password: parentPassword,
//         role: "parent",
//         age: trimmedParentAge,
//         isAccepted: true,
//       });

//       await newParentUser.save();

//       const newParent = new Parent({
//         name: trimmedParentName,
//         email: trimmedParentEmail,
//         userObjRef: newParentUser._id,
//         studentsEnrolled: [newStudent._id],
//       });

//       await newParent.save();

//       newStudent.parentId = newParent._id;

//       await newStudent.save();

//       const emailOptions = [
//         {
//           from: process.env.EMAIL_USER,
//           to: trimmedEmail,
//           subject: "Your Login Credentials",
//           text: `Hello ${trimmedName},\n\nWelcome to our platform. Here are your login credentials:\n\nEmail: ${trimmedEmail}\nPassword: ${studentPassword}\n\nPlease log in and change your password after the first login.`,
//           html: `
//             <h3>Hello ${trimmedName},</h3>
//             <p>Welcome to our platform. Here are your login credentials:</p>
//             <ul>
//               <li><strong>Email:</strong> ${trimmedEmail}</li>
//               <li><strong>Password:</strong> ${studentPassword}</li>
//             </ul>
//             <p>Please log in and change your password after the first login.</p>
//           `,
//         },
//         {
//           from: process.env.EMAIL_USER,
//           to: trimmedParentEmail,
//           subject: "Your Login Credentials",
//           text: `Hello ${trimmedParentName},\n\nWelcome to our platform. Here are your login credentials:\n\nEmail: ${trimmedParentEmail}\nPassword: ${parentPassword}\n\nPlease log in and change your password after the first login.`,
//           html: `
//             <h3>Hello ${trimmedParentName},</h3>
//             <p>Welcome to our platform. Here are your login credentials:</p>
//             <ul>
//               <li><strong>Email:</strong> ${trimmedParentEmail}</li>
//               <li><strong>Password:</strong> ${parentPassword}</li>
//             </ul>
//             <p>Please log in and change your password after the first login.</p>
//           `,
//         },
//       ];

//       for (const emailOption of emailOptions) {
//         await transporter.sendMail(emailOption);
//       }
//     }

//     res.status(201).json({ message: "Students and Parents imported successfully" });
//   } catch (error) {
//     next(error);
//   }
// };






// Ensure proper email authentication using SPF, DKIM , and DMARC records

  const importStudentsFromExcel = async (req, res, next) => {

    try {

      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASSWORD 
        },
      })

      const file = req.files.file

      const workbook = XLSX.read(file.data, { type: "buffer" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const students = XLSX.utils.sheet_to_json(worksheet)

      
      for (const studentData of students) {

        const { Name, Email, Age, ParentName, ParentEmail, ParentAge} = studentData

        const trimmedName = Name ? Name.trim() : ''
        const trimmedEmail = Email ? Email.trim() : ''
        const trimmedParentName = ParentName ? ParentName.trim() : ''
        const trimmedParentEmail = ParentEmail ? ParentEmail.trim() : ''
        const trimmedParentAge = ParentAge ? ParentAge : null

        if (!trimmedName || !trimmedEmail || !Age || !trimmedParentName || !trimmedParentEmail || !trimmedParentAge) {
          return res.status(400).json({ error: "Invalid data in Excel sheet" })
        }

        const existingStudentUser = await User.findOne({ email: trimmedEmail })
        
        if (existingStudentUser) {
          return res.status(400).json({ error: `Student email already exists: ${trimmedEmail}` })
        }

        const existingParentUser = await User.findOne({ email: trimmedParentEmail })

        if (existingParentUser) {
          return res.status(400).json({ error: `Parent email already exists: ${trimmedParentEmail}` })
        }

        const studentPassword = "student123@"
        const parentPassword = "parent123@"

        const newStudentUser = new User({
          name: trimmedName,
          email: trimmedEmail,
          password: studentPassword,
          role: "student",
          age: Age,
          isAccepted: true,
        });

        await newStudentUser.save()

        const newStudent = new Student({
          name: trimmedName,
          age: Age,
          userObjRef: newStudentUser._id,
          coursesEnrolled: [],
          parentId: null,
        })

        await newStudent.save()

        const newParentUser = new User({
          name: trimmedParentName,
          email: trimmedParentEmail,
          password: parentPassword,
          role: "parent",
          age: trimmedParentAge,
          isAccepted: true,
        })
        
        await newParentUser.save()

        const newParent = new Parent({
          name: trimmedParentName,
          email: trimmedParentEmail,
          userObjRef: newParentUser._id,
          studentsEnrolled: [newStudent._id],
        })
        
        await newParent.save()

        newStudent.parentId = newParent._id

        await newStudent.save()

        const emailOptions = [
          {
            from: process.env.EMAIL_USER,
            to: trimmedEmail,
            subject: "Your Login Credentials",
            html: generateEmailHTML(trimmedName, trimmedEmail, studentPassword),

          },
          {
            from: process.env.EMAIL_USER,
            to: trimmedParentEmail,
            subject: "Your Login Credentials",
            html: generateEmailHTML(trimmedName, trimmedEmail, studentPassword),
          },
        ];

        for (const emailOption of emailOptions) {
          await transporter.sendMail(emailOption)
          console.log(`Email sent to ${emailOption.to}`)
        }

      }

      res.status(201).json({ message: "Students and Parents imported successfully with emails sent" })
    
    } catch (error) {
      console.error("Error during import:", error)
      next(error)
    }

  }





const updateUser = async (req, res, next) => {

  const { userId } = req.params
  const updates = req.body

  const updateSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    age: Joi.number().integer().min(3).max(100).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      // .when('role', {
      //   is: 'student',
      //   then: Joi.number().max(100),
      //   otherwise: Joi.number().min(25)
      // })
  });

  const { value, error } = updateSchema.validate(updates, { abortEarly: false })

  if (error) {
    return res.status(400).json({ errors: error.details })
  }

  try {
    const user = await User.findById(userId).select("+password")

    if (!user) {
      return next(createError("User not found", 404))
    }

    const studentRecord = await Student.findOne({ userObjRef: userId })
    const instructorRecord = await Instructor.findOne({ userObjRef: userId })
    const parentRecord = await Parent.findOne({ userObjRef: userId })

    let roleType = ""

    if (studentRecord) roleType = "student"
    else if (instructorRecord) roleType = "instructor"
    else if (parentRecord) roleType = "parent"

    if (value.password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(value.password, salt)
      value.password = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: value },
      { new: true }
    );

    updatedUser.password = undefined

    let roleSpecificUpdate = null

    if (roleType === "student") {

      roleSpecificUpdate = await Student.findOneAndUpdate(
        { userObjRef: userId },
        { $set: { name: value.name || studentRecord.name, age: value.age || studentRecord.age } },
        { new: true }
      );

    } else if (roleType === "instructor") {

      roleSpecificUpdate = await Instructor.findOneAndUpdate(
        { userObjRef: userId },
        { $set: { name: value.name || instructorRecord.name, email: value.email || instructorRecord.email } },
        { new: true }
      )

    } else if (roleType === "parent") {

      roleSpecificUpdate = await Parent.findOneAndUpdate(
        { userObjRef: userId },
        { $set: { name: value.name || parentRecord.name, email: value.email || parentRecord.email } },
        { new: true }
      );
    }

    return res.status(200).json({
      user: updatedUser,
      roleSpecificData: roleSpecificUpdate,
    })

  } catch (error) {
    next(error)
  }
when 
};




// TODO , NEEDS MORE TEST
const deleteUser = async (req, res, next) => {

  const { userId } = req.params
  const adminId = req.user._id

  try {

      const user = await User.findById(userId)

      if (!user) {
        return next(createError("User not found" , 404))
      }

      const admin = await User.findById(adminId)

      if (!admin || !admin.isAdmin) {
        return next(createError("Only an admin instructor can perform this action" , 401))
      }

      if (user.role === "instructor") {

      const instructor = await Instructor.findOne({ userObjRef: userId })

      if (instructor) {

        const instructorCourses = instructor.coursesTeaching;

        const adminInstructorObj = await Instructor.findOne({userObjRef : adminId})

        if(!adminInstructorObj){
          return next(createError("current admin is not an instructor" , 401))
        }

        const notificationOps = []

        for (const courseId of instructorCourses) {

          const course = await Course.findById(courseId).populate("studentsEnrolled");
      
            if (course) {

              for (const studentId of course.studentsEnrolled) {

                const student = await Student.findById(studentId);
      
                if (student) {

                  notificationOps.push({
                    insertOne: {
                      document: {
                        from: adminId, 
                        to: student.userObjRef, 
                        type: "instructor_changed", 
                        message: `The instructor for your course "${course.title}" has been removed. The new instructor is ${req.user.name}.`,
                      },
                    },

                  })

                }

              }

            }

          }

          await Course.updateMany(
            { _id: { $in: instructorCourses } },
            { $set: { instructorId: adminInstructorObj._id } }
          )

          await Instructor.findOneAndUpdate(
            { userObjRef: adminId },
            { $addToSet: { coursesTeaching: { $each: instructorCourses } } } 
          );

          if (notificationOps.length > 0) {
            await Notification.bulkWrite(notificationOps);
          }

          await Instructor.findOneAndDelete({ userObjRef: userId })

        } 

      }

      if (user.role === "student") {
        
        const studentDocObj = await Student.findOne({userObjRef : userId})

        if (!studentDocObj) {
          return next(createError("Student not found" , 404))
        }

        await Course.updateMany(
          { studentsEnrolled: studentDocObj._id },
          { $pull: { studentsEnrolled: studentDocObj._id } }
        )

        await Student.findOneAndDelete({ userObjRef: userId })
      
      }

      if (user.role === "parent") {
        await Parent.findOneAndDelete({ userObjRef: userId })
      }

      if (user.role === "admin") {
        
        if(!req.user.isAdmin || !req.user.adminOfAdmins){
          return(next(createError("you don't have access to delete admins" , 401)))
        }

        await User.findOneAndDelete({ userObjRef: userId })

      }

      await User.findByIdAndDelete(userId)

      res.status(200).json({ message: "User deleted successfully"})
  
    } catch (error) {
      next(error)
    }

}



const changeRole = async (req, res, next) => {

  const { userId } = req.params;
  const { role } = req.body;

  if (role !== "admin" && role !== "instructor") {
    return next(createError(400, "Role must be either 'admin' or 'instructor'"));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(createError("User not found" , 404));
    }

    if (user.role === role) {
      return next(createError(`User already has the role: ${role}` , 400));
    }

    // Update role and isAdmin dynamically
    user.role = role;
    user.isAdmin = role === "admin";

    await user.save(); 

    const newNotification = new Notification({
      from: req.user._id,
      to: userId,
      type: "user_role_updated",
      message: `Your role has been changed to ${role}`,
    });

    await newNotification.save();

    res.status(200).json({
      message: "Role updated successfully",
      user,
    })

  } catch (error) {
    next(error)
  }

}




const getAllUserLogs = async (req, res, next) => {

  const loggedInUserId = req.user.id
  const { userId } = req.params 
  
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {

    let logsQuery

    if (req.user.role === 'admin') {

      if (!userId) {
        return next(createError("Please provide a userId to fetch logs for", 400))
      }

      logsQuery = { userId }

    } else {
      logsQuery = { userId : loggedInUserId }
    }

    const scormLogs = await ScormLog.find(logsQuery)
      .skip((page - 1) * limit) 
      .limit(limit) 
      .sort({ createdAt: -1 })

    if (!scormLogs || scormLogs.length === 0) {
      return next(createError("No SCORM logs found for this user", 404))
    }

    const totalLogs = await ScormLog.countDocuments(logsQuery)
    const totalPages = Math.ceil(totalLogs / limit)

    res.status(200).json({
      page,
      totalPages,
      totalLogs,
      logs: scormLogs,
    });

  } catch (error) {
    next(error)
  }

}




const getSingleUserLog = async (req , res , next) => {

  const { userId , attachmentId } = req.params

  try {

    let logsQuery;

    if (req.user.role === 'admin') {

      if (!userId) {
        return next(createError("Please provide a userId to fetch logs for", 400));
      }

      const convertedAttachmentId = new ObjectId(attachmentId)
      logsQuery = { userId , attachement : convertedAttachmentId }

    } else {
      logsQuery = { userId : loggedInUserId }
    }
      
      const scormLog = await ScormLog.findOne(logsQuery);

      if(!scormLog){
        return next(createError("scorm log not exist" , 404))
      }

      res.status(200).json(scormLog);

  } catch (error) {
    next(error)
  }

}




// ADMIN COURSES CONTROLLERS

const changeCourseInstructor = async (req, res, next) => {

  const schema = Joi.object({
    newUserId: Joi.string().required()
  })

  const { value , error } = schema.validate(req.body)

  if (error) {
    return next(createError("Invalid input data", 400))
  }

  const { courseId } = req.params
  const { newUserId } = value

  try {

      if (req.user.role !== "admin") {
        return next(createError("You do not have permission to change the course instructor", 401))
      }

      const course = await Course.findById(courseId)

      if (!course) {
        return next(createError("Course not found", 404))
      }

      const newInstructor = await Instructor.findOne({ userObjRef: newUserId })

      if (!newInstructor) {
        return next(createError("The user is not an instructor", 404))
      }

      const notificationOps = []

      const currentInstructorId = course.instructorId

      if(newInstructor._id.toString() === course.instructorId.toString()){
        return next(createError("this instructor is already the course owner" , 400))
      }

      if (currentInstructorId && currentInstructorId.toString() !== newInstructor._id.toString()) {

        const currentInstructor = await Instructor.findById(currentInstructorId)
          
          if (currentInstructor) {
              
            currentInstructor.coursesTeaching = currentInstructor.coursesTeaching.filter(
              (id) => id.toString() !== courseId
            )
              
            await currentInstructor.save()

            notificationOps.push({
              insertOne: {
                document: {
                  from: req.user._id,
                  to: currentInstructor.userObjRef, 
                  type: "instructor_changed", 
                  message: `You have been removed as the instructor for the course "${course.title}".`,
                },
              },
            });

          }

      }

      if (!newInstructor.coursesTeaching.includes(courseId)) {
        newInstructor.coursesTeaching.push(courseId)
        await newInstructor.save()
      }

      course.instructorId = newInstructor._id
      await course.save()

      if (notificationOps.length > 0) {
        await Notification.bulkWrite(notificationOps);
      }

      res.status(200).json(course)

  } catch (err) {
    next(err)
  }
  
}


const getFilteredCourses = async (req , res , next) => {

  try {
      
      const {
          instructorId,
          noInstructor,
          startDate,
          endDate,
          title,
          minRate,
          maxRate ,
          page = 1,
          limit = 10
        } = req.query;
    
        let filter = {};
    
        // Filter by instructor ID
        if (instructorId) {
          filter.instructorId = instructorId;
        }
    
        // Filter by courses with no instructor
        if (noInstructor === 'true') {
          filter.instructorId = null;
        }
    
        // Filter by start date and/or end date
        if (startDate || endDate) {

          filter.$or = [];

          if (startDate) {
            filter.$or.push({ startDate: { $gte: new Date(startDate) } });
          }

          if (endDate) {
            filter.$or.push({ endDate: { $lte: new Date(endDate) } });
          }

        }
    

        // Filter by title (case-insensitive, partial match)
        if (title) {
          filter.title = { $regex: title , $options: 'i' };
        }
    

        // Filter by rate range
        if (minRate || maxRate) {

          filter.rate = {};

          if (minRate) {
            filter.rate.$gte = parseFloat(minRate);
          }

          if (maxRate) {
            filter.rate.$lte = parseFloat(maxRate);
          }

        }
    
        // Execute the query with the built filter
        const skip = (page - 1) * limit;

        // Execute the query with the built filter and pagination
        const courses = await Course.find(filter).skip(skip).limit(parseInt(limit)).select("-sections.items.attachments");
    
        // Get total count for pagination
        const totalCourses = await Course.countDocuments(filter);

        const totalPages = Math.ceil(totalCourses / limit);

          res.status(200).json({
          success: true,
          data: courses,
          pagination: {
              totalCourses,
              totalPages,
              currentPage: parseInt(page),
              limit: parseInt(limit)
              }
          });

  } catch (error) {
      next(error)
  }

}
  




const getAllCoursesWithInstructors = async (req , res , next) => {

  try {

    const courses = await Course.find({}).populate("instructorId")

    
    res.status(200).json({
      totalCourses: courses.length,
      courses,
    })

  } catch (error) {
    next(error)
  }

}





// ADMIN INSTRUCTOR CONTROLLERS


const getAllCoursesByAdmin = async(req , res , next) => {

  const getAllCoursesSchema = Joi.object({
    page : Joi.number().optional().default(1)  
  })

  const {value , error} = getAllCoursesSchema.validate(req.query , {abortEarly : false})

  if(error){
      return next(createError("Inavlid page query value" , 400))
  }

  const {page} = value
  const limit = 10
  const skip = (page - 1) * limit

  try {

      const totalCourses = await Course.countDocuments();

      const courses = await Course.find()
          .select("-studentsEnrolled -paymentCourses")
          .skip(skip)
          .limit(limit)

      res.status(200).json({
          courses ,
          page ,
          totalPages : Math.ceil(totalCourses / limit) ,
          totalCourses
      })

  } catch (error) {
      next(error)
  }

}




const getAllInstructors = async (req, res, next) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const allInstructors = await Instructor.find()
      .skip(skip)
      .limit(limit)
      .populate('userObjRef')

    const filteredInstructors = allInstructors.filter(instructor => {
      const user = instructor.userObjRef;  
      return user && user.role !== 'admin' && !user.isAccepted
    });

    const totalInstructors = await Instructor.countDocuments()

    res.status(200).json({
      totalInstructors,
      totalPages: Math.ceil(totalInstructors / limit),
      currentPage: page,
      allInstructors: filteredInstructors,
    })
    
  } catch (error) {
    next(error)
  }
};




const getAllInstructorsUsers = async (req , res , next) => {

  try {
    
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const allInstructors = await Instructor.find()
      .skip(skip)
      .limit(limit)
      .populate('userObjRef')

    const totalInstructors = await Instructor.countDocuments()

    const filteredInstructors = allInstructors.filter(instructor => {
      const user = instructor.userObjRef;  
      return user && user.role !== 'admin'
    })

    res.status(200).json({
      totalInstructors,
      totalPages: Math.ceil(totalInstructors / limit),
      currentPage: page,
      allInstructors : filteredInstructors,
    })

  } catch (error) {
    next(error)
  }

}





const acceptInstructorRegistration = async (req, res, next) => {

  const { instructorId } = req.params

  try {

    const instructor = await Instructor.findById(instructorId)

    if (!instructor) {
      return next(createError("Instructor not found", 404))
    }

    if (instructor.isAccepted) {
      return next(createError("Instructor is already approved", 400))
    }

    const instructorUserRecord = await User.findById(instructor.userObjRef)

    if (!instructorUserRecord) {
      return next(createError("Instructor not found", 404))
    }

    instructorUserRecord.isAccepted = true

    await instructorUserRecord.save()

    res.status(200).json(instructorUserRecord)

  } catch (error) {
    next(error)
  }

}






const getInstructorCourses = async (req , res , next) => {

  try {
      
      const page = parseInt(req.query.page) || 1
      
      const limit = 10

      const skip = (page - 1) * limit

      const instructor = await Instructor.findById(req.params.instructorId)

      if (!instructor) {
        return next(createError(`instructor with ID ${req.params.instructorId} does not exist`, 404))
      }

      const instructorCourses = await Course.find({ instructorId: req.params.instructorId })
      .skip(skip)
      .limit(limit)
      .select('-sections.items.attachments')

      const totalInstructorCourses = await Course.countDocuments({ instructorId : req.params.instructorId })
      
      res.status(200).json({
        totalInstructorCourses,
        totalPages: Math.ceil(totalInstructorCourses / limit),
        currentPage: page,
        instructorCourses
      })

  } catch (error) {
    next(error)
  }

}




const getStudentsInCourse = async (req , res , next) => {

  const { instructorId , courseId } = req.params

  const page = parseInt(req.query.page) || 1
  const limit = 10
  const skip = (page - 1) * limit

  try {
    
    const instructor = await Instructor.findById(instructorId)

    if (!instructor) {
      return next(createError(`Instructor with ID ${instructorId} does not exist`, 404))
    }

    const course = await Course.findOne({ _id: courseId , instructorId })
    .populate({
        path: 'studentsEnrolled',
        options: {
          skip: skip,
          limit: limit
        }
    });

    if (!course) {
      return next(createError(`Course with ID ${courseId} taught by instructor with ID ${instructorId} does not exist`, 404))
    }

    const totalStudentsCount = await Course.findById(courseId)
      .select('studentsEnrolled')
      .then(course => course.studentsEnrolled.length)

    res.status(200).json({
      courseId: course._id ,
      courseTitle: course.title ,
      totalStudents: totalStudentsCount ,
      totalPages: Math.ceil(totalStudentsCount / limit) ,
      currentPage: page , 
      students: course.studentsEnrolled
    })

  } catch (error) {
    next(error)  
  }

}



// needs some update , check , update its ui to match the new updates 
const createAndAssignCourse = async (req , res , next) => {

  const createCourseSchema = Joi.object({
    title : Joi.string().min(3).required() ,
    description : Joi.string().min(10).required() ,
    price : Joi.number().min(1).max(1000).required() ,
    startDate : Joi.string().required(),
    endDate : Joi.string().required(),
    instructorId : Joi.string().required() ,
    tags: Joi.string().optional(), 
    category: Joi.string().required(), 
  })

  const {value , error} = createCourseSchema.validate(req.body , {abortEarly : false})

  if(error){
    return next(createError("Invalid new course credentials" , 400))
  }

  try {
    
    const {title , price , startDate , endDate , instructorId , tags , category , description} = value

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    const today = new Date()

    today.setHours(0, 0, 0, 0);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return next(createError("Invalid date format", 400));
    }
    
    if (startDateObj < today) {
      return next(createError("Start date must be today or later", 400));
    }
  
    if (startDateObj >= endDateObj) {
      return next(createError("End date must be after the start date", 400));
    }

    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return next(createError("the Instructor not exist to asign the course for him", 404))
    }

    const isCourseExist = await Course.findOne({title})

    if(isCourseExist){
      return next(createError("Course title already exist" , 400))
    }

    let coursePic = null

    if (req.files && req.files.coursePic) {

      const file = req.files.coursePic
      const validExtensions = /jpeg|jpg|png/

      const extname = validExtensions.test(path.extname(file.name).toLowerCase())
      const mimetype = validExtensions.test(file.mimetype)

      if (!extname || !mimetype) {
        return next(createError("Only .jpeg, .jpg, .png formats are allowed types", 400))
      }

      const uploadDir = path.join(__dirname, "../uploads/images")

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }          

      const uploadPath = path.join(uploadDir, `${Date.now()}-${file.name}`)

      await file.mv(uploadPath)

      coursePic = `/uploads/images/${path.basename(uploadPath)}`

    }else{
      return next(createError("you must upload a course cover image" , 400))
    }

    const course = new Course({
      title ,
      price ,
      startDate ,
      endDate ,
      instructorId : instructor._id ,
      status : "approved" ,
      tags,
      description,
      coursePic,
      category
    })

    await course.save()

    if (req.user.role === "instructor" || req.user.role === "admin") {

      let courseOwnerStudentDoc = await Student.findOne({ userObjRef: req.user._id })
    
      if (courseOwnerStudentDoc) {

        if (!courseOwnerStudentDoc.coursesEnrolled.includes(course._id)) {
          courseOwnerStudentDoc.coursesEnrolled.push(course._id);
        }

      } else {

        courseOwnerStudentDoc = new Student({
          name: req.user.name,
          age: req.user.age,
          userObjRef: req.user._id,
          coursesEnrolled: [course._id],
        })

      }
    
      if (!course.studentsEnrolled.includes(courseOwnerStudentDoc._id)) {
        course.studentsEnrolled.push(courseOwnerStudentDoc._id);
      }
    
      await courseOwnerStudentDoc.save()

    }
    
    await Instructor.updateOne(
      {_id : instructor._id} ,
      {$push : {coursesTeaching : course._id}}
    )

    const newNotification = new Notification({
      from : req.user._id ,
      to : instructor.userObjRef ,
      type : "course_created",
      courseId : course._id ,
      message : `${course.title} created successfully by ${req.user.name} admin and asigned to you`
    })

    await newNotification.save()

    res.status(201).json(course)

  } catch (error) {
    next(error)    
  }

}




const approveOrDeclineCourse = async (req , res , next) => {

  const { courseId } = req.params
  const { action } = req.body

  try {
    
    if(!action){
      return next(createError("action is required", 400))
    }

    if (!["approve" , "decline"].includes(action)) {
      return next(createError("Invalid action", 400))
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found", 404))
    }

    if (action === "approve") {

      course.status = "approved"

      await Instructor.updateOne(
        { _id: course.instructorId },
        { $push: { coursesTeaching: course._id } }
      )

      const instructorRecord = await Instructor.findById(course.instructorId)
      
      if (!instructorRecord) {
        return next(createError("Instructor not found", 404))
      }

      course.extraInfo = ""

      await course.save()

      const newNotification = new Notification({
        from : req.user._id ,
        to : instructorRecord.userObjRef ,
        type : "course_created",
        courseId : course._id ,
        message : `${course.title} created successfully`
      })

      await newNotification.save()

      res.status(200).json({ message: "Course approved", course })

    } else if (action === "decline") {

      course.status = "declined"

      await course.save()

      res.status(200).json({ message: "Course declined", course })

    }

  } catch (error) {
    next(error)
  }
  
}




const declineReason = async (req , res , next) => {

  const {courseId} = req.params
  const {reason} = req.body

  try {

    if(!reason || reason.length === 0){
      return next(createError("you must provide a decline reason" , 400))
    }
    
    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found", 404))
    }

    course.extraInfo = reason
    course.status = "declined"

    await course.save()

    res.status(200).json({declineReason : course.extraInfo})

  } catch (error) {
    next(error)
  }

}






// ADMIN TICKETS CONTROLLERS


const getAllTickets = async (req , res , next) => {
    
  try {
      
      const page = parseInt(req.query.page) || 1
      
      const limit = 10

      const skip = (page - 1) * limit

      let allTickets = await Ticket.find().skip(skip).limit(limit).populate("userObjRef")
      
      allTickets = allTickets.filter(ticket => ticket !== undefined && ticket !== null)

      const totalTickets = await Ticket.countDocuments()

      res.status(200).json({
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
        currentPage: page,
        tickets: allTickets
      });    

  } catch (error) {
    next(error)
  }

}





const changeTicketStatus = async (req , res , next) => {

  try {
      
      const {ticketId} = req.params
      const {newTicketStatus} = req.body

      const ticket = await Ticket.findById(ticketId)

      if(!ticket){
        return next(createError(`Ticket with this id not exist ${ticketId}` , 404))
      }

      const validTicketStatus = ["pending" , "inProgress" , "closed"]

      if(!newTicketStatus){
        return next(createError(`you must provide a new ticket status` , 400))
      }

      if(!validTicketStatus.includes(newTicketStatus)){
        return next(createError(`${newTicketStatus} is not a valid ticket status` , 400))
      }

      ticket.status = newTicketStatus

      await ticket.save()
      
      res.status(200).json(ticket)

  } catch (error) {
    next(error)
  }

}






const supportTeamResponse = async (req , res , next) => {

  try {

    const {ticketId} = req.params
    const {supportText} = req.body

    const ticket = await Ticket.findById(ticketId)

    if(!ticket){
      return next(createError(`Ticket with this id not exist ${ticketId}` , 404))
    }
      
    if(!supportText){
      return next(createError(`you must provide the support text` , 400))
    }

    if(supportText.length > 300){
      return next(createError(`supportText must be less than 300 char` , 400))
    }

    ticket.supportTeamResponse = supportText

    await ticket.save()
      
    res.status(200).json(ticket)

  } catch (error) {
    next(error)
  }

}





const getFilteredTickets = async (req , res , next) => {

  try {
      
      const {status , regarding , userId , page = 1} = req.query

      const limit = 10;

      const skip = (page - 1) * limit

      let filterObj = {}

      const validTicketStatus = ["pending" , "inProgress" , "closed"]
      const validRegardingValues = ["content" , "technical"]

      if(status && validTicketStatus.includes(status)){
        filterObj.status = status
      }

      if(regarding && validRegardingValues.includes(regarding)){
        filterObj.regarding = regarding
      }

      if (userId) {
        filterObj.userObjRef = userId
      }

      const allTickets = await Ticket.find(filterObj).skip(skip).limit(limit).populate("userObjRef");

      const totalTickets = await Ticket.countDocuments(filterObj)

      res.status(200).json({
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
        currentPage: page,
        tickets: allTickets
      })

  } catch (error) {
    next(error)
  }

}





const deleteTicket = async (req, res, next) => {

  try {

    const { ticketId } = req.params

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      return next(createError(`Ticket with ID ${ticketId} does not exist`, 404))
    }

    await Ticket.findByIdAndDelete(ticketId)

    res.status(200).json({ message: 'Ticket deleted successfully' })

  } catch (error) {
    next(error)
  }
}




const getAllTechnicalTickets = async (req , res , next) => {

  try {
    
    const limit = 10;
    const page = Number(req.query.page) || 1
    const skip = (page - 1) * limit

    const tickets = await Ticket.find({ regarding: "technical" }).populate("userObjRef", "name email").skip(skip).limit(limit)

    const totalTickets = await Ticket.countDocuments({regarding : "technical"})

    res.status(200).json({
      totalTickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: page,
      tickets
    })

  } catch (error) {
    next(error)
  }

}




const getArchivedTickets = async (req , res , next) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = 10

    const skip = (page - 1) * limit

    let archivedTickets = await Ticket.find({ isArchived : true })
        .skip(skip)
        .limit(limit)

    archivedTickets = archivedTickets.filter(ticket => ticket !== undefined && ticket !== null)

    res.status(200).json(archivedTickets)

  } catch (error) {
    
  }

}




const getSummary = async (req, res, next) => {

  try {

    const totalUsers = await User.countDocuments()

    const enrolledUserIds = await Course.aggregate([
      {
        $unwind: "$studentsEnrolled",
      },
      {
        $group: {
          _id: null,
          uniqueStudentIds: { $addToSet: "$studentsEnrolled" }, 
        },
      },
    ])

    const enrolledUsersCount = enrolledUserIds.length > 0 ? enrolledUserIds[0].uniqueStudentIds.length : 0

    const notEnrolledUsers = totalUsers - enrolledUsersCount

    const totalCourses = await Course.countDocuments()

    res.status(200).json({
      totalUsers,
      enrolledUsers: enrolledUsersCount,
      notEnrolledUsers,
      totalCourses,
    })

  } catch (error) {
    next(error)
  }

}




const getTicketsSummary = async (req , res , next) => {

  try {
    
    const totalTickets = await Ticket.countDocuments()

    const ticketsSummary = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }, 
        },
      },
    ])

    const closedCount = ticketsSummary.find((item) => item._id === "closed")?.count || 0
    const pendingCount = ticketsSummary.find((item) => item._id === "pending")?.count || 0
    const inProgressCount = ticketsSummary.find((item) => item._id === "inProgress")?.count || 0

    res.status(200).json({
      totalTickets,
      closedCount ,
      pendingCount ,
      inProgressCount
    })

  } catch (error) {
    console.log(error)
  }

}




const getUsersPerMonth = async (req , res , next) => {

  try {
    
    const insights = await User.aggregate([
      {
        $match: { createdAt: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          userCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          userCount: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ])

    res.status(200).json(insights)

  } catch (error) {
    next(error)  
  }

}




const getCoursesPerMonth = async (req, res, next) => {

  try {

    const insights = await Course.aggregate([
      {
        $match: { createdAt: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          courseCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          courseCount: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ])

    res.status(200).json(insights)

  } catch (error) {
    next(error)
  }

}



// needs updates 
const getStudentsWith100PercentCompletion = async (req, res, next) => {

  try {

    const insights = await Lesson.aggregate([
      {
        $match: {
          lesson_status: { $in: ["completed", "passed"] }, 
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails",
      },
      {
        $group: {
          _id: { userId: "$userId", courseId: "$courseId" },
          totalAttachments: { $sum: { $size: "$courseDetails.sections.items.attachments" } },
          completedAttachments: { $sum: { $size: "$attachement" } },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          courseId: "$_id.courseId",
          totalAttachments: 1,
          completedAttachments: 1,
        },
      },
      {
        $match: {
          $expr: { $eq: ["$totalAttachments", "$completedAttachments"] },
        },
      },
    ])

    res.status(200).json({
      success: true,
      students: insights.map((insight) => ({
        userId: insight.userId,
        courseId: insight.courseId,
        totalAttachments: insight.totalAttachments,
        completedAttachments: insight.completedAttachments,
      })),
    })

  } catch (error) {
    next(error)
  }

}




const getSectionViewCount = async (req  , res , next) => {

  try {
    
    const { courseId , sectionId } = req.params

    if(!courseId || !sectionId){
      return next(createError("please provide all data" , 400))
    } 

    const result = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },
      { $unwind: "$sections" },
      {
        $match: {
          "sections._id": new mongoose.Types.ObjectId(sectionId),
        },
      },
      { $unwind: "$sections.views" },
      {
        $lookup: {
          from: "users", 
          localField: "sections.views.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          viewTimestamp: "$sections.views.timestamp",
        },
      },
    ])

    res.status(200).json(result)

  } catch (error) {
    next(error)
  }

}




const getAttachmentViewCount = async (req , res , next) => {

  try {
    
    const { courseId , sectionId , itemId , attachmentId } = req.params

    if(!courseId || !sectionId || !itemId || !attachmentId){
      return next(createError("please provide all data" , 400))
    } 

    const result = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $unwind: "$sections", 
      },
      {
        $match: {
          "sections._id": new mongoose.Types.ObjectId(sectionId), 
        },
      },
      {
        $unwind: "$sections.items", 
      },
      {
        $match: {
          "sections.items._id": new mongoose.Types.ObjectId(itemId), 
        },
      },
      {
        $unwind: "$sections.items.attachments", 
      },
      {
        $unwind: "$sections.items.views", 
      },
      {
        $match: {
          "sections.items.attachments._id": new mongoose.Types.ObjectId(attachmentId), 
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "sections.items.views.userId", 
          foreignField: "_id", 
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", 
      },
      {
        $group: {
          _id: null,
          users: { $addToSet: "$userDetails" }, 
        },
      },
      {
        $project: {
          _id: 0,
          users: 1, 
        },
      },
    ])
    
    const viewCount = result[0].users || []

    res.status(200).json(viewCount) 

  } catch (error) {
    next(error)  
  }

}




const getInstructorCoursesPerMonth = async (req , res , next) => {

  try {
    
    const { instructorId } = req.query // optional to make this route more specific (by instructor)

    const matchStage = instructorId ? { instructorId : new mongoose.Types.ObjectId(instructorId) } : {}

    const result = await Course.aggregate([
      {
        $match: matchStage, 
      },
      {
        $group: {
          _id: {
            instructorId: "$instructorId",
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" }, 
          },
          courseCount: { $sum : 1 }, 
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "_id.instructorId",
          foreignField: "_id",
          as: "instructorDetails",
        },
      },
      {
        $unwind: "$instructorDetails", 
      },
      {
        $project: {
          _id: 0,
          instructorId: "$_id.instructorId",
          instructorName: "$instructorDetails.name",
          year: "$_id.year",
          month: "$_id.month",
          courseCount: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 }, 
      },
    ])

    res.status(200).json(result)

  } catch (error) {
    next(error)
  }

}




const getDailySales = async (req, res, next) => {

  try {

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 1,
          sales: 1,
          revenue: { $round: ["$revenue", 2] }, 
        },
      },
      {
        $sort: { _id: -1 }, 
      },
    ])

    res.status(200).json(dailySales.length ? dailySales : [])

  } catch (error) {
    next(error)
  }

}




const getMonthlySales = async (req , res, next) => {

  try {
  
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          totalSales: { $round: ["$totalSales", 2] }, 
          totalOrders: 1,
          _id: 0, 
        },
      },
      {
        $sort: { month: -1 }, 
      },
    ]);

    res.status(200).json(monthlySales)

  } catch (error) {
    next(error)
  }

}




const getUsersWithCoursesAndLogs = async (req, res, next) => {

  try {

    const enrolledStudents = await Student.find({ 'coursesEnrolled.0': { $exists: true } })

    if (!enrolledStudents.length) {
      return next(createError("No users found with enrolled courses" , 404))
    }

    const users = await User.find({ _id: { $in: enrolledStudents.map(user => user.userObjRef) } })
    
    const students = await Student.find({ userObjRef: { $in: users.map(user => user._id) } })

    const userStudentMap = {}

    students.forEach(student => {

      if (!userStudentMap[student.userObjRef]) {
        userStudentMap[student.userObjRef] = []
      }

      userStudentMap[student.userObjRef].push(student)

    })

    const usersWithLogs = []

    for (const user of users) {

      const userStudents = userStudentMap[user._id] || []

      const courses = await Course.find({ studentsEnrolled: { $in: userStudents.map(student => student._id) } })

      if (courses.length > 0) {

        const courseLogs = await Lesson.find({ userId : user._id, courseId : { $in: courses.map(course => course._id) } })

        if (courseLogs.length > 0) {

          usersWithLogs.push({
            userId: user._id,
            userName: user.name,
          })

        }

      }

    }

    if (!usersWithLogs.length) {
      return next(createError("No users found with courses and logs", 404));
    }

    res.status(200).json(usersWithLogs)

  } catch (error) {
    next(error)
  }

}




const getCoursesForUser = async (req, res, next) => {

  try {

    const { userId } = req.params;

    const student = await Student.findOne({ userObjRef: userId })

    if (!student) {
      return next(createError("students not found", 404))
    }

    const courseIds = student.coursesEnrolled.map(course => course._id).flat()

    const courses = await Course.find({ _id: { $in: courseIds } })

    if (!courses.length) {
      return next(createError("No courses found for the selected user" , 404))
    }

    res.status(200).json(courses)
    
  } catch (error) {
    next(error)
  }

}









module.exports = {
  updateEnrolmentStatus , 
  getAllEnrolmentsRequestsForAdmin ,
  getAllUsersByAdmin ,
  getSingleUser ,
  createNewUser ,
  importStudentsFromExcel ,
  updateUser ,
  deleteUser ,
  changeRole ,
  getAllUserLogs ,
  getSingleUserLog ,
  getAllCoursesByAdmin ,
  changeCourseInstructor ,
  getFilteredCourses ,
  getAllCoursesWithInstructors ,
  getAllInstructors ,
  getAllInstructorsUsers ,
  acceptInstructorRegistration ,
  getInstructorCourses ,
  getStudentsInCourse ,
  createAndAssignCourse ,
  approveOrDeclineCourse ,
  declineReason ,
  getAllTickets ,
  changeTicketStatus ,
  supportTeamResponse ,
  getFilteredTickets ,
  deleteTicket ,
  getAllTechnicalTickets ,
  getArchivedTickets ,
  getSummary ,
  getTicketsSummary ,
  getUsersPerMonth ,
  getCoursesPerMonth ,
  getStudentsWith100PercentCompletion ,
  getInstructorCoursesPerMonth ,
  getSectionViewCount ,
  getAttachmentViewCount ,
  getDailySales ,
  getMonthlySales ,
  getUsersWithCoursesAndLogs ,
  getCoursesForUser
}