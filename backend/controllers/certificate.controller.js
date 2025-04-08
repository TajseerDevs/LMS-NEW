const fs = require("fs-extra")
const path = require("path")
const PDFDocument = require("pdfkit")
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const Course = require("../models/Course");
const Student = require("../models/Student");
const generateCertificateNumber = require("../utils/generateCertificateNumber");
const Lesson = require("../models/ScormLogSchema");
const File = require("../models/File")

const certificatesDir = path.join(__dirname, "..", "uploads", "certificates")
fs.ensureDirSync(certificatesDir)



const generateCertificate = async (req, res, next) => {

    try {

      const userId = req.user._id
      const { courseId } = req.params
  
      const user = await User.findById(userId)

      if (!user) return next(createError("User not exist", 404))
  
      const studentDoc = await Student.findOne({ userObjRef: userId })

      if (!studentDoc) return next(createError("Student not exist", 404))
  
      const course = await Course.findById(courseId).populate({
        path: "instructorId",
        populate: {
          path: "userObjRef",
          select: "firstName lastName",
        },
      })

      if (!course) return next(createError("Course not exist", 404))
  
      if (!course.studentsEnrolled.includes(studentDoc._id)) {
        return next(createError("Student is not enrolled in this course", 400))
      }
  
      const existingCert = await Certificate.findOne({
        studentId: studentDoc._id,
        courseId,
      })
  
      if (existingCert) {

        const existingFilePath = path.join(certificatesDir, path.basename(existingCert.certificateURL))
  
        if (fs.existsSync(existingFilePath)) {
          res.setHeader("Content-Type", "application/pdf")
          res.setHeader("Content-Disposition", `attachment; filename="${path.basename(existingFilePath)}"`)
          return res.sendFile(existingFilePath)
        }

      }
  
      const userLogs = await Lesson.find({
        courseId,
        userId: req.user._id,
        lesson_status: { $in: ["completed", "passed"] },
      }).select("attachement")
  
      const completedAttachmentIds = userLogs.map((log) => log.attachement.toString())
  
      let totalAttachments = 0
      let completedAttachments = 0
  
      course.sections.forEach((section) => {
        section.items.forEach((item) => {
          totalAttachments += item.attachments.length;
          completedAttachments += item.attachments.filter((attachment) =>
            completedAttachmentIds.includes(attachment._id.toString())
          ).length;
        })
      })
  
      const progressPercentage = (completedAttachments / totalAttachments) * 100
      const progress = progressPercentage.toFixed(2)
  
      if (progress < 100) {
        return next(createError("Certificate cannot be generated until the course is fully completed", 400));
      }
  
      const certificateNumber = generateCertificateNumber()
      const fileName = `${certificateNumber}-${course.title.replace(/ /g, "_")}.pdf`
      const filePath = path.join(certificatesDir, fileName)
  
      const doc = new PDFDocument()
      const writeStream = fs.createWriteStream(filePath)
  
      doc.pipe(writeStream)
  
      doc.fontSize(26).text(`Certificate of Completion`, { align: "center" })
      doc.moveDown()
      doc.fontSize(18).text(`Certificate ID : ${certificateNumber}`)
      doc.moveDown()
      doc.fontSize(16).text(`Student Name : ${user.firstName} ${user.lastName}`)
      doc.text(`Course Name : ${course.title}`)
      doc.text(`Instructor : ${course.instructorId.userObjRef.firstName} ${course.instructorId.userObjRef.lastName}`)
      doc.text(`Completion : ${progress}%`)
      doc.text(`Issue Date : ${new Date().toLocaleDateString()}`)
  
      doc.end()
  
      writeStream.on("finish", async () => {

        const stats = await fs.stat(filePath)
  
        await Certificate.create({
          studentId: studentDoc._id,
          courseId,
          instructorId: course.instructorId._id,
          completionPercentage: progress,
          certificateId: certificateNumber,
          status: "issued",
          certificateURL: `/uploads/certificates/${fileName}`,
        })
  
        const newFile = new File({
          originalName: fileName,
          uniqueName: fileName,
          filePath: `/uploads/certificates/${fileName}`,
          fileType: "application/pdf",
          fileSize: stats.size,
          user: userId,
        })
  
        await newFile.save()
  
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
        res.sendFile(filePath)

      })

    } catch (error) {
      next(error)
    }

}
  



