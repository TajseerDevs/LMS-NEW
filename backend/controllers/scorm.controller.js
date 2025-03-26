const upload = require("../middlewares/multer");
const createError = require("../utils/createError");
const path = require("path");
const unzipper = require("unzipper");
const fs = require("fs");
const ScormLog = require("../models/ScormLogSchema");
const User = require("../models/User");
const { Attachment } = require("../models/Attachment");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require('mongodb');
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Lesson = require("../models/ScormLogSchema");



    // needs more imp (to update the lesson_status on every time user solve the activity or when its lesson_status is completed or passed keep it as it)
    const setScormLogs = async (req, res, next) => {

      const { userId, attachmentId } = req.params
      const { cmi , contentCmi } = req.body
      
      let studentDoc

      try {

        const user = await User.findById(userId)
        
        if(!user){
          return next(createError("User not exist" , 404))
        }

        if(user.role === "student"){

          studentDoc = await Student.findOne({userObjRef : user._id})

          if(!studentDoc){
            return next(createError("Student not exist" , 404))
          }
          
        }

        const attachment = await Attachment.findById(attachmentId)

        if(!attachment){
          return next(createError("item attachment not exist" , 404))
        }

        const scormVersion = attachment.scormVersion;
    
        const interactions = Object.entries(cmi?.interactions || {}).map(([key, value]) => ({ key , ...value}))
    
        let lesson = await ScormLog.findOne({ userId, attachement: attachmentId })

        const attachementCourse = await Course.findById(attachment.courseId)

        if(!attachementCourse){
          return next(createError("attachment course not exist" , 404))          
        }
        
        const lessonData = {
          userId,
          student_id: scormVersion === '2004' ? cmi?.learner_id || '' : cmi?.core?.student_id || '' || contentCmi.student_id ,
          student_name: scormVersion === '2004' ? cmi?.learner_name || '' : cmi?.core?.student_name || '' || contentCmi.student_name,
          credit: scormVersion === '2004' ? cmi?.credit || '' : cmi?.core?.credit || '',
          lesson_status : scormVersion === '2004' ? cmi?.completion_status || cmi?.success_status || '' : cmi?.core?.lesson_status || '' || contentCmi.lesson_status,
          entry: scormVersion === '2004' ? cmi?.entry || '' : cmi?.core?.entry || '',
          lesson_mode: scormVersion === '2004' ? cmi?.mode || '' : cmi?.core?.lesson_mode || '',
          exit: scormVersion === '2004' ? cmi?.exit || '' : cmi?.core?.exit || '',
          duration: scormVersion === '2004' ? cmi?.total_time || cmi?.session_time || '' : cmi?.core?.session_time || '' || contentCmi.duration,
          score: {
            raw: scormVersion === '2004' ? cmi?.score?.raw || 0 : cmi?.core?.score?.raw || 0,
            min: scormVersion === '2004' ? cmi?.score?.min || 0 : cmi?.core?.score?.min || 0,
            max: scormVersion === '2004' ? cmi?.score?.max || 100 : cmi?.core?.score?.max || 100,
            scaled: scormVersion === '2004' ? cmi?.score?.scaled || null : null,
          },
          interactions,
          attachement: attachmentId,
          courseId : attachementCourse._id ,
          completionPercentage : contentCmi?.completionPercentage || 0
        }
    
        if (lesson) {

          const currentLessonStatus = lesson.lesson_status;

          if (currentLessonStatus === "passed" || currentLessonStatus === "completed") {
            lessonData.lesson_status = currentLessonStatus;
            return res.status(200).json({ msg: "Log data saved successfully." })
          }

          await lesson.updateOne(lessonData)

        } else {
          lesson = new ScormLog(lessonData)
          await lesson.save()
        } 

        if (!attachment.scormLog || attachment.scormLog.toString() !== lesson._id.toString()) {
          attachment.scormLog = lesson._id
          await attachment.save()
        }
    
        res.status(200).json({ msg: "Log data saved successfully." })

      } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Failed to save log data." })
      }

    }
    
    



    

    const getScormLogs = async (req, res, next) => {

        try {

            const { userId, attachmentId } = req.params;

            const user = await User.findById(userId)

            if (!user) {
              return next(createError("User does not exist", 404))
            }

            let scormLog = await ScormLog.findOne({ userId, attachement: attachmentId })

            if (!scormLog) {

                scormLog = new ScormLog({
                    userId,
                    student_id: user._id,  
                    student_name: user.name, 
                    interactions: [],  
                    lesson_status: "not_started", 
                    duration: "0", 
                    score: { raw: "0", min: "0", max: "100" },  
                    lesson_location: "",  
                    exit: "",  
                    attachement: attachmentId, 
                })

                await scormLog.save()

            }

            res.status(200).json({ success: true, scormLog })

        } catch (error) {
            next(error)
        }

    };




    const getUserAttachmentLogs = async (req , res , next) => {

        const { attachmentId } = req.params;

        try {
            
            const convertedAttachmentId = new ObjectId(attachmentId)
            const scormLog = await ScormLog.findOne({ userId : req.user._id , attachement : convertedAttachmentId });

            if(!scormLog){
                return next(createError("scorm log not exist" , 404))
            }

            res.status(200).json(scormLog);

        } catch (error) {
            next(error)
        }

    }



    
    const getAllUserLogs = async (req, res, next) => {

        const userId = req.user._id;

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
      
        try {

        const scormLogs = await ScormLog.find({ userId })
          .skip((page - 1) * limit) 
          .limit(limit) 
          .sort({ createdAt: -1 })
      
        if (!scormLogs || scormLogs.length === 0) {
            return next(createError("No SCORM logs found for this user", 404))
        }
      
        const totalLogs = await ScormLog.countDocuments({ userId })
        const totalPages = Math.ceil(totalLogs / limit)
      
        res.status(200).json({
          page,
          totalPages,
          totalLogs,
          logs: scormLogs,
        })

        } catch (error) {
          next(error)
        }

    }




    

