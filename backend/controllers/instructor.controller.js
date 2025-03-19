const Joi = require("joi")
const createError = require("../utils/createError")
const Instructor = require("../models/Instructor")
const Course = require("../models/Course")
const Notification = require("../models/Notification")
const { default: mongoose } = require("mongoose")
const upload = require("../middlewares/multer")
const path = require("path")
const fs = require("fs")
const { Attachment } = require("../models/Attachment")
const unzipper = require("unzipper");
const Student = require("../models/Student")
const Ticket = require("../models/Ticket")
const { v4: uuidv4 } = require("uuid")
const Category = require("../models/Category")
const File = require("../models/File")
const User = require("../models/User")
const Lesson = require("../models/ScormLogSchema")




const createCourse = async (req , res , next) => {

  const createCourseSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    isPaid: Joi.boolean().required(),
    duration: Joi.number().min(1).required(), 
    extraInfo: Joi.string().optional(),
    category: Joi.string().valid("k-12" , "University" , "Trainee").required(),
    learningCategory: Joi.string()
      .valid("IT & Software", "Design", "Marketing", "Science", "Language", "Trending")
      .required(),
    level: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      .required(),
    tags: Joi.string().optional(),
    extraInfo: Joi.string().required(),
  })

    const {value , error} = createCourseSchema.validate(req.body , {abortEarly : false})

    if(error){
      return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
    }

    try {
        
      const userId = req.user._id

      const {title , isPaid , duration ,  description , category , learningCategory , level , extraInfo} = value

      let tags = value.tags ? JSON.parse(value.tags) : []
        
      // let price = value.isPaid ? Number(value.price) : 0

      // if course was a free course 
      // if(!isPaid && price > 0){
      //   return next(createError("Price must be 0 when the course is not paid." , 400))
      // }

      // // if course was a paid course 
      // if(isPaid && price <= 0){
      //   return next(createError("Price must be greater than 0 when the course is paid." , 400))
      // }

      if(duration <= 0){
        return next(createError("course duration must be greater than 0 ." , 400))
      }

      const instructor = await Instructor.findOne({ userObjRef : userId })

      if(!instructor){
        return next(createError("Instructor not exist" , 404))
      }

      if(req.user.role !== "instructor" && req.user.role !== "admin"){
        return next(createError("You don't have access to create this course", 401))
      }

      const isCourseExist = await Course.findOne({title})

      if(isCourseExist){
        return next(createError("Course title already exist" , 400))
      }

      let coursePic = null

      if (!req.files?.coursePic) {
        return next(createError("You must upload a course cover image" , 400))
      }

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
        title,
        duration ,
        isPaid ,
        learningCategory ,
        level ,
        instructorId: instructor._id,
        status: "pending",
        tags,
        description,
        coursePic,
        category ,
        extraInfo ,
        price : 0
      })

      // "extraInfo": [
      //   "Includes real-world projects",
      //   "Lifetime access",
      //   "Certificate of completion"
      // ],

      if (req.user.role === "instructor" || req.user.role === "admin") {

        let courseOwnerStudentDoc = await Student.findOne({ userObjRef: req.user._id })
        
        if (courseOwnerStudentDoc) {

          if (!courseOwnerStudentDoc.coursesEnrolled.includes(course._id)) {
            courseOwnerStudentDoc.coursesEnrolled.push(course._id);
          }

        } else {

          courseOwnerStudentDoc = new Student({
            userObjRef: req.user._id,
            coursesEnrolled: [course._id],
          })

        }
        
        if (!course.studentsEnrolled.includes(courseOwnerStudentDoc._id)) {
          course.studentsEnrolled.push(courseOwnerStudentDoc._id);
        }
        
        await courseOwnerStudentDoc.save()

      }
      
      // const defaultSection = {
      //   name : "Section one" ,
      //   items : []
      // }

      // course.sections.push(defaultSection)

      await course.save()
        
      const newNotification = new Notification({
        to : userId ,
        type : "course_created",
        courseId : course._id ,
        message : `${course.title} created successfully , currently under review for acceptance`
      })

      await newNotification.save()

      res.status(201).json(course)

    } catch (error) {
      next(error)
    }

}




