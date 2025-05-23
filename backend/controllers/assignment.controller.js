const Joi = require("joi")
const createError = require("../utils/createError")

const File = require("../models/File")
const User = require("../models/User")
const Course = require("../models/Course")
const Instructor = require("../models/Instructor")

const path = require("path")
const fs = require("fs")
const Assignment = require("../models/Assigment")
const Student = require("../models/Student")
const Submission = require("../models/Submission")




const getCourseLatestAssignments = async (req , res , next) => {

  try {
    
    const { courseId } = req.params

    const page = parseInt(req.query.page) || 1
    const limit = 3

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found", 404))
    }

    const assignments = await Assignment.find({ courseId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

    const assignmentIds = assignments.map((assignment) => assignment._id)

    const studentDoc = await Student.findOne({userObjRef : req.user._id})
    
    if(!studentDoc){
      return next(createError("student not exist" , 404))
    }
        
    const submissions = await Submission.find({
      studentId : studentDoc._id ,
      assignmentId: { $in: assignmentIds },
    }).select("assignmentId")

    const submittedAssignmentIds = new Set(submissions.map((submission) => submission.assignmentId.toString()))

    const assignmentsWithSubmission = assignments.map((assignment) => ({
      ...assignment,
      hasSubmission: submittedAssignmentIds.has(assignment._id.toString()),
    }))

    const totalAssignments = await Assignment.countDocuments({ courseId })

    res.status(200).json({
      page ,
      totalAssignments ,
      totalPages: Math.ceil(totalAssignments / limit) ,
      assignments: assignmentsWithSubmission , 
    })

  } catch (error) {
    next(error)
  }

}




const getInstructorAssigments = async (req , res , next) => {

    try {

      const page = parseInt(req.query.page) || 1
      const limit = 7

      const instructor = await Instructor.findOne({userObjRef : req.user._id})

      if (!instructor) {
        return next(createError("Instructor not exist" , 404))
      }

      const assignments = await Assignment.find({ createdBy: instructor._id })
      .skip((page - 1) * limit) 
      .limit(limit) 
      .populate('courseId') 
      .populate('submissions')

      const validAssignments = await Promise.all(
        assignments.map(async (assignment) => {
          const course = await Course.findById(assignment.courseId);
          return course ? assignment : null
        })
      )

      const filteredAssignments = validAssignments.filter((assignment) => assignment !== null)

      const validAssignmentsCount = await Assignment.countDocuments({
        createdBy: instructor._id,
        courseId: { $in: await Course.find({ _id: { $in: assignments.map(a => a.courseId) } }).distinct('_id') },
      });
      
      const totalPages = Math.ceil(validAssignmentsCount / limit)

      res.json({
        assignments: filteredAssignments,
        totalAssignments : validAssignmentsCount,
        totalPages,
        page,
      })

    } catch (error) {
      next(error)   
    }

}




const createAssignment = async (req , res , next) => {

    try {
        
        const { courseId } = req.params

        const course = await Course.findById(courseId)
  
        if (!course) {
          return next(createError("Course not found" , 404))
        }
  
        const userId = req.user._id
          
        const instructor = await Instructor.findOne({userObjRef : userId})
  
        if (!instructor) {
          return next(createError("Instructor not exist" , 404))
        }
  
        if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
          return next(createError("You are not the course instructor or admin to create a add new assigment" , 403))
        }

        const assignmentValidationSchema = Joi.object({
          title: Joi.string().min(3).required(),
          description: Joi.string().min(5).required(),
          mark : Joi.number().min(1).max(100).required() ,
          dueDate: Joi.date().required().greater('now').messages({
            "date.greater": `"due Date" must be later than the current date`,
          }), 
        })

        const { error , value } = assignmentValidationSchema.validate(req.body , {abortEarly : false})

        if (error) {
          return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
        }
      
        const { title , description , dueDate , mark } = value

        if (!req.files || !req.files.assignmentFile) {
          return next(createError("No assignment file uploaded" , 400))
        }

        const assignmentFile = req.files.assignmentFile
    
        const uploadDir = path.join(__dirname, "../uploads/assigments")

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const fileName = `${Date.now()}-${assignmentFile.name}`
        const filePath = path.join(uploadDir , fileName)

        const fileType = assignmentFile.mimetype
        const fileSize = assignmentFile.size

        const file = new File({
          originalName: assignmentFile.name,
          uniqueName: fileName,
          filePath,
          fileType,
          fileSize,
          user: req.user._id,
        })

        await assignmentFile.mv(filePath)

        await file.save()
        
        const assignment = new Assignment({
          courseId,
          title,
          description,
          assignmentFile: file._id, 
          dueDate,
          mark ,
          createdBy: instructor._id , 
        })

        await assignment.save()

        course.assignments.push(assignment._id)
        
        await course.save()

        res.status(201).json({
          message: "Assignment created successfully",
          assignment,
        })
      
    } catch (error) {
      next(error)   
    }

}




