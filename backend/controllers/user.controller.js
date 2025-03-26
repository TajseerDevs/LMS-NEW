const bcrypt = require("bcrypt")
const Joi = require("joi")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const ROLES = require("../utils/roles")
const createError = require("../utils/createError")

const User = require("../models/User")
const Student = require("../models/Student")
const Instructor = require("../models/Instructor")
const Parent = require("../models/Parent")
const File = require("../models/File")

const passwordResetTemplate = require("../utils/resetPasswordTemplate")
const calculateAge = require("../utils/calculateAge")




// Guardians are often adults who can make legal decisions for children who are not their own

const register = async (req , res , next) => {

  try {
    
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(30).required(),
      lastName: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^\+[0-9]+$/).required(),
      password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
      dateOfBirth: Joi.date().required(),
      gender: Joi.string().valid("male", "female", "other").required(),
      role: Joi.string().valid("student", "instructor", "parent", "admin", "adminOfAdmins").required(),
      // students: Joi.array().items(
      //   Joi.object({
      //     studentId: Joi.string().required(),
      //     fullName: Joi.string().required(),
      //     relation: Joi.string().valid("father", "mother", "guardian").required(),
      //     gradeLevel: Joi.string()
      //     .valid("K-12", "university", "training")
      //     .required(),        
      //   })
      // ).when("role", { is: "parent", then: Joi.required(), otherwise: Joi.forbidden() }),
    })

    const { error , value } = schema.validate(req.body , {abortEarly : false})

    if (error) {
      return next(createError(error.details.map((err) => err.message.replace(/\"/g , '')).join(', ') , 400))
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      role,
      // students,
    } = value

    const existingUser = await User.findOne({ phone })
    
    if (existingUser) {
      return next(createError("Phone number already in use", 400))
    }

    const existingUsereEmail = await User.findOne({ email })

    if (existingUsereEmail) {
      return next(createError("Email already in use", 400))
    }

    const calculatedAge = calculateAge(dateOfBirth)

    let newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password ,
      dateOfBirth,
      age : calculatedAge ,
      gender,
      role,
    })

    if (role === "student") {

      const newStudent = new Student({
        userObjRef: newUser._id,
        reminders: [],
        coursesEnrolled: [],
        parentId: null,
        badges: [],
      })

      await newStudent.save()

    }else if (role === "instructor") {

      const newInstructor = new Instructor({
        userObjRef: newUser._id,
        coursesTeaching: [],
      })

      await newInstructor.save()

      newUser.isInstructor = true
      newUser.isAccepted = false

    }else if (role === "parent") {

      const newParent = new Parent({
        userObjRef: newUser._id,
      })

      // const studentsEnrolled = await Promise.all(students.map(async (studentData) => {

      //     const student = await Student.findById(studentData.studentId)
    
      //     if (!student) {
      //       return next(createError(`Student with ID ${studentData.studentId} not found` , 400))
      //     }

      //     student.parentId = newParent._id
      //     await student.save()
    
      //     return {
      //       studentId: student._id,
      //       fullName: studentData.fullName,
      //       relation: studentData.relation,
      //       gradeLevel: studentData.gradeLevel,
      //     }

      //   })

      // )

      // newParent.studentsEnrolled = studentsEnrolled

      await newParent.save()

    }
    
    if(role === "admin"){
      newUser.isAdmin = true
      newUser.isInstructor = true
    }

    if (role === "adminOfAdmins") {
     
      const isAuthorized = req.headers["x-admin-authorization"] === process.env.SUPER_ADMIN_KEY

      if (!isAuthorized) {
        return next(createError("Unauthorized to create adminOfAdmins" , 403))
      }

      newUser.isAdmin = true
      newUser.isInstructor = true
      newUser.adminOfAdmins = true
    
    }
    
    await newUser.save()

    newUser.password = undefined

    res.status(201).json(newUser)

  } catch (error) {
    console.log(error)
    next(error)
  }

}






