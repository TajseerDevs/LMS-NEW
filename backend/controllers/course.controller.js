const Joi = require("joi");
const createError = require("../utils/createError");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { Attachment } = require("../models/Attachment");
const deleteFile = require("../utils/deleteFile");
const ObjectId = mongoose.Types.ObjectId;
const path = require("path");
const fs = require("fs");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const Notification = require("../models/Notification");
const Question = require("../models/Questions");
const File = require("../models/File")
const User = require("../models/User")



const getAllCourses = async (req, res, next) => {

  const getAllCoursesSchema = Joi.object({
    page: Joi.number().optional().default(1),
  });

  const { value, error } = getAllCoursesSchema.validate(req.query, {
    abortEarly: false,
  })

  if (error) {
    return next(createError("Inavlid page query value", 400));
  }

  const { page } = value;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalCourses = await Course.countDocuments();

    const courses = await Course.find({ status: "approved" })
      .select("-paymentCourses")
      .skip(skip)
      .limit(limit)
      .populate({
        path: "instructorId",
        select: "-coursesTeaching",
        populate: { path: "userObjRef", select: "firstName lastName email profilePic " },
      })

    res.status(200).json({
      courses,
      page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
    });
  } catch (error) {
    next(error);
  }
};




const getNotEnrolledCourses = async (req, res, next) => {

  try {

    const page = Number(req.query.page) || 1

    const limit = 10;
    const skip = (page - 1) * limit

    const userId = req.user._id;

    const studentUserDoc = await Student.findOne({ userObjRef: userId });

    const courses = await Course.find({
      studentsEnrolled: { $nin: [studentUserDoc._id] },
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "instructorId",
        select: "-coursesTeaching",
        populate: { path: "userObjRef", select: "firstName lastName email profilePic " },
      });

    const notEnrolledCoursesTotal = await Course.countDocuments({
      studentsEnrolled: { $nin: [studentUserDoc._id] },
    }).select(
      "-paymentCourses -ratings -extraInfo -studentsEnrolled -sections.items.attachments"
    );

    res.status(200).json({
      courses,
      notEnrolledCoursesTotal,
      page,
      totalPages: Math.ceil(notEnrolledCoursesTotal / limit),
    });
  } catch (error) {
    next(error);
  }
};




const suggestTopCourses = async (req, res, next) => {
  try {
    const topCourses = await Course.find({ status: "approved" })
      .sort({ rate: -1 })
      .limit(20)
      .select(
        "-paymentCourses -ratings -extraInfo -studentsEnrolled -sections.items.attachments"
      );

    res.status(200).json(topCourses);
  } catch (error) {
    next(error);
  }
};




const getCourseById = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return next(createError("Invalid Course id", 400));
    }

    const course = await Course.findById(courseId)
    .select("-paymentCourses -sections.items.attachments.file_path")
    .populate({
      path: "instructorId",
      populate: {
        path: "userObjRef",
      },
    })

    if (!course) {
      return next(createError("Course not found", 404));
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

const getItemAttachment = async (req, res, next) => {
  try {
    const attachment = await Attachment.findById(req.params.attachmentId);

    if (!attachment) {
      return next(createError("Activity with this id not exist", 404));
    }

    res.status(200).json(attachment);
  } catch (error) {
    next(error);
  }
};

const startItemActivity = async (req, res, next) => {
  try {
    const activity = await Attachment.findById(req.params.attachmentId);

    if (!activity) {
      return res.status(404).send("Attachment not found");
    }

    const filePath = path.resolve(activity.file_path);

    if (!fs.existsSync(filePath)) {
      return next(createError("File not found", 404));
    }

    const launchFileUrl = activity.launchUrl;

    res.status(200).json({ launchUrl: launchFileUrl });
  } catch (error) {
    next(error);
  }
};




const modifyCourseSection = async (req, res, next) => {

  try {
  
    const { courseId, sectionId } = req.params;
    const { name } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course with this id not found", 404));
    }

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to update this course", 401)
      )
    }

    if (req.user.role === "instructor") {

      const instructor = await Instructor.findOne({ userObjRef: req.user._id })

      if (!instructor) {
        return next(createError("Instructor not exist", 404));
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(createError("You don't have access to update this course", 401))
      }

    }

    const section = course.sections.id(sectionId)

    if (!section) {
      return next(createError("Section with this id not found", 404));
    }

    if (name) {
      section.name = name
    }

    await course.save()

    res.status(200).json(section)

  } catch (error) {
    next(error)
  }

}