const checkAssignmentDueDate = async (req , res , next) => {

  try {
    
    const { assignmentId } = req.params
        
    const assignment = await Assignment.findById(assignmentId)
    
    if (!assignment) {
      return next(createError(`Assignment with this id ${assignmentId} not exist` , 404))
    }

    const currentDate = new Date()
    const isDuePassed = currentDate > assignment.dueDate

    res.status(200).json({ isDuePassed })

  } catch (error) {
    next(error)  
  }

}




const getStudentAssigmentsSubmissions = async (req , res , next) => {

  try {
    
    const { courseId , userId } = req.params

    const assignments = await Assignment.find({ courseId })
    .populate({
      path: "createdBy",
      populate: {
        path: "userObjRef", 
        model: "users",
      },
    })
    .populate("assignmentFile")

    if (!assignments.length) {
      return next(createError("No assignments found for this course" , 200))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))      
    }

    const assignmentsWithSubmissions = await Promise.all(

      assignments.map(async (assignment) => {

        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId : studentDoc._id,
        }).populate("submissionFile");

        return {
          ...assignment.toObject(),
          studentSubmission: submission || null,
        }

      })

    )

    res.json(assignmentsWithSubmissions)

  } catch (error) {
    next(error)   
  }

}




const submitAssignmentSubmission = async (req , res , next) => {

    try {
        
        const { assignmentId , courseId } = req.params

        const course = await Course.findById(courseId)

        if(!course) {
          return next(createError("Course not found" , 404))
        }

        const studentDocObj = await Student.findOne({ userObjRef : req.user._id })

        if(!studentDocObj) {
          return next(createError("student not found" , 404))
        }

        const isEnrolled = course.studentsEnrolled.some((id) => id.toString() === studentDocObj._id.toString())

        if(!isEnrolled) {
          return next(createError("You are not enrolled in this course , you can't add assigment submission" , 401))
        }

        const assignment = await Assignment.findById(assignmentId)
        
        if(!assignment) {
          return next(createError("Assignment not found", 404))
        }

        if(new Date() > new Date(assignment.dueDate)) {
          return next(createError(`The assignment is past its due date of ${assignment.dueDate.toLocaleString()}` , 400))
        }

        const existingSubmission = await Submission.findOne({
          assignmentId,
          studentId : studentDocObj._id ,
        })
        
        if(existingSubmission) {
          return next(createError("You have already submitted this assignment", 400))
        }

        if (!req.files || !req.files.submissionFile) {
          return next(createError("No submission file uploaded", 400))
        }
      
        const submissionFile = req.files.submissionFile
        const uploadDir = path.join(__dirname, "../uploads/submissions")

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive : true })
        }

        const fileName = `${Date.now()}-${submissionFile.name}`
        const filePath = path.join(uploadDir , fileName)
    
        const fileType = submissionFile.mimetype
        const fileSize = submissionFile.size

        const answerText = req.body["answerText"]?.trim() || null

        if (answerText !== null && answerText.length < 1) {
          return next(createError("Assignment answer must be more than one char", 400))
        }

        const file = new File({
          originalName: submissionFile.name,
          uniqueName: fileName,
          filePath,
          fileType,
          fileSize,
          user: req.user._id,
        })
      
        await submissionFile.mv(filePath)

        await file.save()

        const submission = new Submission({
          assignmentId,
          studentId : studentDocObj._id ,
          submissionFile: file._id,
          answerText 
        })
      
        await submission.save()

        assignment.submissions.push(submission._id)
        
        await assignment.save()
    
        res.status(201).json({
          message: "Assignment submitted successfully",
          submission ,
        })

    } catch (error) {
      next(error)   
    }

}