const getAllInstructorCourses = async (req, res, next) => {

  const getInstructorCoursesSchema = Joi.object({
    page: Joi.number().optional().default(1),
  })
  
  const { value, error } = getInstructorCoursesSchema.validate(req.query, {
    abortEarly: false,
  })
  
  if (error) {
    return next(createError("Invalid page query value", 400));
  }
  
  const { page } = value
  const limit = 10
  const skip = (page - 1) * limit
  
  try {

    const instructor = await Instructor.findOne({ userObjRef: req.user._id })
  
    if (!instructor) {
      return next(createError("Instructor not found", 404))
    }
  
    const totalCourses = await Course.countDocuments({
      instructorId: instructor._id,
    })

    const totalPages = Math.ceil(totalCourses / limit)
  
    const courses = await Course.find({
      instructorId: instructor._id,
    })
    .skip(skip)
    .limit(limit)
  
    res.status(200).json({
      courses,
      totalCourses,
      totalPages,
      currentPage: page,
    })

    } catch (error) {
      next(error)
    }

}




const getAllInstructorCoursesNoPaging = async (req , res , next) => {

  try {
    
    const instructor = await Instructor.findOne({ userObjRef: req.user._id })
  
    if (!instructor) {
      return next(createError("Instructor not found", 404))
    }
  
    const courses = await Course.find({
      instructorId: instructor._id,
    })

    res.status(200).json(courses)

  } catch (error) {
    next(error)
  }

}




const viewCourseStudents = async (req, res, next) => {

  try {

    const { courseId } = req.params
    const userId = req.user._id
  
    const instructor = await Instructor.findOne({ userObjRef: userId })

    if (!instructor) {
      return next(createError("Instructor not found", 404))
    }
  
    const course = await Course.findOne({ _id: courseId , instructorId: instructor._id })

    if (!course) {
      return next(createError("Course not found", 404))
    }
  
    if (course.status !== "approved") {
      return next(createError("You can only view approved courses", 403))
    }
  
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to view this course's students", 401))
    }
  
    if (req.user.role === "instructor" && course.instructorId.toString() !== instructor._id.toString()) {
      return next(createError("You don't have permission to view students in this course", 401))
    }
  
    const courseWithStudents = await Course.findById(courseId)
      .populate({
        path: "studentsEnrolled",
        select: "name age",
        populate: {
          path: "userObjRef", 
          select: "name email _id", 
        }
      })
      .select("-instructorId")
  
      if (!courseWithStudents) {
        return next(createError("Course not found", 404))
      }
  
      const students = courseWithStudents.studentsEnrolled.map(student => ({
        name: student.name,
        age: student.age,
        user: student.userObjRef, 
      }))
  
      res.status(200).json({
        students,
      })

    } catch (error) {
      next(error)
    }

  }
  




const deleteCourse = async (req, res, next) => {

    const { courseId } = req.params

    try {

      const course = await Course.findById(courseId);

      if (!course) {
            return next(createError("Course not found", 404));
        }

        if (course.status !== "approved") {
            return next(createError("You can only update approved courses", 403));
        }

        const instructor = await Instructor.findOne({ userObjRef: req.user._id });

        if (req.user.role !== "instructor" && req.user.role !== "admin") {
            return next(createError("You don't have access to delete this course", 401));
        }

        if (req.user.role === "instructor") {

            if (course.instructorId.toString() !== instructor._id.toString()) {
                return next(createError("You don't have access to delete this course", 401));
            }

        }

        if (req.user.role === "admin") {

            const courseInstructor = await Instructor.findById(course.instructorId);
            
            if (!courseInstructor) {
                return next(createError("Instructor not found for this course", 404));
            }

            await Instructor.updateOne(
                { _id: courseInstructor._id },
                { $pull: { coursesTeaching: course._id } }
            );

        } else {

            await Instructor.updateOne(
                { _id: instructor._id },
                { $pull: { coursesTeaching: course._id } }
            );

        }

        const students = await Student.find({ coursesEnrolled: course._id })

        // notificationPromises will return an array of un resolved promises
        const notificationPromises = students.map(async (student) => {

            const notification = new Notification({
              from : req.user._id ,
              to: student.userObjRef,
              type : "course_deleted" ,
              message: `The course "${course.title}" has been deleted.`,
            })

            await notification.save()

        })

        // here we resolve all promises in the notificationPromises array
        await Promise.all(notificationPromises)

        await Student.updateMany(
            { coursesEnrolled: course._id },
            { $pull: { coursesEnrolled: course._id } }
        )

        const courseStudentsIds = course.studentsEnrolled

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({ message: "Course deleted successfully" , courseStudentsIds });

    } catch (error) {
        next(error);
    }
};




