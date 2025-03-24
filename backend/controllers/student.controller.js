const Adaptive = require("../models/Adaptive");
const { Attachment } = require("../models/Attachment");
const Course = require("../models/Course");
const Lesson = require("../models/ScormLogSchema");
const Student = require("../models/Student");
const StudentCourseRequest = require("../models/studentCourseRequests");
const User = require("../models/User");
const File = require("../models/File");
const createError = require("../utils/createError");
const Joi = require("joi");
const PDFDocument = require('pdfkit');
const generateCertificateNumber = require("../utils/generateCertificateNumber");
const Reminder = require("../models/Reminder")
const { scheduleReminder } = require("../utils/reminderScheduler")
const path = require("path")
const fs = require('fs');
const Instructor = require("../models/Instructor");
const Enrollment = require("../models/Enrollment");
const QuizResult = require("../models/QuizResult");
const Submission = require("../models/Submission");
const { getQuizComment , getAssignmentComment } = require("../utils/getGradesFeedback");
const ExcelJS = require("exceljs");

// const { PDFDocument } = require('pdf-lib');




const getAllStudentCourses = async (req, res, next) => {

  try {

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ userObjRef: req.user._id }).populate({
      path: "coursesEnrolled",
      select: "-paymentCourses -studentsEnrolled",
      populate: {
        path: "instructorId",
        select: "name email",
        populate: { path: "userObjRef", select: "name email profilePic" },
      },
    });

    if (!student) {
      return next(createError("Student not found", 404));
    }

    const totalCourses = student.coursesEnrolled.length;
    const paginatedCourses = student.coursesEnrolled.slice(skip, skip + limit);

    res.status(200).json({
      studentCourses: paginatedCourses,
      page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
    })

  } catch (error) {
    next(error)
  }

}




const getAllStudentCoursesNoPaging = async (req, res, next) => {

  try {

    const student = await Student.findOne({ userObjRef: req.user._id }).populate({
      path: "coursesEnrolled",
      select: "-paymentCourses -studentsEnrolled -sections -quizzes -assignments",
      populate: {
        path: "instructorId",
        select: "name email",
        populate: { path: "userObjRef", select: "name email profilePic" },
      },
    });

    if (!student) {
      return next(createError("Student not found", 404));
    }

    res.status(200).json({studentCourses: student.coursesEnrolled})

  } catch (error) {
    next(error)
  }

}




const getStudentEnrolledCourses = async (req , res , next) => {

  try {
    
    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const student = await Student.findOne({ userObjRef: req.user._id }).populate({
      path: "coursesEnrolled",
      select: "-paymentCourses -studentsEnrolled",
      populate: {
        path: "instructorId",
        select: "name email",
        populate: { path: "userObjRef", select: "name email profilePic" },
      },
    })

    if (!student) {
      return next(createError("Student not found", 404))
    }

    const totalCourses = student.coursesEnrolled
    
    if (!totalCourses.length) {
      return res.status(200).json({
        message: "No enrolled courses found",
        courses: [],
        totalCourses: 0,
        completedCourses: 0,
      })
    }

    const userLogs = await Lesson.find({
      userId: req.user._id,
      lesson_status: { $in: ["completed", "passed"] },
    }).select("attachement courseId")


    const completedAttachmentMap = userLogs.reduce((acc, log) => {
      if (!acc[log.courseId]) acc[log.courseId] = new Set()
      acc[log.courseId].add(log.attachement.toString())
      return acc
    }, {})


    let completedCourses = 0

    const courseProgress = totalCourses.map((course) => {

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

      const progressPercentage = totalAttachments > 0 ? (completedAttachments / totalAttachments) * 100 : 0

      if (progressPercentage === 100) {
        completedCourses += 1
      }

      return {
        courseId: course._id,
        courseName: course.title,
        totalAttachments,
        completedAttachments,
        progress: progressPercentage.toFixed(2) + "%",
        course
      }

    })


    res.status(200).json({
      userId: req.user._id,
      totalCourses,
      completedCourses,
      courses: courseProgress,
    })

  } catch (error) {
    next(error)
  }

}




const enrollFreeCourse = async (req , res , next) => {

  try {

    const { courseId } = req.params
    const studentUserDoc = await Student.findOne({ userObjRef: req.user._id })

    if (!studentUserDoc) {
      return next(createError("Student not found", 404))
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }
  
    if (course.isPaid) {
      return next(createError("This course is not free" , 400))
    }
  
    if (studentUserDoc.coursesEnrolled.includes(courseId)) {
      return next(createError("Already enrolled in this course" , 400))
    }

    studentUserDoc.coursesEnrolled.push(courseId)
    await studentUserDoc.save()

    await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: studentUserDoc._id } }
    )

    const newEnrollment = new Enrollment({
      studentId: studentUserDoc._id ,
      courseId: courseId ,
      enrollmentDate: new Date() ,
      status: 'active'
    })

    await newEnrollment.save()

    res.status(200).json({message: "Successfully enrolled in the course"})
    
  } catch (error) {
    next(error)
  }
  
}




const courseEnrolRequest = async (req, res, next) => {

  const courseEnrolSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required(),
    address: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
  });

  const { value, error } = courseEnrolSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError("Invalid course enrol request", 400));
  }

  try {
    const { firstName, lastName, email, phone, address, city } = value;

    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("course not found", 404));
    }

    const studentUser = await Student.findOne({ userObjRef: req.user._id });

    if (!studentUser) {
      return next(createError("student not exist", 404));
    }

    const isStudentAlreadyEnroled =
      studentUser.coursesEnrolled.includes(course._id) ||
      course.studentsEnrolled.includes(studentUser._id);

    if (isStudentAlreadyEnroled) {
      return next(createError("student already enroled in this course", 400));
    }

    const isStudentAlreadyReqEnrolment = await StudentCourseRequest.findOne({
      courseId: course._id,
      studentId: studentUser._id,
    });

    if (isStudentAlreadyReqEnrolment) {
      return next(
        createError("student already request enrolment to this course", 400)
      );
    }

    const courseNewEnrolReq = new StudentCourseRequest({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      courseId: course._id,
      studentId: studentUser._id,
    });

    await courseNewEnrolReq.save();

    res
      .status(201)
      .json({ status: courseNewEnrolReq.status, alreadyRequested: false });
  } catch (error) {
    next(error);
  }
};