const modifyItemInSection = async (req, res, next) => {

  try {

    const { courseId, sectionId, itemId } = req.params
    const { type, name, content } = req.body

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course with this id not found", 404))
    }

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to update this course" , 401))
    }

    if (req.user.role === "instructor") {

      const instructor = await Instructor.findOne({ userObjRef : req.user._id })

      if (!instructor) {
        return next(createError("Instructor not exist", 404));
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(createError("You don't have access to update this course" , 401))
      }

    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return next(createError("Section with this id not found", 404))
    }

    const item = section.items.id(itemId);

    if (!item) {
      return next(createError("Item with this id not found", 404))
    }

    if (type) {
      const validTypes = ["Video", "image", "Activity"]

      if (!validTypes.includes(type)) {
        return next(createError("Invalid item type", 400))
      }

      item.type = type
    
    }

    if (name) {
      item.name = name
    }

    if (content) {
      item.content = content
    }

    await course.save()

    res.status(200).json(item)

  } catch (error) {
    next(error)
  }

}




const deleteCourseSection = async (req, res, next) => {

  try {
  
    const { courseId , sectionId } = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course with this id not found", 404))
    }

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to update this course", 401))
    }

    if (req.user.role === "instructor") {

      const instructor = await Instructor.findOne({ userObjRef: req.user._id })

      if (!instructor) {
        return next(createError("Instructor not exist", 404))
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(createError("You don't have access to update this course", 401))
      }
    }

    const isSectionExist = course.sections.find((section) => section._id.toString() === sectionId)

    if (!isSectionExist) {
      return next(createError("Section with this id not exist", 404));
    }

    course.sections = course.sections.filter((section) => section._id.toString() !== sectionId)

    await course.save()

    res.status(200).json(course.sections)
    
  } catch (error) {
    next(error)
  }

}




const removeItemFromSection = async (req, res, next) => {

  try {

    const { courseId, sectionId, itemId } = req.params

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("Course with this id not found", 404))
    }

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to update this course", 401))
    }

    if (req.user.role === "instructor") {

      const instructor = await Instructor.findOne({ userObjRef: req.user._id })

      if (!instructor) {
        return next(createError("Instructor not exist", 404))
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(createError("You don't have access to update this course", 401))
      }
    }

    const section = course.sections.find((section) => section._id.toString() === sectionId)

    if (!section) {
      return next(createError("Section with this id not found", 404));
    }

    const item = section.items.find((item) => item._id.toString() === itemId)

    if (!item) {
      return next(createError("Item with this id not found", 404))
    }

    if (item.attachments.length > 0) {

      const attachment = item.attachments[0]
      const filePath = attachment.file_path

      try {
        if (fs.existsSync(filePath)) {
          await deleteFile(filePath)
          console.log(`Successfully deleted file: ${filePath}`)
        } else {
          console.warn(`File not found: ${filePath}`)
        }

        if (item.type === "Activity") {

          const directoryPath = path.join(__dirname , ".." , attachment.launchUrl.substring(0 , attachment.launchUrl.lastIndexOf("/")))

          if (fs.existsSync(directoryPath)) {
            await deleteFile(directoryPath);
            console.log(`Successfully deleted directory: ${directoryPath}`);
          }
        } else {
          console.log(`Skipping directory deletion for item type: ${item.type}`)
        }
        
      } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err)
        return next(createError(`Failed to delete file ${filePath}`, 500))
      }

      await Attachment.findOneAndDelete({ _id: item.attachments[0]._id })

    }

    section.items.pull(itemId)

    section.items = section.items.filter((item) => item._id.toString() !== itemId)

    await course.save()

    res.status(200).json(section)

  } catch (error) {
    next(error)
  }

}