const login = async (req , res , next) => {

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })  

      const { value, error } = loginSchema.validate(req.body, {
        abortEarly: false,
      })
    
      if (error) {
        return next(createError("Inavlid Credentials", 400))
      }
        
    try {
        
      const { email , password } = value

      if (!email || !password) {
        return next(createError("Email and password are required", 400))
      }
      
      const user = await User.findOne({ email }).select("+password")

      if (!user) {
        return next(createError("Invalid Credentials", 400))
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password)

      if (!isPasswordMatched) {
        return next(createError("Invalid Credentials", 400))
      }

      if (user.role === "instructor" && !user.isAccepted) {
        return next(createError("Your account is pending approval. Please wait for an administrator to approve your registration.", 403))
      }

      await User.findOneAndUpdate({ email }, { lastLogin: Date.now() })

      await user.save()

      user.password = undefined

      const token = user.signJWT()

      res.status(200).json({
        user,
        token,
      })
  
    } catch (error) {
      next(error)
    }

}




const updateProfile = async (req, res, next) => {
  
  const ageValidation = req.user.role === ROLES.STUDENT
  ? Joi.number().integer().min(3).max(25).optional() 
  : Joi.number().integer().min(23).max(90).optional()  

  const updateProfileSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    age: ageValidation,
  });

  const { value, error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError("Invalid Credentials", 400));
  }

  try {

    const userId = req.user._id

    const { name, email, password, age } = value

    const user = await User.findById(userId).select("+password")

    if (!user) {
      return next(createError("User not found", 404))
    }

    if (req.user._id.toString() !== user._id.toString()) {
      return next(createError("You don't have access to update profile", 401))
    }

    if (name) user.name = name
    if (email) user.email = email
    if(age) user.age = age
    if(password) user.password = password

    await user.save()

    if (user.role === ROLES.STUDENT) {

      const student = await Student.findOne({ userObjRef: userId })

      if (!student) {
        return next(createError("Student profile not found", 404))
      }

      if (name) student.name = name;
      if (age) student.age = age;

      await student.save()

    } else if (user.role === ROLES.INSTRUCTOR) {

      const instructor = await Instructor.findOne({ userObjRef: userId });

      if (!instructor) {
        return next(createError("Instructor profile not found", 404));
      }

      if (name) instructor.name = name;
      if (email) instructor.email = email;

      await instructor.save()

    }else if (user.role === ROLES.PARENT) {

      const parent = await Parent.findOne({ userObjRef: userId });

      if (!parent) {
        return next(createError("Parent profile not found", 404));
      }

      if (name) parent.name = name;
      if (email) parent.email = email;

      await parent.save()

    }

    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
};





const getLoggedUser = async (req, res, next) => {
  
  try {
  
    const user = await User.findById(req.user._id)

    if (!user) {
      return next(createError("User not exist", 404))
    }

    res.status(200).json(user)
  
  } catch (error) {
    next(error)
  }

}




const uploadProfileImg = async (req , res , next) => {

  try {
    
    const userId = req.user._id

    const user = await User.findById(userId)

    if (!user) {
      return next(createError("User not exist" , 404))
    }

    if (!req.files || !req.files.profilePic) {
      return next(createError("no file uploaded" , 400))
    }

    const profilePic = req.files.profilePic

    if (!profilePic.mimetype.startsWith("image/")) {
      return next(createError("File must be an image" , 400))
    }

    const fileName = `${Date.now()}-${profilePic.name}`
    const uploadPath = path.join(__dirname, "../uploads/images", fileName)

    if (user.profilePic) {

      const oldFilePath = path.join(__dirname, "..", user.profilePic)

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); 
      }

    }

    profilePic.mv(uploadPath, async (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "File upload failed" })  
      }

      user.profilePic = `/uploads/images/${fileName}`

      await user.save()

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePic: user.profilePic,
      })

    })

  } catch (error) {
    next(error)
  }

}