const addSectionToCourse = async(req , res , next) => {

    const addSectionToCourseSchema = Joi.object({
      name : Joi.string().required().min(3) ,
      items : Joi.array().optional() ,
    })

    const {value , error} = addSectionToCourseSchema.validate(req.body , {abortEarly : false})

    if(error){
        return next(createError("Inavlid new course section data" , 400))
    }

    const {name , items} = value

    try {
        
        const { courseId } = req.params

        const course = await Course.findById(courseId)

        if (!course) {
            return next(createError("Course with this id not found", 404))
        }

        // if (course.status !== "approved") {
        //     return next(createError("You can only update approved courses", 403));
        // }

        if (req.user.role !== "instructor" && req.user.role !== "admin") {
            return next(createError("You don't have access to add section to this course", 401));
        }

        if (req.user.role === "instructor") {

            const courseInstructor = await Instructor.findOne({userObjRef : req.user._id})

            if (course.instructorId.toString() !== courseInstructor._id.toString()) {
                return next(createError("You don't have access to add section to this course", 401))
            }

        }

        const newSection = {
            name,
            items,
            _id: new mongoose.Types.ObjectId(), 
        };

        course.sections.push(newSection)

        await course.save()

        const students = await Student.find({ coursesEnrolled: courseId })

        // notificationPromises will return an array of un resolved promises
        const notificationPromises = students.map(async (student) => {

            const notification = new Notification({
              from : req.user._id ,
              to: student.userObjRef,
              type : "course_sections_updated" ,
              message: `The course "${course.title}" sections has been updated.`,
            })

            await notification.save()

        })

        // here we resolve all promises in the notificationPromises array
        await Promise.all(notificationPromises)

        res.status(200).json(course)

    } catch (error) {
        next(error)
    }

}




const addItemToSection = async (req, res, next) => {
    
    try {
        
        const { courseId, sectionId } = req.params
        const { type , name , hours , minutes , seconds } = req.body
        
        if (!type || !name ) {
          return next(createError("All fields (type, name, content) are required", 400))
        }

        const validTypes =['Video', 'Image' , "Activity" , "Document"]
        
        if (!validTypes.includes(type)) {
          return next(createError("Invalid item type", 400))
        }
        
        const course = await Course.findById(courseId)
        
        if (!course) {
          return next(createError("Course with this id not found", 404))
        }

        const section = course.sections.id(sectionId)
        
        if (!section) {
          return next(createError("Section with this id not found", 404))
        }

        let launchFileUrl = ""
        
        const newItem = {
          type,
          name,
          attachments: [] ,
          estimatedTime : {
            hours ,
            minutes ,
            seconds
          }
        }
        
        section.items.push(newItem)

        await course.save()

        const addedItem = section.items[section.items.length - 1]

        if (!req.files || !req.files.scormPackage) {
          return next(createError("No file uploaded", 400));
        }

        const uploadsDirectory = path.join(__dirname, "../uploads")

        if (!fs.existsSync(uploadsDirectory)) {
          fs.mkdirSync(uploadsDirectory, { recursive: true })
        }
  
        const uploadedFile = req.files.scormPackage
        const uniqueFileName = `${uuidv4()}_${uploadedFile.name}`
        const uploadedFilePath = path.join(uploadsDirectory, uniqueFileName)

        uploadedFile.mv(uploadedFilePath, async (err) => {

          if (err) return next(createError("SCORM upload failed", 400));
    
          const extractDir = path.join(uploadsDirectory, uuidv4());
    
          fs.createReadStream(uploadedFilePath)
            .pipe(unzipper.Extract({ path: extractDir }))
            .on("close", async () => {
  
              const launchFilePath = path.join(extractDir, "index_lms.html");
    
              if (!fs.existsSync(launchFilePath)) {
                return next(createError("SCORM package is invalid. Missing launch file (index_lms.html).", 400));
              }
    
              launchFileUrl = `/uploads/${path.basename(extractDir)}/index_lms.html`;
  
              const file = new File({
                originalName: uploadedFile.name,
                uniqueName: uniqueFileName,
                filePath: uploadedFilePath,
                fileType: newItem.type,
                fileSize: uploadedFile.size,
                user: req.user._id,
              })
          
              await file.save()
    
              const attachment = new Attachment({
                file_path: uploadedFilePath,
                activityFileName: uniqueFileName,
                type: "Activity",
                launchUrl: launchFileUrl,
                scormVersion: req.body.version,
                courseId
              })
    
              await attachment.save()
    
              addedItem.attachments.push(attachment)
  
              await course.save()
    
            })
            .on("error", (error) => {
              console.error("Extraction failed:", error);
              return next(createError("Failed to extract SCORM package", 500));
            });
  
        })
        
        await course.save()

        const students = await Student.find({ coursesEnrolled: courseId })

        // notificationPromises will return an array of un resolved promises
        const notificationPromises = students.map(async (student) => {

            const notification = new Notification({
              from : req.user._id ,
              to: student.userObjRef,
              type : "course_items_updated" ,
              message: `The course "${course.title}" items has been updated.`,
            })

            await notification.save()

        })

        // here we resolve all promises in the notificationPromises array
        await Promise.all(notificationPromises)
        
        res.status(201).json({
          msg: "SCORM package uploaded and saved successfully.",
          launchUrl: launchFileUrl,
          course,
        })
        
    } catch (error) {
      next(error)
    }

}