// the ideal version
const deleteAttachment = async (req, res, next) => {

  try {

    const { courseId, sectionId, itemId, attachmentId } = req.params

    const courseObjectId = ObjectId.isValid(courseId)
      ? new ObjectId(courseId)
      : null;
    const sectionObjectId = ObjectId.isValid(sectionId)
      ? new ObjectId(sectionId)
      : null;
    const itemObjectId = ObjectId.isValid(itemId) ? new ObjectId(itemId) : null;
    const attachmentObjectId = ObjectId.isValid(attachmentId)
      ? new ObjectId(attachmentId)
      : null;

    const course = await Course.findById(courseObjectId);

    if (!course) {
      return next(createError("Course with this id not found", 404));
    }

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(createError("You don't have permission to update this course", 401))
    }

    if (req.user.role === "instructor") {
      const instructor = await Instructor.findOne({ userObjRef: req.user._id });

      if (!instructor) {
        return next(createError("Instructor not exist", 404));
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(
          createError("You don't have access to update this course", 401)
        );
      }
    }

    const section = course.sections.id(sectionObjectId);

    if (!section) {
      return next(createError("Section with this id not found", 404));
    }

    const item = section.items.id(itemObjectId);

    if (!item) {
      return next(createError("Item with this id not found", 404));
    }

    const attachmentIndex = item.attachments.findIndex(
      (att) => att._id.toString() === attachmentObjectId.toString()
    );

    if (attachmentIndex === -1) {
      return next(createError("Attachment with this id not found", 404));
    }

    const attachment = item.attachments[attachmentIndex];
    const filePath = attachment.file_path;

    try {
      if (fs.existsSync(filePath)) {
        await deleteFile(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
      } else {
        console.warn(`File not found: ${filePath}`);
      }

      if (item.type === "Activity") {
        const directoryPath = path.join(
          __dirname,
          "..",
          attachment.launchUrl.substring(
            0,
            attachment.launchUrl.lastIndexOf("/")
          )
        );
        if (fs.existsSync(directoryPath)) {
          await deleteFile(directoryPath);
          console.log(`Successfully deleted directory: ${directoryPath}`);
        }
      } else {
        console.log(`Skipping directory deletion for item type: ${item.type}`);
      }
    } catch (err) {
      console.error(`Failed to delete file ${filePath}:`, err);
      return next(createError(`Failed to delete file ${filePath}`, 500));
    }

    item.attachments.pull(attachmentObjectId);

    await course.save();

    const deletedAttachment = await Attachment.findOneAndDelete({
      _id: attachmentObjectId,
    });

    if (!deletedAttachment) {
      return next(
        createError("Failed to delete attachment from the database", 500)
      );
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};




const changeSectionName = async (req, res, next) => {

  const { courseId, sectionId } = req.params

  const { name } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });

    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return next(
        createError("You don't have permission to update this course", 401)
      );
    }

    if (req.user.role === "instructor") {
      const instructor = await Instructor.findOne({ userObjRef: req.user._id });

      if (!instructor) {
        return next(createError("Instructor not exist", 404));
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(
          createError("You don't have access to update this course", 401)
        );
      }
    }

    const section = course.sections.id(sectionId);

    if (!section) return res.status(404).json({ error: "Section not found" });

    section.name = name;

    await course.save();

    const students = await Student.find({ coursesEnrolled: courseId });

    // notificationPromises will return an array of un resolved promises
    const notificationPromises = students.map(async (student) => {
      const notification = new Notification({
        from: req.user._id,
        to: student.userObjRef,
        type: "course_sections_updated",
        message: `The course section ${name} in the "${course.title}" course has been updated.`,
      });

      await notification.save();
    });

    // here we resolve all promises in the notificationPromises array
    await Promise.all(notificationPromises)

    res.status(200).json({course , section})

  } catch (error) {
    next(error);
    console.log(error)
  }

}