const getMyCertificates = async (req , res , next) => {

    try {

        const userId = req.user._id

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
    
        const studentDoc = await Student.findOne({ userObjRef: userId })

        if (!studentDoc) {
          return next(createError("Student not found", 404))
        }
    
        const certificates = await Certificate.find({ studentId: studentDoc._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate({
            path: "courseId",
            select: "title createdAt",
            populate: {
              path: "instructorId",
              populate: {
                path: "userObjRef",
                select: "firstName lastName email",
              },
            },
          })
    
        const totalCertificates = await Certificate.countDocuments({
          studentId: studentDoc._id,
        })
    
        const totalCourses = await Course.countDocuments({
          studentsEnrolled: studentDoc._id,
        })
    
        const enrolledCourses = await Course.find({
          studentsEnrolled: studentDoc._id,
        })
          .populate({
            path: "sections.items.attachments",
          })
          .populate({
            path: "instructorId",
            populate: {
              path: "userObjRef",
              select: "firstName lastName email profilePic",
            },
          })
          .skip(skip)
          .limit(limit)
    
        const userLogs = await Lesson.find({
          userId,
          lesson_status: { $in: ["completed", "passed"] },
        }).select("attachement courseId")
    
        const completedAttachmentMap = userLogs.reduce((acc, log) => {
          const courseId = log.courseId.toString();
          if (!acc[courseId]) acc[courseId] = new Set();
          acc[courseId].add(log.attachement.toString());
          return acc;
        }, {})
    
        let completedCourses = 0
    
        const coursesWithProgress = enrolledCourses.map((course) => {

          let totalAttachments = 0
          let completedAttachments = 0
    
          course.sections.forEach((section) => {

            section.items.forEach((item) => {

              totalAttachments += item.attachments.length
    
              const completedAttachmentIds = completedAttachmentMap[course._id.toString()] || new Set()
    
              completedAttachments += item.attachments.filter((attachment) =>
                completedAttachmentIds.has(attachment._id.toString())
              ).length

            })

          })
    
          const progress =
            totalAttachments > 0
              ? parseFloat(((completedAttachments / totalAttachments) * 100).toFixed(2))
              : 0;
    
          if (progress === 100) completedCourses++
    
          return {
            id: course._id,
            title: course.title,
            createdAt: course.createdAt,
            instructor: {
              id: course.instructorId._id,
              name: `${course.instructorId.userObjRef.firstName} ${course.instructorId.userObjRef.lastName}`,
              email: course.instructorId.userObjRef.email,
              profilePic: course.instructorId.userObjRef.profilePic,
            },
            progress,
          }

        })
    
        res.json({
          page,
          totalPages: Math.ceil(totalCertificates / limit),
          totalCertificates,
          certificates: certificates.map((cert) => ({
            certificateId: cert.certificateId,
            status: cert.status,
            completionPercentage: cert.completionPercentage,
            certificateURL: cert.certificateURL,
            issueDate: cert.createdAt,
            course: {
              id: cert.courseId._id,
              title: cert.courseId.title,
              createdAt: cert.courseId.createdAt,
            },
            instructor: {
              id: cert.courseId.instructorId._id,
              name: `${cert.courseId.instructorId.userObjRef.firstName} ${cert.courseId.instructorId.userObjRef.lastName}`,
              email: cert.courseId.instructorId.userObjRef.email,
            },
          })),
          enrolledCourses: {
            totalCourses,
            completedCourses,
            totalPages: Math.ceil(totalCourses / limit) === 0 ? 1 : Math.ceil(totalCourses / limit),
            currentPage: page,
            courses: coursesWithProgress,
          },

        })

    } catch (error) {
        next(error)
    }

}



module.exports = {generateCertificate , getMyCertificates}