const updateSubmission = async (req , res , next) => {

  try {
    
    const { assignmentId , submissionId } = req.params;

    const submissionFile = req.files?.submissionFile
    const answerText = req.body["answerText"]?.trim() || null

    const studentDocObj = await Student.findOne({ userObjRef : req.user._id })

    if(!studentDocObj) {
      return next(createError("student not found" , 404))
    }

    if (answerText !== null && answerText.length < 1) {
      return next(createError("Assignment answer must be more than one char", 400))
    }
    
    let submission = await Submission.findOne({ assignmentId , _id : submissionId , studentId : studentDocObj._id }).populate('submissionFile')

    if (!submission) {
      return next(createError("Previous Submission not exist" , 404))
    }

    if (submissionFile) {

      const uploadDir = path.join(__dirname, "../uploads/submissions")

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const fileName = `${Date.now()}-${submissionFile.name}`
      const filePath = path.join(uploadDir, fileName)

      if (submission.submissionFile) {

        const oldFile = await File.findById(submission.submissionFile._id)

        if (oldFile) {

          const oldFilePath = path.join(__dirname, "..", "uploads", "submissions", oldFile.uniqueName)
            
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath)
          }

          await oldFile.deleteOne()

        }

      }

      const file = new File({
        originalName: submissionFile.name,
        uniqueName: fileName,
        filePath,
        fileType: submissionFile.mimetype,
        fileSize: submissionFile.size,
        user: req.user._id,
      })

      await submissionFile.mv(filePath)
      await file.save()

      submission.submissionFile = file._id

    }

    if (answerText) {
      submission.answerText = answerText
    }

    const updatedSubmission = await submission.save()

    return res.status(200).json({
      message: 'Submission updated successfully' ,
      submission: updatedSubmission ,
    })

  } catch (error) {
    next(error)
  }

}




const getAssignmentSubmission = async (req , res , next) => {

  try {
    
    const { assignmentId } = req.params

    const studentDocObj = await Student.findOne({ userObjRef: req.user._id })

    if (!studentDocObj) {
      return next(createError("Student not found", 404))
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId: studentDocObj._id,
    }).populate("submissionFile"  , "-filePath -fileSize -fileType")

    if (!submission) {
      return res.status(200).json({ msg : "This assignment has no previous submission" })
    }

    const submissionFile = submission.submissionFile

    
    if (submissionFile) {
      const filePath = `/uploads/submissions/${submissionFile.uniqueName}`      
      submissionFile.filePath = filePath
    }

    res.status(200).json(submission)

  } catch (error) {
    next(error)
  }

} 




const viewStudentSubmission = async (req , res , next) => {

    try {
        
        const { assignmentId , userId } = req.params
        const loggedUserId = req.user._id

        const assignment = await Assignment.findById(assignmentId)

        if (!assignment) {
          return next(createError("Assignment not found" , 404))
        }

        const course = await Course.findById(assignment.courseId)
        
        if (!course) {
          return next(createError("No Course found for this assignment" , 404))
        }

        const instructor = await Instructor.findOne({userObjRef : loggedUserId})

        if (course.instructorId.toString() !== instructor._id.toString() && assignment.createdBy.toString() !== instructor._id.toString() && req.user.role !== "admin") {
          return next(createError("You are not authorized to view any assigment submissions" , 403))
        }

        const studentDocObj = await Student.findOne({userObjRef : userId})

        if (!studentDocObj) {
          return next(createError(`No Student found with this id ${userId}` , 404))
        }

        const submission = await Submission.findOne({ assignmentId , studentId : studentDocObj._id }).populate("submissionFile")

        if (!submission) {
          return next(createError("No submission found for this student" , 404))
        }

        const file = submission.submissionFile

        res.status(200).json({
          message: "Submission retrieved successfully",
          fileDownloadLink: `/uploads/submissions/${file.uniqueName}` ,
        })
        
    } catch (error) {
        next(error)   
    }

}