const changeItemName = async (req, res, next) => {

  const { courseId, sectionId, itemId } = req.params;
  const { name } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });

    const section = course.sections.id(sectionId);

    if (!section) return res.status(404).json({ error: "Section not found" });

    const item = section.items.id(itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });

    item.name = name;

    await course.save();

    res.status(200).json(item);
  } catch (error) {
    console.error("Error updating item name:", error);
    res.status(500).json({ error: "Failed to update item name" });
  }
};

const searchCoursesByTitle = async (req, res, next) => {

  const searchCoursesSchema = Joi.object({
    title: Joi.string().trim().allow("").optional(),
    page: Joi.number().integer().min(1).default(1),
  });

  const { error, value } = searchCoursesSchema.validate(req.query);

  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  try {
    const limit = 10;

    const { title, page } = value;

    const skip = (page - 1) * limit;

    const titleQuery = title ? String(title) : "";

    const courses = await Course.find({
      title: { $regex: titleQuery, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "instructorId",
        select: "-coursesTeaching",
        populate: { path: "userObjRef", select: "name email profilePic " },
      });

    const totalCourses = await Course.countDocuments({
      title: { $regex: title, $options: "i" },
    });

    res.status(200).json({
      courses,
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
    });
  } catch (error) {
    next(error);
  }
};




const searchCoursesByInstructor = async (req, res, next) => {

  const { instructorName } = req.query;

  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "_id",
          as: "instructorDetails",
        },
      },
      {
        $unwind: "$instructorDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "instructorDetails.userObjRef",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $match: {
          "userDetails.name": { $regex: instructorName, $options: "i" },
        },
      },
      {
        $addFields: {
          "instructorDetails.name": "$userDetails.name",
          "instructorDetails.email": "$userDetails.email",
          "instructorDetails.profilePic": "$userDetails.profilePic",
        },
      },
      {
        $project: {
          userDetails: 0,
          "instructorDetails.userObjRef": 0,
        },
      },
    ]);

    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};




const searchCoursesByTags = async (req, res, next) => {
  try {
    const { tags } = req.query;

    const tagArray = tags ? tags.split(",") : [];

    const query = tagArray.length > 0 ? { tags: { $in: tagArray } } : {};

    const courses = await Course.find(query).populate({
      path: "instructorId",
      select: "-coursesTeaching",
      populate: { path: "userObjRef", select: "name email profilePic " },
    });

    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};




const listCategoriesWithCourses = async (req, res, next) => {

  try {

    const category = req.query.category;

    const validCategories = [
      "Technology",
      "Business",
      "Health",
      "Arts",
      "Science",
      "Sport",
    ];

    if (!category || !validCategories.includes(category)) {
      return next(createError("Invalid category", 400))
    }

    const filter = category ? { category } : {}

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "instructorId",
        select: "-coursesTeaching",
        populate: { path: "userObjRef", select: "name email profilePic " },
      })

    res.status(200).json(courses)

  } catch (error) {
    next(error)
  }

}




const searchCoursesByDuration = async (req, res, next) => {

  try {
  
    const { minDuration, maxDuration } = req.query

    if (!minDuration && !maxDuration) {
      return next(createError("No duration has been provided", 400))
    }

    const queryFilter = {};

    if (minDuration || maxDuration) {

      queryFilter.startDate = {}
      queryFilter.endDate = {}

      if (minDuration) {
        queryFilter.startDate.$gte = new Date(minDuration)
      }

      if (maxDuration) {
        queryFilter.endDate.$lte = new Date(maxDuration)
      }

    }

    const courses = await Course.find(queryFilter)
      .populate({
        path: "instructorId",
        select: "-coursesTeaching",
        populate: { path: "userObjRef", select: "name email profilePic" },
      })
      .lean()

    res.status(200).json(courses)

  } catch (error) {
    next(error)
  }

}