const getMyEnrolmentRequests = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const studentUser = await Student.findOne({ userObjRef: req.user._id });

    if (!studentUser) {
      return next(createError("student not exist", 404));
    }

    const studentAllRequests = await StudentCourseRequest.find({
      studentId: studentUser._id,
    })
      .skip(skip)
      .limit(limit);

    const totalDoc = await StudentCourseRequest.countDocuments({
      studentId: studentUser._id,
    });

    res.status(200).json({
      studentAllRequests,
      page,
      totalPages: Math.ceil(totalDoc / limit),
      totalDoc,
    });
  } catch (error) {
    next(error);
  }
}




const checkEnrollmentStatus = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentUser = await Student.findOne({ userObjRef: req.user._id });

    if (!studentUser) {
      return next(createError("Student not found", 404));
    }

    const enrollmentRequest = await StudentCourseRequest.findOne({
      courseId,
      studentId: studentUser._id,
    });

    if (enrollmentRequest) {
      return res.status(200).json({
        alreadyRequested: true,
        status: enrollmentRequest.status,
      });
    }

    res.status(200).json({
      alreadyRequested: false,
    });
  } catch (error) {
    next(error);
  }
}




const addCourseRating = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating } = req.body;

    if (!rating) {
      return next(createError("Rating number is required", 400));
    }

    if (rating < 1 || rating > 10) {
      return next(createError("Rating must be between 1 and 10", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const studentDocObj = await Student.findOne({ userObjRef: req.user._id });

    if (!studentDocObj) {
      return next(createError("student not found", 404));
    }

    const isEnrolled = course.studentsEnrolled.some(
      (id) => id.toString() === studentDocObj._id.toString()
    );

    if (!isEnrolled) {
      return next(createError("You are not enrolled in this course", 401));
    }

    const existingRating = course.ratings.find(
      (r) => r.studentId.toString() === studentDocObj._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      course.ratings.push({
        studentId: studentDocObj._id,
        rating,
        userId: req.user._id,
      });
    }

    const totalRatings = course.ratings.length;

    const sumRatings = course.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    )

    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0;

    course.rate = averageRating;

    await course.save();

    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    next(error);
  }
};




const getCourseCompletionPercentage = async (req, res, next) => {

  const { courseId } = req.params

  try {
    const course = await Course.findById(courseId).populate(
      "sections.items.attachments"
    )

    if (!course) {
      return next(createError("Course not found", 404))
    }

    const studentUserDoc = await Student.findOne({ userObjRef: req.user._id });

    if (!studentUserDoc) {
      return next(createError("Student not exist", 404));
    }

    if (!course.studentsEnrolled.includes(studentUserDoc._id)) {
      return next(createError("User is not enrolled in this course", 400));
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
        ).length
      })
    })

    const progressPercentage = (completedAttachments / totalAttachments) * 100

    res.status(200).json({
      courseId,
      userId: req.user._id,
      progress: progressPercentage.toFixed(2) + "%",
      completedAttachments,
      totalAttachments,
    })

  } catch (error) {
    next(error)
  }

}




const getAllCoursesCompletionPercentagePaging = async (req, res, next) => {

  try {

    const page = Number(req.query.page) || 1
    const limit = 5

    const studentUserDoc = await Student.findOne({ userObjRef: req.user._id })

    if (!studentUserDoc) {
      return next(createError("Student not found", 404))
    }

    const totalCourses = await Course.countDocuments({ studentsEnrolled: studentUserDoc._id })
    const totalPages = Math.ceil(totalCourses / limit)

    const enrolledCourses = await Course.find({
      studentsEnrolled: studentUserDoc._id,
    })
    .populate({
      path: 'sections.items.attachments'
    })
    .populate({
      path: 'instructorId', 
      populate: {
        path: 'userObjRef', 
        select: 'firstName lastName email profilePic'
      }
    })
    .skip((page - 1) * limit)
    .limit(limit)


    if (!enrolledCourses.length) {
      return res.status(200).json({
        message: "No enrolled courses found",
        courses: [],
        totalCourses,
        completedCourses: 0,
        totalPages,
        currentPage: pageNumber,
      })

    }

    const userLogs = await Lesson.find({
      userId: req.user._id,
      lesson_status: { $in: ["completed", "passed"] },
    }).select("attachement courseId");

    const completedAttachmentMap = userLogs.reduce((acc, log) => {
      if (!acc[log.courseId]) acc[log.courseId] = new Set()
      acc[log.courseId].add(log.attachement.toString())
      return acc
    }, {})

    let completedCourses = 0

    const courseProgress = enrolledCourses.map((course) => {

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

      const progressPercentage = totalAttachments > 0 ? (completedAttachments / totalAttachments) * 100 : 0

      if (progressPercentage === 100) {
        completedCourses += 1
      }

      return {
        courseId: course._id,
        courseName: course.title,
        totalAttachments,
        completedAttachments,
        progress: progressPercentage.toFixed(0) + "%",
        course
      }

    })

    res.status(200).json({
      userId: req.user._id,
      totalCourses,
      completedCourses,
      totalPages,
      currentPage: page,
      courses: courseProgress,
    })

  } catch (error) {
    next(error)
  }

}




const getAllCoursesCompletionPercentage = async (req, res, next) => {

  try {

    const { status = "all" } = req.query

    const studentUserDoc = await Student.findOne({ userObjRef: req.user._id })

    if (!studentUserDoc) {
      return next(createError("Student not found", 404))
    }

    const enrolledCourses = await Course.find({
      studentsEnrolled: studentUserDoc._id,
    })
    .populate({
      path: 'sections.items.attachments'
    })
    .populate({
      path: 'instructorId', 
      populate: {
        path: 'userObjRef', 
        select: 'firstName lastName email profilePic'
      }
    })

    if (!enrolledCourses.length) {
      return res.status(200).json({
        message: "No enrolled courses found",
        courses: [],
        totalCourses: 0,
        completedCourses: 0,
      })
    }

    const userLogs = await Lesson.find({
      userId: req.user._id,
      lesson_status: { $in: ["completed", "passed"] },
    }).select("attachement courseId")

    const completedAttachmentMap = userLogs.reduce((acc, log) => {
      if (!acc[log.courseId]) acc[log.courseId] = new Set()
      acc[log.courseId].add(log.attachement.toString())
      return acc
    }, {})

    let completedCourses = 0

    const courseProgress = enrolledCourses.map((course) => {

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

      const progressPercentage = totalAttachments > 0 ? (completedAttachments / totalAttachments) * 100 : 0

      if (progressPercentage === 100) {
        completedCourses += 1
      }

      return {
        courseId: course._id,
        courseName: course.title,
        totalAttachments,
        completedAttachments,
        progress: progressPercentage.toFixed(0) + "%",
        course
      }

    })


    const filteredCourses = courseProgress.filter((course) => {
      switch (status) {
        case "ongoing":
          return parseFloat(course.progress) > 0 && parseFloat(course.progress) < 100;
        case "upcoming":
          return parseFloat(course.progress) === 0;
        case "completed":
          return parseFloat(course.progress) === 100;
        case "all":
        default:
          return true;
      }
    })


    const randomCourses = filteredCourses.sort(() => Math.random() - 0.5)

    const totalCourses = enrolledCourses.length

    let badgeAssigned = false

    const badgeConditions = [
      { threshold: 5, badgeType: "bronze", description: "Completed 5 courses" },
      { threshold: 10, badgeType: "silver", description: "Completed 10 courses" },
      { threshold: 20, badgeType: "gold", description: "Completed 20 courses" },
      { threshold: 50, badgeType: "premium", description: "Completed 50 courses" },
    ]

    for (let condition of badgeConditions) {

      if (completedCourses >= condition.threshold && !studentUserDoc.badges.some(badge => badge.badgeType === condition.badgeType)) {
        
        const newBadge = {
          name: `${condition.badgeType.charAt(0).toUpperCase() + condition.badgeType.slice(1)} Badge`,
          badgeType: condition.badgeType,
          description: condition.description,
          dateAwarded: new Date(),
        }

        studentUserDoc.badges.push(newBadge)

        await studentUserDoc.save()

        badgeAssigned = true

      }

    }

    res.status(200).json({
      userId: req.user._id,
      totalCourses,
      completedCourses,
      courses: randomCourses ,
      badgeAssigned,
    })

  } catch (error) {
    next(error)
  }

}