const changeSectionPreview = async (req , res , next) => {

  try {

    const { courseId, sectionId } = req.params

    const course = await Course.findById(courseId);
        
    if (!course) {
      return next(createError("Course with this id not found", 404))
    }

    const section = course.sections.id(sectionId)
        
    if (!section) {
      return next(createError("Section with this id not found", 404))
    }

    section.isPreviewed = !section.isPreviewed
    
    await course.save()

    res.status(200).json(course)
    
  } catch (error) {
    next(error)
  }

}




const uploadScormFile = async (req, res, next) => {

    const { courseId, sectionId, itemId } = req.params
  
    try {

      const course = await Course.findById(courseId)

      if (!course) return next(createError("Course with this id not found", 404));
  
      const section = course.sections.id(sectionId)

      if (!section) return next(createError("Section with this id not found", 404));
  
  

      if (!item) return next(createError("Item with this id not found", 404))

      if(item.type !== "Activity"){
        return next(createError("you must upload scorm file in activity items" , 400))
      }  
  
      if (req.user.role !== "instructor" && req.user.role !== "admin") {
        return next(createError("You don't have access to upload attachment to this course item", 401));
      }
  
      if (req.user.role === "instructor") {

        const courseInstructor = await Instructor.findOne({ userObjRef: req.user._id });

        if (course.instructorId.toString() !== courseInstructor._id.toString()) {
          return next(createError("You don't have access to upload attachment to this course item", 401));
        }

      }
  
      if (!req.files || !req.files.scormPackage) {
        return next(createError("No file uploaded", 400));
      }
  
      const uploadsDirectory = path.join(__dirname, "../uploads");

      if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
      }
  
      const uploadedFile = req.files.scormPackage;
      const uniqueFileName = `${uuidv4()}_${uploadedFile.name}`;
      const uploadedFilePath = path.join(uploadsDirectory, uniqueFileName);
  
      uploadedFile.mv(uploadedFilePath, async (err) => {

        if (err) return next(createError("SCORM upload failed", 400));
  
        const extractDir = path.join(uploadsDirectory, uuidv4());
  
        fs.createReadStream(uploadedFilePath)
          .pipe(unzipper.Extract({ path: extractDir }))
          .on("close", async () => {

            const launchFilePath = path.join(extractDir, "index_lms.html");
  
            if (!fs.existsSync(launchFilePath)) {
              return next(createError("SCORM package is invalid. Missing launch file (index_lms.html).", 400));
            }
  
            const launchFileUrl = `/uploads/${path.basename(extractDir)}/index_lms.html`;

            const file = new File({
              originalName: uploadedFile.name,
              uniqueName: uniqueFileName,
              filePath: uploadedFilePath,
              fileType: item.type,
              fileSize: uploadedFile.size,
              user: req.user._id,
            });
        
            await file.save();
  
            const attachment = new Attachment({
              file_path: uploadedFilePath,
              activityFileName: uniqueFileName,
              type: "Activity",
              launchUrl: launchFileUrl,
              scormVersion: req.body.version,
              courseId
            });
  
            await attachment.save();
  
            item.attachments.push(attachment)

            await course.save()
  
            res.status(201).json({
              msg: "SCORM package uploaded and saved successfully.",
              launchUrl: launchFileUrl,
              course,
            });

          })
          .on("error", (error) => {
            console.error("Extraction failed:", error);
            return next(createError("Failed to extract SCORM package", 500));
          });

      });

    } catch (error) {
      next(error)
    }
    
  }




  const uploadContentFile = async (req, res, next) => {
  
    try {
    
      const { courseId, sectionId } = req.params
      const { type , name , hours , minutes , seconds } = req.body
      
      if (!type || !name ) {
        return next(createError("All fields (type, name, content) are required", 400))
      }

      const validTypes =['Video', 'Image' , "Activity" , "Document"]
      
      if (!validTypes.includes(type)) {
        return next(createError("Invalid item type", 400))
      }
      
      const course = await Course.findById(courseId)
      
      if (!course) {
        return next(createError("Course with this id not found", 404))
      }

      const section = course.sections.id(sectionId)
      
      if (!section) {
        return next(createError("Section with this id not found", 404))
      }
      
      const newItem = {
        type,
        name,
        attachments: [] ,
        estimatedTime : {
          hours ,
          minutes ,
          seconds
        }
      }
      
      section.items.push(newItem)

      const addedItem = section.items[section.items.length - 1]

      await course.save()
  
      const folderMapping = {
        Image: "images",
        Video: "documents",
        Document: "documents",
      }
  
      const folderName = folderMapping[addedItem.type]

      if (!folderName) return next(createError(`Unsupported item type: ${addedItem.type}`, 400))
  
      if (!req.files || !req.files.contentFile) {
        return next(createError("No file uploaded", 400))
      }
  
      const uploadedFile = req.files.contentFile

      const validMimeTypes = {
        Image: "image/",
        Video: "video/",
        Document: "application/",
      };

      console.log(uploadedFile.mimetype);
  
      const validDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
  
      if (!uploadedFile.mimetype.startsWith(validMimeTypes[addedItem.type])) {
        return next(createError(`Uploaded file must be of type ${addedItem.type}`, 400));
      }
  
      if (addedItem.type === "Document" && !validDocumentTypes.includes(uploadedFile.mimetype)) {
        return next(createError(`Uploaded file must be a valid document type: ${validDocumentTypes.join(", ")}`, 400))
      }
  
      const uploadsDirectory = path.normalize(path.join(__dirname, `../uploads/${folderName}`));

      if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
      }

      const fileExtension = path.extname(uploadedFile.name).toLowerCase()

      const baseName = path.basename(uploadedFile.name, fileExtension)
      const uniqueName = `${baseName}-${Date.now()}${fileExtension}`
  
      const uploadedFilePath = path.normalize(path.join(uploadsDirectory, uniqueName));
      
      const launchUrl = `/uploads/${folderName}/${uniqueName}`;

      try {
        await uploadedFile.mv(uploadedFilePath);
      } catch (err) {
        console.error('Error moving file:', err);
        return next(createError("File upload failed", 500));
      }
  
      const file = new File({
        originalName: uploadedFile.name,
        uniqueName: uniqueName,
        filePath: uploadedFilePath,
        fileType: addedItem.type,
        fileSize: uploadedFile.size,
        user: req.user._id,
      });
  
      await file.save()
  
      const attachment = new Attachment({
        file_path: uploadedFilePath,
        activityFileName: uniqueName,
        type: addedItem.type,
        courseId,
        fileId : file._id,
        launchUrl
      })
  
      await attachment.save()
  
      addedItem.attachments.push(attachment)

      await course.save()
  
      res.status(201).json({
        fileUrl: `/uploads/${folderName}/${uniqueName}`,
        course,
      })

    } catch (error) {
      next(error)
    }

  }
  
  