const addFaqQuestion = async (req, res, next) => {

  const questionSchema = Joi.object({
    courseId: Joi.string().required(),
    sectionId: Joi.string().optional().allow(null),
    question: Joi.string().required(),
  });

  const { error, value } = questionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  try {

    let newFile = null

    const userId = req.user._id

    const { courseId, sectionId, question } = value

    if (req.files && req.files.image) {

      const image = req.files.image;

      if (!image.mimetype.startsWith("image/")) {
        return next(createError("File must be an image", 400))
      }

      const uniqueName = Date.now() + path.extname(image.name)
      const uploadPath = path.join(__dirname, "../uploads/faqs", uniqueName)

      image.mv(uploadPath, async (err) => {

        if (err) {
          return next(createError("File upload failed", 500))
        }

        newFile = new File({
          originalName: image.name,
          uniqueName: uniqueName,
          filePath: `/uploads/faqs/${uniqueName}`,
          fileType: image.mimetype,
          fileSize: image.size,
          user: userId,
        })

        await newFile.save()

      })

    }

    const userStudentDoc = await Student.findOne({ userObjRef: userId })

    if (!userStudentDoc) {
      return next(createError("Student not exist", 404))
    }

    const course = await Course.findById(courseId)

    if (!course) {
      return next(createError("course not exist", 404))
    }

    const isEnrolled = course.studentsEnrolled.some((id) => id.toString() === userStudentDoc._id.toString())

    if (!isEnrolled) {
      return next(createError("you are not enrolled in this course to add question", 400))
    }

    const instructor = await Instructor.findById(course.instructorId).populate("")

    if (!instructor) {
      return next(createError("instructor not exist", 404));
    }

    const instructorUserDoc = await User.findById(instructor.userObjRef);

    const userDocObj = await User.findById(req.user._id);

    let sectionName = null;

    if (sectionId) {
      const section = course.sections.find(
        (sec) => sec._id.toString() === sectionId
      );

      if (section) {
        sectionName = section.name;
      } else {
        return next(createError("Section not found in course", 404));
      }
    }

    let newQuestion = new Question({
      courseId,
      sectionId,
      userId: req.user._id,
      studentId: userStudentDoc._id,
      instructorId: course.instructorId,
      instructorUserDocId: instructorUserDoc._id,
      question,
      questionOwnerName: userDocObj.name,
      sectionName,
    });

    if (newFile) {
      newQuestion.image = newFile._id;
    }

    await newQuestion.save();

    res.status(201).send({
      message: newFile
        ? "New question and image been uploaded"
        : "New question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};




const replyFaqAnswer = async (req, res, next) => {
  
  const answerSchema = Joi.object({
    questionId: Joi.string().required(),
    courseId: Joi.string().required(),
    answer: Joi.string().required().min(2).max(500),
  });

  const { error, value } = answerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  try {
    const userId = req.user._id;

    const userRole = req.user.role;

    const { questionId, answer, courseId } = value;

    const question = await Question.findById(questionId);

    if (!question) {
      return next(createError("Question not found", 404));
    }

    const newAnswer = {
      answer,
    };

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("course not exist", 404));
    }

    const userDocObj = await User.findById(req.user._id);

    if (userRole === "student") {
      const student = await Student.findOne({ userObjRef: userId });

      if (!student) {
        return next(createError("Student not found", 404));
      }

      newAnswer.studentId = student._id;
      newAnswer.instructorId = course.instructorId;
      newAnswer.userId = req.user._id;
      newAnswer.answerOwnerName = userDocObj.name;

      const instructor = await Instructor.findById(course.instructorId);

      const newNotification = new Notification({
        from: student.userObjRef,
        to: instructor.userObjRef,
        type: "question_reply",
        courseId: course._id,
        message: `${student.name} replied on question : ${question.question}`,
      });

      await newNotification.save();
    } else if (userRole === "instructor") {
      const instructor = await Instructor.findOne({ userObjRef: userId });

      if (!instructor) {
        return next(createError("Instructor not found", 404));
      }

      if (course.instructorId.toString() !== instructor._id.toString()) {
        return next(
          createError("course authors only can reply for questions", 400)
        );
      }

      newAnswer.instructorId = instructor._id;
      newAnswer.studentId = question.studentId;
      newAnswer.userId = req.user._id;
      newAnswer.answerOwnerName = userDocObj.name;

      const newNotification = new Notification({
        from: instructor.userObjRef,
        to: question.userId,
        type: "question_reply",
        courseId: course._id,
        message: `instructor replied on question : ${question.question}`,
      });

      await newNotification.save();
    } else {
      return next(createError("Unauthorized role to add an answer", 403));
    }

    question.answers.push(newAnswer);

    await question.save();

    res.status(201).send({
      message: "Answer added successfully",
      question,
    });

  } catch (error) {
    next(error);
  }
};




const getCourseQuestions = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = 10;

    const skip = (page - 1) * limit;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found", 404));
    }

    const questions = await Question.find({ courseId })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "studentId",
        select: "name email",
      })
      .populate({
        path: "instructorId",
        select: "name email",
      })
      .populate({
        path: "answers.studentId answers.instructorId",
        select: "name email",
      })
      .exec();

    const totalQuestions = await Question.countDocuments({ courseId });

    res.status(200).json({
      questions,
      page,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
    });
  } catch (error) {
    next(error);
  }
};