const getAllStudentsCourseCompletionPercentage = async (req, res, next) => {

  const { courseId } = req.params

  try {

    const course = await Course.findById(courseId).populate("sections.items.attachments")

    if (!course) {
      return next(createError("Course not found", 404))
    }

    const students = await Student.find({ coursesEnrolled: courseId }).populate("coursesEnrolled")

    if (!students.length) {
      return res.status(200).json({
        message: "No students enrolled in this course",
        students: [],
        totalStudents: 0,
      });
    }

    const studentsProgress = []

    for (const student of students) {

      const userLogs = await Lesson.find({
        courseId,
        userId: student.userObjRef,
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
          ).length
        })
      })

      const progressPercentage = totalAttachments > 0 ? (completedAttachments / totalAttachments) * 100 : 0

      studentsProgress.push({
        studentId: student._id,
        studentName: student.name,
        completedAttachments,
        totalAttachments,
        progress: progressPercentage.toFixed(2) + "%",
      })

    }

    studentsProgress.sort((a, b) => b.progress - a.progress)

    const totalStudents = studentsProgress.length;
    const completedStudents = studentsProgress.filter((student) => parseFloat(student.progress) === 100).length

    res.status(200).json({
      courseId,
      totalStudents,
      completedStudents,
      students: studentsProgress,
    })

  } catch (error) {
    next(error)
  }

}







const addToWishlist = async (req, res, next) => {

  try {

    const { courseId } = req.params

    const user = await User.findById(req.user._id)

    if (!user) return next(createError("User does not exist", 404))

    const student = await Student.findOne({ userObjRef: req.user._id })

    if (!student) return next(createError("Student does not exist", 404))

    const course = await Course.findById(courseId)

    if (!course) return next(createError("Course does not exist", 404))

    if (student.coursesEnrolled.includes(courseId)) {
      return next(createError("you are enrolled in this course", 400))
    }

    if (user.wishlist.includes(courseId)) {
      return next(createError("Course already in your wishlist", 409))
    }

    user.wishlist.push(courseId)

    await user.save()

    res.status(200).json({
      wishlist: user.wishlist,
      message: "Course added to wishlist",
    })

  } catch (error) {
    next(error)
  }

}




const removeFromWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) return next(createError("User does not exist", 404));

    const student = await Student.findOne({ userObjRef: req.user._id });

    if (!student) return next(createError("Student does not exist", 404));

    const course = await Course.findById(courseId);

    if (!course) return next(createError("Course does not exist", 404));

    if (!user.wishlist.includes(courseId)) {
      return next(createError("Course is not in your wishlist", 404));
    }

    user.wishlist = user.wishlist.filter(
      (course) => course.toString() !== courseId
    );

    await user.save();

    res.status(200).json({
      wishlist: user.wishlist,
      message: "Course removed from wishlist",
    });
  } catch (err) {
    next(err);
  }
};




const getWishlist = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
      .populate({
        path: "wishlist",
        populate: {
          path: "instructorId",
          populate: {
            path: "userObjRef",
            select: "name email profilePic",
          },
          select: "title instructorId",
        },
      })
      .skip(skip)
      .limit(limit);

    if (!user) {
      return next(createError("User does not exist", 404));
    }

    const totalUserWhishList = await User.countDocuments(req.user._id).populate(
      "wishlist"
    );

    res.status(200).json({
      wishlist: user.wishlist,
      page,
      totalUserWhishList,
      totalPages: Math.ceil(totalUserWhishList / limit),
    });
  } catch (err) {
    next(err);
  }
};



const getAvgLessonsProgress = async (req, res, next) => {

  try {
  
    const isStudentExist = await Student.findOne({ userObjRef: req.user._id });

    if (!isStudentExist) {
      return next(createError("Student not exist", 404));
    }

    const lessons = await Lesson.find({ student_id: req.user._id })
      .populate("courseId", "title")
      .select("lesson_status completionPercentage score duration");

    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) =>
      ["completed", "passed"].includes(lesson.lesson_status)
    ).length;

    const averageScore = totalLessons > 0
      ? lessons.reduce((sum, lesson) => sum + Number(lesson.score.raw || 0), 0) / totalLessons
      : 0; 

    res.status(200).json({
      studentId: isStudentExist._id,
      totalLessons,
      completedLessons,
      averageScore: averageScore.toFixed(2),
      lessonDetails: lessons,
    })

  } catch (error) {
    next(error)
  }
  
}





const getWeakAreas = async (req, res, next) => {
  try {
    const isStudentExist = await Student.findOne({ userObjRef: req.user._id });

    if (!isStudentExist) {
      return next(createError("Student not exist", 404));
    }

    const lessons = await Lesson.find({ student_id: req.user._id })
      .populate({ path: "attachement", select: "activityFileName" })
      .populate("interactions")
      .select("courseId interactions score");

    if (!lessons || lessons.length === 0) {
      return next(createError("No lessons found for this student", 404));
    }

    const weakAreas = [];

    lessons.forEach((lesson) => {
      const weakArea = {
        weakLesson: lesson._id,
        attachmentFileName: lesson.attachement
          ? lesson.attachement.activityFileName
          : "No attachment",
        courseId: lesson.courseId,
        failedActivities: 0,
        score: null,
      };

      const lowScore = parseFloat(lesson.score.raw) < 50;

      if (lowScore) {
        weakArea.score = lesson.score.raw;
      }

      const failedActivities = lesson.interactions.filter(
        (activity) => activity.result !== "correct"
      );

      if (failedActivities.length) {
        weakArea.failedActivities = failedActivities.length;
      }

      if (weakArea.score || weakArea.failedActivities > 0) {
        weakAreas.push(weakArea);
      }
    });

    res.status(200).json({ studentId: isStudentExist._id, weakAreas });
  } catch (error) {
    next(error);
  }
}