const updateCourse = async (req , res , next) => {

    const updateCourseSchema = Joi.object({
        title: Joi.string().min(3).optional() ,
        price: Joi.number().min(1).max(1000).optional() ,
        startDate: Joi.string().optional() ,
        endDate: Joi.string().optional()
    })

    const { value , error } = updateCourseSchema.validate(req.body, { abortEarly : false })

    if (error) {
        return next(createError("Invalid course data", 400))
    }

    try {

        const { courseId } = req.params

        const course = await Course.findById(courseId)

        if (!course) {
            return next(createError("Course not found", 404))
        }

        if (course.status !== "approved") {
            return next(createError("You can only update approved courses", 403));
        }

        const instructor = await Instructor.findOne({ userObjRef : req.user._id })

        if (req.user.role !== "instructor" && req.user.role !== "admin") {
            return next(createError("You don't have permission to update this course", 401))
        }

        if (req.user.role === "instructor" && course.instructorId.toString() !== instructor._id.toString()) {
            return next(createError("You don't have access to update this course", 401))
        }

        if (value.startDate && value.endDate) {

            const startDateObj = new Date(value.startDate)
            const endDateObj = new Date(value.endDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                return next(createError("Invalid date format", 400))
            }

            if (startDateObj < today) {
                return next(createError("Start date must be today or later", 400))
            }

            if (startDateObj >= endDateObj) {
                return next(createError("End date must be after the start date", 400))
            }
            
        }

        course.title = value.title || course.title
        course.price = value.price || course.price
        course.startDate = value.startDate || course.startDate
        course.endDate = value.endDate || course.endDate

        const students = await Student.find({ coursesEnrolled : course._id })

        const notificationPromises = students.map(async (student) => {

            const notification = new Notification({
                from : req.user._id ,
                to: student.userObjRef,
                type : "course_update" ,
                message: `The course "${course.title}" has been updated.`,
            });

            await notification.save()

        })

        await Promise.all(notificationPromises)

        await course.save()

        res.status(200).json(course)

    } catch (error) {
      next(error)
    }

}




