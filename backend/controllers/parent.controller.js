const Course = require("../models/Course")
const Parent = require("../models/Parent")
const Lesson = require("../models/ScormLogSchema")
const Student = require("../models/Student")
const User = require("../models/User")
const createError = require("../utils/createError")
const { ObjectId } = require('mongodb');
const Joi = require("joi")



const getMyStudents = async (req , res , next) => {

    const parentId = req.user._id

    try {
        
        const parent = await Parent.findOne({ userObjRef: parentId })

        if (!parent) {
            return next(createError("Parent not exist" , 404))
        }

        const students = await Student.find({ parentId : parent._id }).populate("userObjRef")

        res.status(200).json(students)

    } catch (error) {
        next(error)
    }

}




const getSpecificStudentLog = async (req , res , next) => {

    const parentId = req.user._id
    const { studentId , attachmentId } = req.params
 
    try {   
        
        const parent = await Parent.findOne({ userObjRef: parentId })

        if (!parent) {
            return next(createError("Parent not exist" , 404))
        }

        const student = await Student.findOne({ _id : studentId , parentId : parent._id.toString()})

        if (!student) {
            return next(createError("student not exist" , 404))
        }

        const studentUserDoc = await User.findById(student.userObjRef)

        const convertedAttachmentId = new ObjectId(attachmentId)

        const studentLogs = await Lesson.findOne({ student_id: studentUserDoc._id , attachement : convertedAttachmentId })

        res.status(200).json(studentLogs)

    } catch (error) {
        next(error)
    }

}




// const getStudentCourseLogs = async (req, res, next) => {

//     const parentId = req.user._id

//     const { studentId, courseId } = req.params
  
//     try {

//       const parent = await Parent.findOne({ userObjRef: parentId })

//       if (!parent) {
//         return next(createError("Parent does not exist", 404))
//       }
  
//       const student = await Student.findOne({
//         _id: studentId,
//         parentId: parent._id.toString(),
//       });

//       if (!student) {
//         return next(createError("Student does not exist", 404))
//       }
  
//       const studentUserDoc = await User.findById(student.userObjRef)

//       if (!studentUserDoc) {
//         return next(createError("Student user document not found", 404))
//       }
  
//       const courseLogs = await Lesson.find({
//         student_id: studentUserDoc._id,
//         courseId: new mongoose.Types.ObjectId(courseId),
//       })
  
//       if (!courseLogs || courseLogs.length === 0) {
//         return res.status(404).json({ message: "No logs found for this course" });
//       }
  
//       res.status(200).json(courseLogs)

//     } catch (error) {
//       next(error)
//     }

//   }
  




const getParentStudentsCourses = async (req , res , next) => {

    const parentId = req.user._id
    const {studentId} = req.params

    try {
        
        const parent = await Parent.findOne({ userObjRef: parentId })

        if (!parent) {
            return next(createError("Parent not exist" , 404))
        }

        const student = await Student.findById(studentId)

        const courses = await Course.find({ studentsEnrolled: { $in: student._id } })

        res.status(200).json(courses)

    } catch (error) {
        next(error)
    }

}




const assignStudentsToParent = async (req , res , next) => {

    try {
        
        const parent = await Parent.findOne({userObjRef : req.user._id})

        if (!parent) {
          return next(createError(`Parent not found`, 400))
        }

        const assignStudentsSchema = Joi.object({
            students: Joi.array()
              .items(
                Joi.object({
                  studentId: Joi.string().required(),
                  fullName: Joi.string().required(),
                  educationLevel: Joi.string().valid("K-12", "university", "training").required(),
                  specialNeeds: Joi.boolean().default(false),
                  relation: Joi.object({
                    role: Joi.string().valid("father", "mother", "guardian").required(),
                    emergencyNumber: Joi.string().pattern(/^\+[0-9]+$/).required(),
                    emergencyEmail: Joi.string().email().required()
                  }).required()
                })
            )
            .required(),
        })

        const { error , value } = assignStudentsSchema.validate(req.body , {abortEarly : false})

        if (error) {
            return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
        }

        const {students} = value
          
        const studentsEnrolled = await Promise.all(students.map(async (studentData) => {

            const studentUserObj = await User.findById(studentData.studentId)
            
            const student = await Student.findOne({userObjRef : studentUserObj._id})

            if (!student) {
                return next(createError(`Student with ID ${studentData.studentId} not found` , 400))
            }

            const alreadyAssigned = parent.studentsEnrolled?.filter((s) => s && s.studentId).some((s) => s.studentId.toString() === studentData.studentId)

            if (alreadyAssigned) {
                return next(createError(`Student with ID ${studentData.studentId} is already added as parent child` , 400))
            }            
      
            student.parentId = parent._id

            await student.save()
      
            return {
                studentId: studentData.studentId,
                fullName: studentData.fullName,
                educationLevel: studentData.educationLevel,
                relation: {
                  role: studentData.relation.role,
                  emergencyNumber: studentData.relation.emergencyNumber, 
                  emergencyEmail: studentData.relation.emergencyEmail,
                },
            }

          })

        )

        parent.studentsEnrolled = studentsEnrolled

        await parent.save()

        res.status(200).json({
            success: true,
            message: "Students successfully assigned to parent",
            parent ,
        })

    } catch (error) {
        next(error)
    }

}




const getChildInfo = async (req , res , next) => {

    try {
        
        const {childId} = req.params

        const parent = await Parent.findOne({userObjRef : req.user._id})

        if (!parent) {
          return next(createError(`Parent not found` , 400))
        }

        const student = await Student.findOne({userObjRef : childId}).populate("userObjRef")
        
        if (!student) {
            return next(createError(`Student not found` , 400))
        }

        const userObj = student.userObjRef.toObject()

        const { cartItems , ...rest } = userObj

        const existChild = parent.studentsEnrolled.find(student => student.studentId.toString() === childId)

        res.status(200).json({ child: rest , existChild })

    } catch (error) {
        next(error)        
    }

}





module.exports = {
    getMyStudents , 
    getSpecificStudentLog , 
    getParentStudentsCourses , 
    assignStudentsToParent ,
    getChildInfo
}





// const validateRequest = (schema) => (req, res, next) => {
//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({ success: false, errors: error.details });
//     }
//     next();
//   };
  
//   module.exports = validateRequest;