const assignAdaptiveContent = async (req, res, next) => {
  try {
    const { userId, lessonId } = req.params;

    const isStudentExist = await Student.findOne({ userObjRef: userId });

    if (!isStudentExist) {
      return next(createError("Student not exist", 404));
    }

    const lesson = await Lesson.findById(lessonId).select("score courseId");

    if (!lesson) {
      return next(createError("Student not exist", 404));
    }

    const scorePercentage = (lesson.score.raw / lesson.score.max) * 100;

    const adaptiveRule = await Adaptive.findOne({
      minScore: { $lte: scorePercentage },
      maxScore: { $gte: scorePercentage },
      courseId: lesson.courseId,
    });

    if (!adaptiveRule) {
      return next(createError("No adaptive content rule found", 404));
    }

    const recommendedContent = await Attachment.findOne({
      courseId: lesson.courseId,
      type: adaptiveRule.recommendedContentType,
    });

    res.status(200).json({
      studentId: isStudentExist._id,
      recommendedContent,
    });
  } catch (error) {
    next(error);
  }
}




const getBookMarks = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
      .populate({
        path: "bookmarks",
        populate: {
          path: "instructorId",
          populate: {
            path: "userObjRef",
            select: "name email profilePic",
          },
          select: "title instructorId",
        },
      })
      .skip(skip)
      .limit(limit);

    const totalBookmarks = await User.countDocuments(req.user._id).populate(
      "bookmarks"
    );

    if (!user) return next(createError("User does not exist", 404));

    const isStudentExist = await Student.findOne({ userObjRef: req.user._id });

    if (!isStudentExist) return next(createError("Student does not exist"));

    res.status(200).json({
      page,
      bookmarks: user.bookmarks,
      totalBookmarks,
      totalPages: Math.ceil(totalBookmarks / limit),
    });
  } catch (err) {
    next(err);
  }
}




const addToBookMark = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) return next(createError("User does not exist", 404));

    const isStudentExist = await Student.findOne({ userObjRef: req.user._id });

    if (!isStudentExist) return next(createError("Student does not exist"));

    const course = await Course.findById(courseId);

    if (!course) return next(createError("Course does not exist", 404));

    if (user.bookmarks.includes(courseId)) {
      return next(createError("Course is already bookmarked", 409));
    }

    user.bookmarks.push(courseId);
    await user.save();

    res.status(200).json({
      bookmark: user.bookmarks,
      message: "Course added to bookmarks",
    });
  } catch (err) {
    next(err);
  }
}




const removeFromBookMark = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) return next(createError("User does not exist", 404));

    const isStudentExist = await Student.findOne({ userObjRef: req.user._id });

    if (!isStudentExist) return next(createError("Student does not exist"));

    const course = await Course.findById(courseId);

    if (!course) return next(createError("Course does not exist", 404));

    if (user.bookmarks.includes(courseId)) {
      user.bookmarks = user.bookmarks.filter(
        (ob) => ob.toString() !== courseId.toString()
      );
    } else {
      return next(createError("Course is not bookmarked", 404));
    }

    await user.save();

    res.status(200).json({
      message: "Course remove from bookmarks",
    });
  } catch (err) {
    next(err);
  }

}




const generateCertificate = async (req , res , next) => {

  try {
    
    const userId = req.user._id
    const {courseId} = req.params

    const user = await User.findById(userId)

    if(!user){
      return next(createError("User not exist" , 404))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findById(courseId)

    if(!course){
      return next(createError("Course not exist" , 404))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course", 400))
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
        ).length
      })
    })

    const progressPercentage = (completedAttachments / totalAttachments) * 100

    const progress = progressPercentage.toFixed(2)

    if (progress < 100) {
      return next(createError("Certificate cannot be generated until the course is fully completed", 400))
    }

    const certificateNumber = generateCertificateNumber()

    const doc = new PDFDocument()

    const courseName = course.title

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${courseName}-Certificate.pdf"`)

    doc.pipe(res)

    doc
      .fontSize(24)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown()

    doc
      .fontSize(18)
      .text(`This is to certify that`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(22)
      .text(`${studentDoc.name}`, { align: 'center', underline: true })
      .moveDown()

    doc
      .fontSize(18)
      .text(`has successfully completed the course`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(22)
      .text(`${courseName}`, { align: 'center', underline: true })
      .moveDown();

    doc
      .fontSize(16)
      .text(`Certificate Number: ${certificateNumber}`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' })

    doc.end()


  } catch (error) {
    next(error)  
  }

}




const getStudentGrades = async (req , res , next) => {
  
  try {
    
    const page = Number(req.query.page) || 1
    const limit = 10

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const studentDocObj = await Student.findOne({userObjRef : req.user._id})

    if(!studentDocObj){
      return next(createError("Student not exist" , 404))
    }


    const quizResults = await QuizResult.find({ studentId : studentDocObj._id })
    .populate("courseId", "title")
    .populate("quizId", "title")
    .sort({ createdAt: 1 })

    const submissions = await Submission.find({ studentId : studentDocObj._id , isGraded : true })
    .populate({
      path: "assignmentId",
      select: "title mark courseId",
      populate: {
        path: "courseId", 
        select: "title",
      },
    }).sort({ submittedAt: 1 })


    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }


    const formattedResults = [
      ...quizResults.map((quiz) => ({
        course: quiz.courseId.title,
        type: `Quiz : ${quiz.quizId.title}`,
        grade: `${quiz.totalScore}/${quiz.maxPossibleScore}`,
        status: getQuizComment(quiz.totalScore , quiz.maxPossibleScore , quiz.passStatus),
        comment : quiz.passStatus ? "Great Work" : "Keep Going" ,
        percentage: (quiz.totalScore / quiz.maxPossibleScore) * 100,
        assessmentType : "Quiz" ,
        courseId : quiz.courseId._id
      })),
      ...submissions.map((submission) => ({
        course: submission.assignmentId.courseId.title,
        type: `Assignment : ${submission.assignmentId.title}`,
        grade: submission.isGraded ? `${submission.marks}/${submission.assignmentId.mark}` : "Not Graded",
        status: submission.isGraded ? getAssignmentComment(submission.marks , submission.assignmentId.mark) : "Not Graded",
        comment: submission.feedback || "No feedback yet",
        percentage: submission.isGraded ? (submission.marks / submission.assignmentId.mark) * 100 : 0 ,
        assessmentType : "Assignment" ,
        courseId : submission.assignmentId.courseId._id
      }))
    ]


    const randomizedResults = shuffleArray(formattedResults)

    const totalScore = formattedResults.reduce((sum , item) => sum + (item.percentage || 0), 0)
    const totalItems = formattedResults.length

    const gpa = totalItems > 0 ? totalScore / totalItems : 0

    const totalRecords = randomizedResults.length
    const totalPages = Math.ceil(totalRecords / limit)

    const paginatedResults = formattedResults.slice(startIndex , endIndex)

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalRecords,
      results: paginatedResults,
      gpa: `${gpa.toFixed(0)}%`,
    })

  } catch (error) {
    next(error)
  }

}