const getStudentCourseLogs = async (req, res, next) => {

    const { courseId } = req.params
  
    try {

      const page = Number(req.query.page) || 1
      const limit = 10 
      const skip = (page - 1) * limit

      const student = await Student.findOne({
        userObjRef: req.user._id,
      })

      if (!student) {
        return next(createError("Student does not exist", 404))
      }
  
      const studentUserDoc = await User.findById(student.userObjRef)

      if (!studentUserDoc) {
        return next(createError("Student user document not found", 404))
      }
  
      const courseLogs = await Lesson.find({
        student_id: studentUserDoc._id,
        courseId: new mongoose.Types.ObjectId(courseId),
      }).limit(limit).skip(skip)

      const courseLogsTotalDoc = await Lesson.countDocuments({
        student_id: studentUserDoc._id,
        courseId: new mongoose.Types.ObjectId(courseId),
      })
  
      if (!courseLogs || courseLogs.length === 0) {
        return res.status(200).json({ message: "No logs found for this course" });
      }
  
      res.status(200).json({
        courseLogs ,
        page ,
        courseLogsTotalDoc ,
        totalPages : Math.ceil(courseLogsTotalDoc / limit)
      })

    } catch (error) {
      next(error)
    }

  }
  




    const getUserSpecificScormLog = async (req, res, next) => {

        const { userId , courseId , sectionId , itemId , attachmentId } = req.params
      
        try {

          const loggedInUserId = req.user._id.toString()
          const loggedInUserRole = req.user.role

          const course = await Course.findById(courseId)

          if (!course) {
            return next(createError("Course not found", 404))
          }
      
          if (loggedInUserRole === "student") {

            const student = await Student.findOne({ userObjRef: loggedInUserId })

            const isEnrolled = course.studentsEnrolled.some((studentId) => studentId.toString() === student._id.toString())
      
            if (!isEnrolled) {
              return next(createError("You are not enrolled in this course", 403))
            }
      
            if (userId !== loggedInUserId) {
              return next(createError("You are not authorized to view this log", 403))
            }

          }
      
          if (loggedInUserRole === "instructor") {

            const instructor = await Instructor.findOne({ userObjRef: loggedInUserId })

            if (!instructor) {
              return next(createError("Instructor not found", 404))
            }

            if (course.instructorId.toString() !== instructor._id.toString()) {
              return next(createError("You are not the instructor of this course", 403))
            }

          }
            
          const section = course.sections.find((sec) => sec._id.toString() === sectionId)

          if (!section) {
            return next(createError("Section not found", 404))
          }
      
          const item = section.items.find((item) => item._id.toString() === itemId)

          if (!item) {
            return next(createError("Item not found", 404))
          }
      
          const attachment = item.attachments.find((att) => att._id.toString() === attachmentId)

          if (!attachment) {
            return next(createError("Attachment not found", 404))
          }
      
          const convertedAttachmentId = new ObjectId(attachmentId)

          const scormLog = await ScormLog.findOne({
            userId,
            attachement: convertedAttachmentId,
          })
      
          if (!scormLog) {
            return next(createError("SCORM log not found for this user", 404))
          }
      
          res.status(200).json(scormLog)
      
        } catch (error) {
          next(error)
        }

      }
      





    module.exports = {setScormLogs , getScormLogs , getStudentCourseLogs , getUserAttachmentLogs , getAllUserLogs , getUserSpecificScormLog}















// const uploadScorm = async (req , res , next) => {

//     try {
        
//         upload(req, res, (err) => {
    
//             if (err) {
//               return next(createError("scorm upload failed" , 400))
//             }
        
//             const uploadedFilePath = path.join(
//               __dirname,
//               "../uploads",
//               req.file.filename
//             );
        
//             const extractDir = path.join(
//               __dirname,
//               "../uploads",
//               Date.now().toString()
//             );
        
//             // Extract the SCORM package
//             fs.createReadStream(uploadedFilePath)
//               .pipe(unzipper.Extract({ path: extractDir }))
//               .on("close", () => {
//                 const launchFileUrl = /uploads/${path.basename(extractDir)}/index_lms.html;
//                 res.redirect(/public/scorm-launcher.html?launchUrl=${encodeURIComponent(launchFileUrl)});
//               });
        
//           });

//     } catch (error) {
//         next(error)
//     }

// }