const getInstructorContentTickets = async (req, res, next) => {

    try {
        
      const loggedUserId = req.user._id
    
      const instructor = await Instructor.findOne({userObjRef : loggedUserId})

      if(!instructor){
        return next(createError("instructor not found" , 404))
      }

      const ownedCourses = await Course.find({ instructorId : instructor._id , status : "approved" }).select("_id")
  
      const courseIds = ownedCourses.map((course) => course._id)
  
      const contentTickets = await Ticket.find({
        regarding: "content",
        courseRef: { $in: courseIds }, 
      })
        .populate("courseRef", "title") 
        .populate("userObjRef", "name email")
  
      res.status(200).json(contentTickets)
      
    } catch (error) {
      next(error)
    }

  }




  const getDeclineReason = async (req , res , next) => {

    const {courseId} = req.params

    try {

        if(req.user.role !== "instructor" && req.user.role !== "admin"){
            return next(createError("you are not authorized to view the decline reason" , 401))            
        }
        
        const course = await Course.findById(courseId)

        if (!course) {
            return next(createError("Course not found", 404))
        }

        if(req.user.role === "instructor"){

            const instructorRecord = await Instructor.findOne({userObjRef : req.user._id})

            if(course.instructorId.toString() !== instructorRecord._id.toString()){
              return next(createError("you are not authorized to view the decline reason" , 401))
            }

        }

        res.status(200).json({declineReason : course.extraInfo})


    } catch (error) {
        next(error)    
    }

  }




  const getCourseStudentLogs = async (req , res , next) => {

    try {
      
      const {courseId} = req.params
      const userId = req.user._id

      const page = Number(req.query.page) || 1
      const limit = 10
      const skip = (page - 1) * limit

      const course = await Course.findById(courseId)

      if(!course){
        return next(createError("Course not found", 404))
      }

      const courseInstructor = await Instructor.findOne({userObjRef : userId})

      if(course.instructorId.toString() !== courseInstructor._id.toString()){
        return next(createError("only course instructor could view the student logs", 400))
      }

      const logs = await Lesson.find({courseId}).skip(skip).limit(limit)
      
      const totalLogs = await Lesson.countDocuments({courseId})

      res.status(200).json({
        logs ,
        page ,
        totalPages : Math.ceil(totalLogs / limit) ,
        totalLogs
      })

    } catch (error) {
      next(error)
    }

  }
  





module.exports = {
  createCourse , 
  getAllInstructorCourses , 
  getAllInstructorCoursesNoPaging ,
  viewCourseStudents , 
    deleteCourse ,
    addSectionToCourse ,
    addItemToSection ,
    changeSectionPreview ,
    uploadScormFile ,
    updateCourse ,
    getInstructorContentTickets ,
    getDeclineReason ,
    uploadContentFile ,
    getCourseStudentLogs
}