const addMarksToSubmission = async (req , res , next) => {

    try {

      const { assignmentId , userId } = req.params

      const { marks , feedback } = req.body

      const loggedUserId = req.user._id

      const convertedMark = Number(marks)
    
      if (!marks) {
        return next(createError("No marks provided for this submission" , 400))
      }

      if (typeof convertedMark !== "number" || marks < 0) {
        return next(createError("Marks must be a non-negative number" , 400))
      }

      const assignment = await Assignment.findById(assignmentId)

      if (!assignment) {
        return next(createError("Assignment not found" , 404))
      }

      if (convertedMark > assignment.mark) {
        return next(createError("provided marks are bigger than the assigment max mark" , 400))
      }
    
      const course = await Course.findById(assignment.courseId)
        
      if (!course) {
        return next(createError("No Course found for this assignment" , 404))
      }

      const instructor = await Instructor.findOne({userObjRef : loggedUserId})

      if (course.instructorId.toString() !== instructor._id.toString() && assignment.createdBy.toString() !== instructor._id.toString() && req.user.role !== "admin") {
        return next(createError("You are not authorized to view any assigment submissions" , 403))
      }

      const studentDocObj = await Student.findOne({userObjRef : userId})

      if (!studentDocObj) {
        return next(createError(`No Student found with this id ${userId}` , 404))
      }

      const submission = await Submission.findOne({ assignmentId , studentId : studentDocObj._id })

      if (!submission) {
        return next(createError("Submission not found for this student" , 404))
      }

      submission.marks = convertedMark
      submission.isGraded = true
        
      if (feedback) {
        submission.feedback = feedback
      }

      await submission.save()

      res.status(200).json({
        message: "Marks and feedback updated successfully",
        submission
      })

    } catch (error) {
      next(error)   
    }

}




const updateAssignmentSubmission = async (req , res , next) => {

    try {
        
        const { assignmentId } = req.params

        const assignment = await Assignment.findById(assignmentId)

        if (!assignment) {
          return next(createError("Assignment not found" , 404))
        }

        const course = await Course.findById(assignment.courseId)

        if(!course) {
          return next(createError("Course not found" , 404))
        }

        const studentDocObj = await Student.findOne({ userObjRef : req.user._id })

        if(!studentDocObj) {
          return next(createError("student not found" , 404))
        }

        const isEnrolled = course.studentsEnrolled.some((id) => id.toString() === studentDocObj._id.toString())

        if(!isEnrolled) {
          return next(createError("You are not enrolled in this course , you can't add assigment submission" , 401))
        }

        if(new Date() > new Date(assignment.dueDate)) {
          return next(createError(`The assignment is past its due date of ${assignment.dueDate.toLocaleString()}` , 400))
        }

        if (!req.files || !req.files.submissionFile) {
          return next(createError("No new submission file uploaded" , 400))
        }
        
        const submission = await Submission.findOne({ assignmentId, studentId: studentDocObj._id })
        
        if (!submission) {
          return next(createError("Submission not found" , 404))
        }

        if (submission.studentId.toString() !== studentDocObj._id.toString()) {
          return next(createError("You are not authorized to update this submission" , 403))
        }

        const file = await File.findById(submission.submissionFile)
        
        if (!file) {
          return next(createError("Previous submission file not found" , 404))
        }

        const submissionFile = req.files.submissionFile

        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath)
        }

        await File.findByIdAndDelete(file._id)

        await Assignment.updateOne(
          { _id: assignmentId },
          { $pull: { submissions: submission._id } }
        )

        const uploadDir = path.join(__dirname, "../uploads/submissions")

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const fileName = `${Date.now()}-${submissionFile.name}`
        const filePath = path.join(uploadDir, fileName)
    
        await submissionFile.mv(filePath)

        const newFile = new File({
          originalName : submissionFile.name,
          uniqueName : fileName ,
          filePath ,
          fileType : submissionFile.mimetype ,
          fileSize : submissionFile.size ,
          user : req.user._id ,
        })
      
        await newFile.save()
        
        submission.submissionFile = newFile._id

        submission.submittedAt = new Date()

        await submission.save()
        
        await Assignment.updateOne(
          { _id: assignmentId },
          { $push: { submissions : submission._id } }
        )

        res.status(200).json({
          message: "Submission file updated successfully",
          submission,
        })

    } catch (error) {
        next(error)   
    }

}