const generateStudentGradesExcel = async (req , res , next) => {

  try {
    
    const studentDocObj = await Student.findOne({ userObjRef: req.user._id })

    if (!studentDocObj) {
      return next(createError("Student not exist", 404))
    }

    const quizResults = await QuizResult.find({ studentId: studentDocObj._id })
      .populate("courseId", "title")
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    const submissions = await Submission.find({ studentId: studentDocObj._id, isGraded: true })
      .populate({
        path: "assignmentId",
        select: "title mark courseId",
        populate: {
          path: "courseId",
          select: "title",
        },
      })
      .sort({ submittedAt: -1 })


    const formattedResults = [
      ...quizResults.map((quiz) => ({
        Course: quiz.courseId.title,
        Type: `Quiz : ${quiz.quizId.title}`,
        Grade: `${quiz.totalScore}/${quiz.maxPossibleScore}`,
        Status: getQuizComment(quiz.totalScore, quiz.maxPossibleScore, quiz.passStatus),
        Comment: quiz.passStatus ? "Great Work" : "Keep Going",
        Percentage: (quiz.totalScore / quiz.maxPossibleScore) * 100,
        AssessmentType: "Quiz",
      })),
      ...submissions.map((submission) => ({
        Course: submission.assignmentId.courseId.title,
        Type: `Assignment : ${submission.assignmentId.title}`,
        Grade: submission.isGraded ? `${submission.marks}/${submission.assignmentId.mark}` : "Not Graded",
        Status: submission.isGraded ? getAssignmentComment(submission.marks, submission.assignmentId.mark) : "Not Graded",
        Comment: submission.feedback || "No feedback yet",
        Percentage: submission.isGraded ? (submission.marks / submission.assignmentId.mark) * 100 : 0,
        AssessmentType: "Assignment",
      })),
    ]

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Student Grades")

    worksheet.columns = [
      { header: "Course", key: "Course", width: 30 },
      { header: "Type", key: "Type", width: 30 },
      { header: "Grade", key: "Grade", width: 20 },
      { header: "Status", key: "Status", width: 20 },
      { header: "Comment", key: "Comment", width: 30 },
      { header: "Percentage", key: "Percentage", width: 20 },
      { header: "Assessment Type", key: "AssessmentType", width: 20 },
    ];

    formattedResults.forEach((result) => {
      worksheet.addRow(result)
    })

    worksheet.getColumn("Percentage").alignment = { horizontal: "left" }

    worksheet.protect("securepassword", {
      selectLockedCells: true,
      selectUnlockedCells: false,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false,
    })

    const filePath = path.join(__dirname, "../uploads/temp", `Student_Grades_${Date.now()}.xlsx`)
    await workbook.xlsx.writeFile(filePath)

    res.download(filePath, `Student_Grades.xlsx`, (err) => {
      if (err) console.error("Error sending file:", err)
      fs.unlinkSync(filePath)
    })

  } catch (error) {
    next(error)
  }

}



// ! use node-schedule library
const addReminder = async (req, res, next) => {

  try {

    const reminderValidationSchema = Joi.object({
      courseId: Joi.string().required() ,
      reminderName: Joi.string().trim().required(),
      reminderType: Joi.string().valid('daily', 'weekly', 'once').required(),
      reminderDays: Joi.array()
        .items(Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'))
        .when('reminderType', { is: 'weekly', then: Joi.required() }),
      reminderTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(am|pm)$/i).required(),
      reminderDateTime: Joi.date().iso().when('reminderType', {
        is: 'once',
        then: Joi.required(),
        otherwise: Joi.forbidden(), 
      }),
    })

    const { error , value } = reminderValidationSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return next(createError(error.details.map((err) => err.message.replace(/\"/g, '')).join(', '), 400))
    }

    const { courseId , reminderName , reminderType , reminderDays , reminderTime , reminderDateTime } = value
    
    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findById(courseId)

    if(!course){
      return next(createError("Course not exist" , 404))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course", 400))
    }

    await studentDoc.populate('reminders')

    const existingReminder = studentDoc.reminders.find(reminder => {

      const isSameReminder =
        reminder.courseId.toString() === courseId &&
        reminder.reminderName === reminderName &&
        reminder.reminderType === reminderType &&
        reminder.reminderTime === reminderTime

      if (reminderType === 'once') {
        return isSameReminder && reminder.reminderDateTime.toString() === reminderDateTime
      }

      if (reminderType === 'weekly') {
        return isSameReminder && reminder.reminderDays.sort().toString() === reminderDays.sort().toString()
      }

      return isSameReminder

    })

    if (existingReminder) {
      return next(createError("This reminder already exists.", 400))
    }

    let normalizedReminderDateTime = reminderDateTime

    if (reminderType === 'once') {
      const date = new Date(reminderDateTime)
      date.setHours(0, 0, 0, 0)
      normalizedReminderDateTime = date
    }


    const reminder = new Reminder({
      studentId : user._id ,
      courseId,
      reminderName,
      reminderType,
      reminderDays,
      reminderTime,
      reminderDateTime: reminderType === 'once' ? normalizedReminderDateTime : undefined,
    })

    await reminder.save()

    studentDoc.reminders.push(reminder._id)

    await studentDoc.save()

    scheduleReminder(reminder)

    res.status(201).json(reminder)

  } catch (error) {
    next(error)
  }

}




const getAllReminders = async (req, res, next) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page - 1) * limit

    const reminders = await Reminder.find({}).skip(skip).limit(limit)

    const totalReminders = await Reminder.countDocuments({})

    const totalPages = Math.ceil(totalReminders / limit)

    res.status(200).json({
      page,
      totalPages,
      totalReminders,
      reminders,
    })

  } catch (error) {
    next(error)
  }

}