const incrementSectionView = async (req, res, next) => {
  try {
    const { courseId, sectionId } = req.params;

    const userId = req.user._id;

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        "sections._id": sectionId,
        "sections.views.userId": { $ne: userId },
      },
      {
        $inc: { "sections.$.viewCount": 1 },
        $addToSet: { "sections.$.views": { userId, timestamp: new Date() } },
      },
      { new: true }
    );

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};




const incrementAttachmentView = async (req, res, next) => {
  try {
    const { courseId, sectionId, attachmentId } = req.params;

    const userId = req.user._id;

    const course = await Course.findOne({
      _id: courseId,
      "sections._id": sectionId,
      "sections.items.attachments._id": attachmentId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course, section, or attachment not found." });
    }

    const section = course.sections.find(
      (section) => section._id.toString() === sectionId
    );

    if (!section) {
      return next(createError("section not exist", 404));
    }

    const item = section.items.find((item) =>
      item.attachments.some((att) => att._id.toString() === attachmentId)
    );

    if (!item) {
      return next(createError("item not exist", 404));
    }

    const attachment = item.attachments.find(
      (att) => att._id.toString() === attachmentId
    );

    if (!attachment) {
      return next(createError("attachment not exist", 404));
    }

    if (
      !item.views.some((view) => view.userId.toString() === userId.toString())
    ) {
      item.viewCount += 1;
      item.views.push({ userId, timestamp: new Date() });
      await course.save();
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};




const getCategoriesTypes = async (req, res, next) => {

  try {

    const categories = Course.schema.path("category").enumValues

    res.status(200).json(categories)

  } catch (error) {
    next(error)
  }

}




const suggestTopRatedCourses = async (req, res, next) => {
  
  try {

    const page  = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const aggregationPipeline = [
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" }, 
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          coursePic: 1,
          averageRating: 1,
          studentsEnrolledCount: { $size: { $ifNull: ["$studentsEnrolled", []] } },
        },
      },
    ];

    const highestRatedCourses = await Course.aggregate([
      ...aggregationPipeline,
      { $skip: skip },
      { $limit: limit },
    ])

    const totalCoursesArr = await Course.aggregate([...aggregationPipeline, { $count: "total" }])
    const totalCourses = totalCoursesArr.length > 0 ? totalCoursesArr[0].total : 0

    res.status(200).json({
      success: true,
      courses: highestRatedCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
    })

  } catch (error) {
    next(error)
  }

}





const suggestMostEnrolledCourses = async (req , res , next) => {

  try {
    
    const mostEnrolledCourses = await Course.aggregate([
      {
        $addFields: {
          studentsEnrolledCount: { $size: "$studentsEnrolled" },
        },
      },
      {
        $sort: { studentsEnrolledCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          coursePic: 1,
          studentsEnrolledCount: 1,
          averageRating: { $avg: "$ratings.rating" },
        },
      },
    ])

    res.status(200).json({ success : true , courses : mostEnrolledCourses })

  } catch (error) {
    next(error)
  }
  
}




const  getCourseByCategory = async (req, res, next) => {

  const { category } = req.params

  const page = parseInt(req.query.page) || 1

  const limit = 10

  try {

    const validCategories = ['k-12', 'University', 'Trainee']

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const totalCourses = await Course.countDocuments({ category })

    const courses = await Course.find({ category })
      .skip((page - 1) * limit) 
      .limit(limit) 
      .exec()
      

    res.status(200).json({
      totalCourses,
      totalPages : Math.ceil(totalCourses / limit),
      currentPage : page,
      courses
    })

  } catch (err) {
    next(err)
  }

}




const getNewestCourses = async (req, res, next) => {

  const limit = 8

  try {

    const courses = await Course.find()
      .sort({ createdAt: -1 }) 
      .limit(limit) 
      .exec();

    if (courses.length === 0) {
      return res.status(200).json({ courses: [] })
    }

    res.status(200).json({ courses })

  } catch (err) {
    next(err)
  }

}




const getTotalCoursesCount = async (req , res , next) => {

  try {
    
    const count = await Course.countDocuments();

    res.status(200).json({ totalCourses: count })

  } catch (error) {
    next(err)
  }

}




const getRandomFeedbacks = async (req , res , next) => {

  try {

    const courses = await Course.aggregate([
      { $sample: { size: 5 } },
      { $project: { feedbacks: 1 } }
    ])

    const feedbacks = courses.map(course => {
      const randomFeedback = course.feedbacks[Math.floor(Math.random() * course.feedbacks.length)]
      return randomFeedback;
    })

    res.status(200).json({ feedbacks })

  } catch (err) {
    next(err)
  }

}




const getCoursesLearningCategories = async (req , res , next) => {

  try {

    const learningCategories = Course.schema.path("learningCategory").enumValues

    res.status(200).json(learningCategories)

  } catch (err) {
    next(err)
  }

}






module.exports = {
  getAllCourses,
  getNotEnrolledCourses,
  getCourseById,
  getItemAttachment,
  startItemActivity,
  modifyCourseSection,
  modifyItemInSection,
  deleteCourseSection,
  removeItemFromSection,
  deleteAttachment,
  changeSectionName,
  changeItemName,
  suggestTopCourses,
  searchCoursesByTitle,
  searchCoursesByInstructor,
  searchCoursesByTags,
  searchCoursesByDuration ,
  listCategoriesWithCourses,
  addFaqQuestion,
  replyFaqAnswer,
  getCourseQuestions,
  incrementSectionView,
  incrementAttachmentView,
  getCategoriesTypes,
  suggestTopRatedCourses ,
  suggestMostEnrolledCourses ,
  getCourseByCategory ,
  getNewestCourses ,
  getTotalCoursesCount ,
  getRandomFeedbacks ,
  getCoursesLearningCategories
}