const deleteSubmissionFile = async (req , res , next) => {

    try {
        
      const { assignmentId } = req.params

      const assignment = await Assignment.findById(assignmentId)
        
      if (!assignment) {
        return next(createError("Assignment not found" , 404))
      }

      const course = await Course.findById(assignment.courseId)

      if(!course) {
        return next(createError("Course not found" , 404))
      }

      const studentDocObj = await Student.findOne({ userObjRef : req.user._id })

      if(!studentDocObj) {
        return next(createError("student not found" , 404))
      }

      const isEnrolled = course.studentsEnrolled.some((id) => id.toString() === studentDocObj._id.toString())

      if(!isEnrolled) {
        return next(createError("You are not enrolled in this course , you can't add assigment submission" , 401))
      }

      if(new Date() > new Date(assignment.dueDate)) {
        return next(createError(`The assignment is past its due date of ${assignment.dueDate.toLocaleString()}` , 400))
      }

      const submission = await Submission.findOne({
        assignmentId,
        studentId : studentDocObj._id ,
      })

      if (!submission) {
        return next(createError("Submission not found", 404))
      }
      
      if (submission.studentId.toString() !== studentDocObj._id.toString()) {
        return next(createError("You are not authorized to update this submission" , 403))
      }

      const file = await File.findById(submission.submissionFile)
        
      if (!file) {
        return next(createError("Submission file not found" , 404))
      }

      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath)
      }
      
      await File.findByIdAndDelete(file._id)

      await Submission.findByIdAndDelete(submission._id)

      await Assignment.updateOne(
        { _id : assignmentId },
        { $pull: { submissions : submission._id } }
      )

      res.status(200).json({message : "Submission file deleted successfully"})

    } catch (error) {
      next(error)   
    }

}




const getAllStudentsSubmissions = async (req , res , next) => {

  try {
    
    const { assignmentId } = req.params

    const page = Number(req.query.page) || 1
    const limit = 10

    const assignment = await Assignment.findById(assignmentId)
        
    if (!assignment) {
      return next(createError("Assignment not found" , 404))
    }

    const course = await Course.findById(assignment.courseId)

    if(!course) {
      return next(createError("Course not found" , 404))
    }

    const studentDocObj = await Student.findOne({ userObjRef : req.user._id })

    if(!studentDocObj) {
      return next(createError("student not found" , 404))
    }

    const isEnrolled = course.studentsEnrolled.some((id) => id.toString() === studentDocObj._id.toString())

    if(!isEnrolled) {
      return next(createError("You are not enrolled in this course , you can't add assigment submission" , 401))
    }

    const instructor = await Instructor.findOne({userObjRef : req.user._id})

    if (course.instructorId.toString() !== instructor._id.toString() && assignment.createdBy.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not authorized to view any assigment submissions" , 403))
    }

    const startIndex = (page - 1) * limit

    const totalSubmissions = assignment.submissions.length

    const submissionsToFetch = assignment.submissions.slice(
      startIndex,
      startIndex + limit
    )

    const populatedSubmissions = await Promise.all(submissionsToFetch.map(async (submissionId) => {

      const submission = await Submission.findById(submissionId)
        .populate({
          path: "studentId",
          populate: {
            path: "userObjRef",
            select: "firstName lastName profilePic"
          },
          select: "userObjRef"
        })
        .populate("submissionFile", "originalName filePath fileType uniqueName");

        const filePath = `/uploads/submissions/${submission.submissionFile.uniqueName}`

        return {
          ...submission.toObject(),
          assignment : assignment.title ,
          submissionFile: {
            ...submission.submissionFile.toObject(),
            filePath ,
          }, 
        }
      })

    )

    res.status(200).json({
      message: "Submissions retrieved successfully",
      currentPage: page,
      totalPages: Math.ceil(totalSubmissions / limit),
      totalSubmissions,
      submissions: populatedSubmissions,
    })
    
  } catch (error) {
    next(error)   
  }

}




