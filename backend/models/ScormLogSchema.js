const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for nested structures
const CorrectResponseSchema = new Schema({
  pattern: { type: String, required: false },
});

const ObjectiveSchema = new Schema({
  id: { type: String, required: false },
});

const ActivitySchema = new Schema({
  key: { type: String, required: false },
  id: { type: String, required: false },
  time: { type: String, required: false },
  type: { type: String, required: false },
  weighting: { type: Number, required: false },
  student_response: { type: String, required: false },
  result: { type: String, required: false },
  latency: { type: String, required: false },
  objectives: {
    type: [ObjectiveSchema],
    required: false,
  },
  correct_responses: {
    type: [CorrectResponseSchema],
    required: false,
  },
});

// Main schema for storing lesson data
const LessonSchema = new Schema({
  userId: { type: String, required: true },  // Add userId to identify user logs
  student_id: { type: String, required: false },
  student_name: { type: String, required: false },
  lesson_mode: { type: String, required: false },
  exit: { type: String, required: false },
  lesson_status:{type:String ,required : false },
  duration: { type: String, required: false },  // cmi.core.session_time
  score: {
    raw: { type: String, required: false },
    min: { type: String, required: false },
    max: { type: String, required: false },
  },
  interactions: { type: [ActivitySchema], required: false },
  attachement : {type: mongoose.Schema.Types.ObjectId , ref: "attachments"},
  courseId : {type: mongoose.Schema.Types.ObjectId , ref: "courses"},
  completionPercentage : {type: Number, required: false}
  // suggestions
  // timeSpent: { type: Number, required: false }, // Total time in minutes
  // engagementScore: { type: Number, required: false }, // AI-calculated score
} , {timestamps : true});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
