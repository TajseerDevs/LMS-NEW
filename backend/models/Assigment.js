const mongoose = require("mongoose");


const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    mark : {
      type : Number , 
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignmentFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "files",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructors",
      required: true,
    },    
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "submissions",
      },
    ],
  },
  { timestamps: true }
)


const Assignment = mongoose.model("assignments" , assignmentSchema)


module.exports = Assignment





// adding an array of submissionIds in the Assignment schema. This allows you to track all submissions associated with a particular assignment directly in the Assignment document. The reason for this is that it provides better performance when querying for an assignment and its related submissions, especially when dealing with a large number of submissions. You will not need to perform an additional query to fetch the related submissions; you can simply reference the array of submissionIds that belong to the assignment.