const getAllStudentAssignmentsSubmissions = async (req , res , next) => {

  try {
    
    const { courseId , userId } = req.params
    const loggedUserId = req.user._id

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const instructor = await Instructor.findOne({userObjRef : loggedUserId})

    if(!instructor){
      return next(createError("instructor not exist" , 404))
    }

    const course = await Course.findById(courseId)

    if(!course) {
      return next(createError("Course not found" , 404))
    }

    const studentDocObj = await Student.findOne({ userObjRef : userId })

    if(!studentDocObj) {
      return next(createError("student not found" , 404))
    }

    const assignments = await Assignment.find({courseId , createdBy : instructor._id})

    if (course.instructorId.toString() !== instructor._id.toString() && req.user.role !== "admin") {
      return next(createError("You are not authorized to view any student assigments submissions" , 403))
    }

    const hasInvalidAssignments = assignments.some((assignment) => assignment.createdBy.toString() !== instructor._id.toString())

    if (hasInvalidAssignments && req.user.role !== "admin") {
      return next(createError("You are not authorized to view these assignment submissions" , 403))
    }

    const assignmentIds = assignments.map(a => a._id)

    const totalSubmissions = await Submission.countDocuments({
      assignmentId: { $in: assignmentIds },
      studentId: studentDocObj._id
    })

    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds },
      studentId: studentDocObj._id
    })
      .populate("assignmentId", "title dueDate")
      .populate("studentId", "userObjRef")
      .populate("submissionFile", "originalName filePath fileType uniqueName")
      .skip(skip)
      .limit(limit)
      .lean()


    const enhancedSubmissions = submissions.map((submission) => ({
      ...submission,
      submissionFile: {
        ...submission.submissionFile ,
        filepath : `/uploads/submissions/${submission.submissionFile?.uniqueName || ""}` 
      }
    }))
  
    res.status(200).json({
      totalSubmissions,
      currentPage: page,
      totalPages: Math.ceil(totalSubmissions / limit),
      submissions : enhancedSubmissions
    })

  } catch (error) {
    next(error)   
  }

}




const getAssignmentDetails = async (req , res , next) => {

  try {
    
    const { assignmentId } = req.params

    const assignment = await Assignment.findById(assignmentId).populate("courseId" , "title description").populate("assignmentFile", "originalName filePath fileType uniqueName")

    
    if (!assignment) {
      return next(createError("Assignment not found" , 404))
    }

    if (assignment.assignmentFile) {
      filePath = `/uploads/assigments/${assignment.assignmentFile.uniqueName}`
    }

    const assignmentDetails = {
      _id: assignment._id ,
      title: assignment.title ,
      description: assignment.description ,
      dueDate: assignment.dueDate ,
      course: assignment.courseId  , 
      totalSubmissions: assignment.submissions.length ,
      mark : assignment.mark ,
      file: assignment.assignmentFile
      ? {
          originalName: assignment.assignmentFile.originalName,
          fileType: assignment.assignmentFile.fileType,
          filePath,
        }
      : null    
    }

    res.status(200).json(assignmentDetails)

  } catch (error) {
    next(error)   
  }

}






module.exports = {
  getCourseLatestAssignments ,
  getInstructorAssigments ,
  createAssignment , 
  checkAssignmentDueDate ,
  getStudentAssigmentsSubmissions ,
  submitAssignmentSubmission , 
  updateSubmission ,
  getAssignmentSubmission ,
  viewStudentSubmission , 
  addMarksToSubmission ,
  updateAssignmentSubmission ,
  deleteSubmissionFile ,
  getAllStudentsSubmissions ,
  getAllStudentAssignmentsSubmissions ,
  getAssignmentDetails
}