const uploadDocuments = async (req , res , next) => {

  try {
    
    const uploadFolder = path.join(__dirname, "../uploads/documents")

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(createError("No files were uploaded" , 400))
    }

    const uploadedFile = req.files.file

    const allowedExtensions = /jpg|jpeg|png|gif|pdf|mp4|docx|doc|txt|xls|xlsx/

    const fileExtension = path.extname(uploadedFile.name).toLowerCase()

    if (!allowedExtensions.test(fileExtension)) {
      return next(createError("Unsupported file type." , 400))
    }

    const baseName = path.basename(uploadedFile.name, fileExtension)
    const uniqueName = `${baseName}-${Date.now()}${fileExtension}`
    const filePath = path.join(uploadFolder, uniqueName)  
    
    await uploadedFile.mv(filePath)

    const fileData = new File({
      originalName: uploadedFile.name,
      uniqueName,
      filePath: `/uploads/documents/${uniqueName}`,
      fileType: uploadedFile.mimetype,
      fileSize: uploadedFile.size,
      user : req.user._id
    })

    await fileData.save()

    res.status(200).json({
      message: "File uploaded successfully!",
      filePath: `/uploads/documents/${uniqueName}`,
    })

  } catch (error) {
    next(error)  
  }

}




const uploadVoice = async (req , res , next) => {

  try {
    
    const uploadFolder = path.join(__dirname, "../uploads/voices")

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(createError("No voice file was uploaded", 400));
    }

    const uploadedFile = req.files.file 

    const allowedExtensions = /mp3|wav|ogg/
    const fileExtension = path.extname(uploadedFile.name).toLowerCase()

    if (!allowedExtensions.test(fileExtension)) {
      return next(createError("Unsupported voice file type.", 400))
    }

    const baseName = path.basename(uploadedFile.name, fileExtension)
    const uniqueName = `${baseName}-${Date.now()}${fileExtension}`
    const filePath = path.join(uploadFolder, uniqueName)

    await uploadedFile.mv(filePath)

    const fileData = new File({
      originalName: uploadedFile.name,
      uniqueName,
      filePath: `/uploads/voices/${uniqueName}`,
      fileType: uploadedFile.mimetype,
      fileSize: uploadedFile.size,
      user: req.user._id, 
    })

    await fileData.save()

    res.status(200).json({
      message: "Voice recording uploaded successfully!",
      filePath: `/uploads/voices/${uniqueName}`,
    })

  } catch (error) {
    next(error)
  }

}




const forgotPassword = async (req , res , next) => {

  const schema = Joi.object({
    email : Joi.string().email().required()
  })

  const {value , error} = schema.validate(req.body)

  if(error){
    return next(createError("Invalid credentials" , 400))
  }

  try {
    
    const { email } = value

    const user = await User.findOne({ email })
    
    if (!user) {
      return next(createError("User not found" , 404))
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetPasswordExpires = Date.now() + 600000

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetPasswordExpires

    await user.save()

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure : true ,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD  
      },
    })

    const resetUrl = `http://10.10.30.40:3000/user/reset-password/${resetToken}`

    const htmlContent = passwordResetTemplate(resetToken)

    const textContent = `You requested a password reset. Click the following link to reset your password: ${resetUrl}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      replyTo: process.env.EMAIL_USER, 
      html: htmlContent,
      text: textContent, 
      cc : process.env.EMAIL_USER
    });

    res.status(200).json({ message: "Password reset link sent to your email" , resetUrl })

  } catch (error) {
    next(error)
  }

}




const resetPassword = async (req , res , next) => {

  const schema = Joi.object({
    newPassword : Joi.string().min(6).required(),
    token : Joi.string().required()
  })

  const {value , error} = schema.validate(req.body)

  if(error){
    return next(createError("Invalid credentials" , 400))
  }

  try {
    
    const { token , newPassword } = value

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return next(createError("Invalid or expired token" , 400))
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({ message: "Password successfully reset!" })


  } catch (error) {
    next(error)
  }

}




const getAllUsers = async (req , res , next) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const query = { isAdmin: false }

    const users = await User.find(query)
    .select('-lastLogin -coursesEnrolled -parentId -resetPasswordToken -resetPasswordExpires -cartItems -wishlist -bookmarks -adminOfAdmins -isAccepted')
    .skip(skip)
    .limit(limit)
    .lean();
  

    const totalUsers = await User.countDocuments(query)

    const totalPages = Math.ceil(totalUsers / limit)

    res.status(200).json({
      users,
      page,
      totalPages,
      totalUsers,
    })

  } catch (error) {
    next(error)
  }

}




module.exports = {
  register ,
  login , 
  updateProfile , 
  getLoggedUser , 
  uploadProfileImg , 
  uploadDocuments , 
  uploadVoice , 
  forgotPassword , 
  resetPassword ,
  getAllUsers
}