const updateReminder = async (req, res, next) => {

  try {

    const reminderId = req.params.reminderId

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const reminderValidationSchema = Joi.object({
      reminderName: Joi.string().trim().optional(),
      reminderType: Joi.string().valid('daily', 'weekly', 'once').optional(),
      reminderDays: Joi.array()
        .items(Joi.string().valid('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'))
        .when('reminderType', { is: 'weekly', then: Joi.optional(), otherwise: Joi.forbidden() })
        .optional(),
      reminderTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(am|pm)$/i).optional(),
      reminderDateTime: Joi.date().iso()
        .when('reminderType', {
          is: 'once',
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .optional(),
    });

    const { error , value } = reminderValidationSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return next(createError(error.details.map((err) => err.message), 400))
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(reminderId , value , { new: true })

    if (!updatedReminder) {
      return next(createError("Reminder not found", 404))
    }

    res.status(200).json(updatedReminder)

  } catch (error) {
    next(error)
  }

}




const deleteReminder = async (req, res, next) => {

  try {

    const reminderId = req.params.reminderId

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const deletedReminder = await Reminder.findByIdAndDelete(reminderId)

    if (!deletedReminder) {
      return next(createError("Reminder not found", 404))
    }

    const student = await Student.findByIdAndUpdate(
      studentDoc._id , 
      { $pull: { reminders: reminderId } } ,
      { new: true } 
    )
    
    if (!student) {
      return next(createError("Student not found", 404))
    }

    res.status(200).json({ message: "Reminder deleted successfully" })

  } catch (error) {
    next(error)
  }

}




const toggleActiveFlag = async (req, res, next) => {

  try {

    const reminderId = req.params.reminderId

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const reminder = await Reminder.findById(reminderId)

    if (!reminder) {
      return next(createError("Reminder not found", 404))
    }

    reminder.active = !reminder.active

    await reminder.save()

    res.status(200).json(reminder)

  } catch (error) {
    next(error)
  }

}




const addNote = async (req , res , next) => {

  try {
    
    const { courseId , sectionId , itemId } = req.params
    const { content } = req.body

    const audioNotesDir = path.resolve(__dirname, "../uploads/audio_notes")
    
    if (!fs.existsSync(audioNotesDir)) {
      fs.mkdirSync(audioNotesDir, { recursive: true })
    }

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const isCourseExist = await Course.findById(courseId)

    if(!isCourseExist){
      return next(createError("Course not exist" , 404))
    }

    if (!isCourseExist.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course", 400))
    }

    let audioUrl = null

    if (req.files && req.files.audioFile) {

      const audioFile = req.files.audioFile

      const allowedTypes = ["audio/mpeg", "audio/wav"]
      
      if (!allowedTypes.includes(audioFile.mimetype)) {
        return next(createError("Invalid file type. Only MP3 and WAV are allowed" , 400))
      }

      const uniqueName = `${Date.now()}-${audioFile.name}`
      const uploadPath = path.join(audioNotesDir , uniqueName)

      try {

        await audioFile.mv(uploadPath)
  
        const file = new File({
          originalName: audioFile.name,
          uniqueName,
          filePath: `/uploads/audio_notes/${uniqueName}`,
          fileType: audioFile.mimetype,
          fileSize: audioFile.size,
          user: userId, 
        })

        await file.save()
  
        audioUrl = file.filePath

      } catch (error) {
        return res.status(500).json({ message: "Error uploading the file", error })
      }

    }

    if (!content && !audioUrl) {
      return next(createError("A note must have either text content or an audio file" , 400))
    }

    const course = await Course.findOne({
      _id: courseId,
      "sections._id": sectionId,
      "sections.items._id": itemId,
    })

    if (!course) {
      return next(createError("Course, section, or item not found" , 400))
    }

    const item = course.sections.id(sectionId).items.id(itemId)

    item.notes.push({ userId , content , audioUrl })

    await course.save()

    res.status(201).json({ message: "Note added successfully", note: { userId, content, audioUrl } })

  } catch (error) {
    next(error)
  }

}




const getAllNotesForCourse = async (req, res, next) => {

  try {

    const { courseId } = req.params
    
    const page = Number(req.query.page) || 1
    const limit = 10 

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course not found" , 404))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course", 400))
    }

    const allNotes = course.sections.reduce((acc, section) => {

      section.items.forEach((item) => {
        acc = acc.concat(item.notes)
      })

      return acc

    }, [])

    const totalNotes = allNotes.length
    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalNotes)

    const paginatedNotes = allNotes.slice(startIndex, endIndex)

    res.status(200).json({
      totalNotes,
      currentPage: Number(page),
      totalPages: Math.ceil(totalNotes / limit),
      notes: paginatedNotes,
    })

  } catch (error) {
    next(error)
  }
  
}




const getNotesForItem = async (req, res, next) => {

  try {

    const { courseId, sectionId, itemId } = req.params

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findOne({
      _id: courseId,
      "sections._id": sectionId,
      "sections.items._id": itemId,
    })

    if (!course) {
      return next(createError("Course, section, or item not found" , 404))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course" , 400))
    }

    const item = course.sections.id(sectionId).items.id(itemId)

    res.status(200).json({ notes: item.notes })

  } catch (error) {
    next(error)
  }

}




const updateNote = async (req, res, next) => {
  
  try {

    const { courseId, sectionId, itemId, noteId } = req.params
    const { content } = req.body

    let audioUrl = null

    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findOne({
      _id: courseId,
      "sections._id": sectionId,
      "sections.items._id": itemId,
    })

    if (!course) {
      return next(createError("Course, section, or item not found" , 400))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course" , 400))
    }

    const item = course.sections.id(sectionId).items.id(itemId)
    const note = item.notes.id(noteId)

    console.log(item)

    if (!note) {
      return next(createError("Note not found", 404))
    }

    if (note.userId.toString() !== userId.toString()) {
      return next(createError("Not authorized to update this note" , 403))
    }

    if (req.files && req.files.audioFile) {

      const audioFile = req.files.audioFile
      const allowedTypes = ["audio/mpeg", "audio/wav"]

      if (!allowedTypes.includes(audioFile.mimetype)) {
        return next(createError("Invalid file type. Only MP3 and WAV are allowed", 400))
      }

      const uniqueName = `${Date.now()}-${audioFile.name}`
      const uploadPath = path.join(__dirname, "../uploads/audio_notes", uniqueName)

      await audioFile.mv(uploadPath);
      audioUrl = `/uploads/audio_notes/${uniqueName}`

      const newFile = new File({
        originalName: audioFile.name,
        uniqueName,
        filePath: audioUrl,
        fileType: audioFile.mimetype,
        fileSize: audioFile.size,
        user: req.user._id,
      })

      await newFile.save()

      if (note.audioUrl) {

        const prevFilePath = path.join(__dirname, `..${note.audioUrl}`)

        if (fs.existsSync(prevFilePath)) {
          fs.unlinkSync(prevFilePath)
        }

        await File.deleteOne({ filePath: note.audioUrl })

      }

    }

    if (content) note.content = content
    if (audioUrl) note.audioUrl = audioUrl

    await course.save()

    res.status(200).json({ message: "Note updated successfully", note })

  } catch (error) {
    next(error)
  }

}




const deleteNote = async (req, res, next) => {
  
  try {

    const { courseId, sectionId, itemId, noteId } = req.params;
    const userId = req.user._id

    const user = await User.findById(userId)
    
    if (!user) {
      return next(createError("Not Authorized" , 401))
    }

    const studentDoc = await Student.findOne({userObjRef : userId})

    if(!studentDoc){
      return next(createError("Student not exist" , 404))
    }

    const course = await Course.findOne({
      _id: courseId,
      "sections._id": sectionId,
      "sections.items._id": itemId,
    })

    if (!course) {
      return next(createError("Course, section, or item not found", 404))
    }

    if (!course.studentsEnrolled.includes(studentDoc._id)) {
      return next(createError("Student is not enrolled in this course" , 400))
    }

    const section = course.sections.id(sectionId)

    if (!section) {
      return next(createError("Section not found", 404))
    }

    const item = section.items.id(itemId);

    if (!item) {
      return next(createError("Item not found", 404))
    }

    const note = item.notes.id(noteId)

    if (!note) {
      return next(createError("Note not found", 404))
    }

    if (note.userId.toString() !== userId.toString()) {
      return next(createError("Not authorized to delete this note", 403))
    }

    if (note.audioUrl) {

      const audioFilePath = path.join(__dirname, `..${note.audioUrl}`)

      if (fs.existsSync(audioFilePath)) {
        fs.unlinkSync(audioFilePath)
      }

      await File.deleteOne({ filePath : note.audioUrl })

    }

    item.notes.pull({ _id : noteId })

    await course.save()

    res.status(200).json({ message: "Note deleted successfully" })

  } catch (error) {
    next(error)
  }

}




const exportPdfNotes = async (req, res, next) => {

  try {

    const { courseId } = req.params

    const course = await Course.findById(courseId).populate('sections.items.notes')

    if (!course) {
      return next(createError("Course not found", 404))
    }

    const allNotes = course.sections
      .flatMap(section => section.items)
      .flatMap(item => item.notes)
      .filter(note => note.content && note.content.trim() !== '')

    if (allNotes.length === 0) {
      return next(createError("No notes with content available for this course", 404))
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    })

    const fileName = `notes_export_${course.title}_${Date.now()}.pdf`

    const notesFolderPath = path.join(__dirname, '../uploads/notes')

    if (!fs.existsSync(notesFolderPath)) {
      fs.mkdirSync(notesFolderPath, { recursive: true })
    }

    const filePath = path.join(notesFolderPath, fileName)

    doc.pipe(fs.createWriteStream(filePath))

    doc.fontSize(14).text('Course Notes', { align: 'center' })
    doc.moveDown(2)

    allNotes.forEach((note, index) => {
      doc.fontSize(12).text(`Note #${index + 1}:`, { underline: true })
      doc.fontSize(10).text(note.content)
      doc.moveDown(1)
    })

    doc.end()

    const relativeFilePath = `/uploads/notes/${fileName}`

    res.status(200).json({ message: 'Notes exported successfully', filePath: relativeFilePath })

  } catch (error) {
    next(error)
  }

}




const setCourseLastProgress = async (req , res , next) => {

  try {
    
    const { courseId , sectionId , itemId } = req.body
  
    if (!courseId || !sectionId || !itemId) {
      return next(createError("Missing required fields" , 404))
    }

    const timestamp = new Date()

    const student = await Student.findOne({ userObjRef : req.user._id })

    if (!student) {
      return next(createError("Student not found" , 404))
    }

    const existCourseProgress = student.courseProgress.find(progress => progress.courseId.toString() === courseId)

    if(existCourseProgress){
      // if there is already a course last progress , update it to the new one
      existCourseProgress.progress = {
        sectionId ,
        itemId ,
        timestamp
      }

    }else{
      // If the course last progress doesn't exist , create a new entry
      student.courseProgress.push({
        courseId , 
        progress : {sectionId , itemId , timestamp}
      })

    }

    await student.save()

    res.status(200).json({message : "Course last progress updated successfully" , courseLastProgress : student.courseProgress})

  } catch (error) {
    next(error)
  }

}




const getCourseLastProgress = async (req , res , next) => {

  try {
    
    const { courseId } = req.params

    if (!courseId) {
      return next(createError("Course ID is required", 400))
    }

    const student = await Student.findOne({ userObjRef : req.user._id })

    if (!student) {
      return next(createError("Student not found" , 404))
    }
    
    const course = await Course.findById(courseId).populate("sections.items.attachments")

    if (!course) {
      return next(createError("Course Not exist", 404))
    }

    if (!course.studentsEnrolled.includes(student._id)) {
      return next(createError("Student is not enrolled in this course" , 404))
    }

    const courseProgress = student.courseProgress.find((progress) => progress.courseId.toString() === courseId)

    if (!courseProgress) {
      return res.status(200).json({message : "No last progress found for this course"})
    }

    res.status(200).json({
      courseLastProgress: courseProgress ,
      courseSections : course.sections
    })

  } catch (error) {
    next(error)
  }

}





const addFeedback = async (req , res , next) => {

  try {
    
    const { courseId } = req.params
    const { text } = req.body

    if (!courseId) {
      return next(createError("Course ID is required" , 400))
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course Not exist", 404))
    }

    if (!text) {
      return next(createError("Feedback text is required" , 400))
    }

    if (text.length <= 0 || text === "") {
      return next(createError("text feedback can't be empty string" , 400))
    }

    const student = await Student.findOne({ userObjRef : req.user._id })
    
    if (!student) {
      return next(createError("Student not found" , 404))
    }

    const isEnrolled = student.coursesEnrolled.some((enrolledCourseId) => enrolledCourseId.toString() === courseId)

    if (!isEnrolled) {
      return next(createError("You are not enrolled in this course" , 403))
    }

    const hasProvidedFeedback = course.feedbacks.some((feedback) => feedback.studentId.toString() === student._id.toString())

    if (hasProvidedFeedback) {
      return next(createError("You have already provided feedback for this course" , 400))
    }

    course.feedbacks.push({
      studentId: student._id ,
      userId: req.user._id ,
      text ,
    })

    await course.save()

    res.status(201).json({
      message: "Feedback added successfully",
      feedbacks: course.feedbacks ,
    })


  } catch (error) {
    next(error)
  }

}




const getCourseFeedbacks = async (req , res , next) => {

  try {
    
    const { courseId } = req.params
    const page = Number(req.query.page) || 1

    const limit = 10
    
    const course = await Course.findById(courseId , "feedbacks").populate({
      path: "feedbacks.userId",
      select: "firstName lastName email",
    })

    if (!course) {
      return next(createError("Course Not exist" , 404))
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const totalFeedbacks = course.feedbacks.length

    const feedbacks = course.feedbacks
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) 
      .slice(startIndex, endIndex)

    res.status(200).json({
      feedbacks ,
      totalFeedbacks,
      totalPages: Math.ceil(totalFeedbacks / limit),
      currentPage: parseInt(page, 10) ,
    })

  } catch (error) {
    next(error)
  }

}




const deleteCourseFeedback = async (req , res , next) => {

  try {
    
    const { courseId, feedbackId } = req.params
    const userRole = req.user.role

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course Not exist" , 404))
    }

    const feedback = course.feedbacks.id(feedbackId)

    if (!feedback) {
      return next(createError("Feedback not found" , 404))
    }

    const courseInstructor = await Instructor.findById(course.instructorId).populate("userObjRef")

    if (userRole !== "admin" && courseInstructor.userObjRef._id.toString() !== req.user._id && feedback.userId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to delete this feedback" })
    }

    course.feedbacks = course.feedbacks.filter((f) => f._id.toString() !== feedback._id.toString())
    
    await course.save()

  } catch (error) {
    next(error)
  }

}




const calculateStudentAttendance  = async (req , res , next) => {

  try {
    
    const userId = req.user._id

    const student = await Student.findOne({ userObjRef : userId }).populate({
      path: "coursesEnrolled",
      populate: {
        path: "sections",
        populate: {
          path: "items",
          populate: { path: "views.userId", select: "firstName lastName email" }, 
        },
      },
    })

    if (!student) {
      return next(createError("Student not found" , 404))
    }

    const courses = student.coursesEnrolled
    let totalItems = 0
    let itemsViewed = 0

    courses.forEach((course) => {

      course.sections.forEach((section) => {

        section.items.forEach((item) => {

          totalItems += 1

          const hasViewed = item.views.some((view) => view.userId.toString() === userId.toString())
          
          if (hasViewed) {
            itemsViewed += 1
          }

        })

      })

    })

    const attendancePercentage = totalItems > 0 ? ((itemsViewed / totalItems) * 100).toFixed(2) : 0

    res.status(200).json({
      userId,
      attendance: `${attendancePercentage}%`,
      totalItems,
      itemsViewed,
    })

  } catch (error) {
    next(error)
  }

}




const getStudentProgress = async (req , res , next) => {

  try {
    
    const userId = req.user._id

    const student = await Student.findOne({ userObjRef : userId })

    const courses = await Course.find({ studentsEnrolled: student._id }).populate("studentsEnrolled").lean()
    
    let totalCourses = 0
    let totalCompleted = 0
    let totalNotCompleted = 0

    for (let course of courses) {

      totalCourses++

      const userLogs = await Lesson.find({
        courseId: course._id,
        userId,
        lesson_status: { $in: ["completed", "passed"] },
      }).select("attachement")

      const completedAttachmentIds = userLogs.map((log) => log.attachement.toString())

      let totalAttachments = 0
      let completedAttachments = 0

      course.sections.forEach((section) => {

        section.items.forEach((item) => {

          totalAttachments += item.attachments.length

          completedAttachments += item.attachments.filter((attachment) =>
            completedAttachmentIds.includes(attachment._id.toString())
          ).length

        })

      })

      const progressPercentage = totalAttachments > 0 ? (completedAttachments / totalAttachments) * 100 : 0

      if (progressPercentage === 100) {
        totalCompleted++
      } else {
        totalNotCompleted++
      }

    }

    return res.status(200).json({
      userId ,
      totalCourses ,
      totalCompleted ,
      totalNotCompleted ,
    })

  } catch (error) {
    next(error)
  }

}




const checkFeedbackStatus = async (req , res , next) => {

  try {
    
    const {courseId} = req.params

    const course = await Course.findById(courseId)
    .populate("studentsEnrolled")
    .populate("ratings")
    .populate("feedbacks")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const student = await Student.findOne({ userObjRef : req.user._id })
    
    if (!student) {
      return next(createError("Student not found" , 404))
    }

    const isEnrolled = student.coursesEnrolled.some((enrolledCourseId) => enrolledCourseId.toString() === courseId)

    if (!isEnrolled) {
      return next(createError("You are not enrolled in this course" , 403))
    }

    const hasRated = course.ratings.some((rating) => rating.userId.equals(req.user._id))

    const hasFeedback = course.feedbacks.some((feedback) => feedback.userId.equals(req.user._id))

    res.status(200).json({hasRated , hasFeedback})

  } catch (error) {
    next(error)
  }

}







module.exports = {
  getAllStudentCourses,
  getAllStudentCoursesNoPaging ,
  getStudentEnrolledCourses ,
  enrollFreeCourse ,
  courseEnrolRequest,
  getMyEnrolmentRequests,
  checkEnrollmentStatus,
  addCourseRating,
  getCourseCompletionPercentage,
  getAllCoursesCompletionPercentage ,
  getAllCoursesCompletionPercentagePaging ,
  getAllStudentsCourseCompletionPercentage ,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAvgLessonsProgress,
  getWeakAreas,
  assignAdaptiveContent,
  removeFromBookMark,
  getBookMarks,
  addToBookMark,
  generateCertificate ,
  getStudentGrades ,
  generateStudentGradesExcel ,
  addReminder ,
  getAllReminders ,
  updateReminder ,
  deleteReminder , 
  toggleActiveFlag ,
  addNote ,
  getAllNotesForCourse ,
  getNotesForItem ,
  updateNote ,
  deleteNote ,
  exportPdfNotes ,
  setCourseLastProgress ,
  getCourseLastProgress ,
  addFeedback ,
  getCourseFeedbacks ,
  deleteCourseFeedback ,
  calculateStudentAttendance ,
  getStudentProgress ,
  checkFeedbackStatus
}
