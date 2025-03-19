const mongoose = require("mongoose");


const trackingSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attachments",
    required: true,
  },
  trackedUser : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  score: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
  },
  passScore: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
  },
  userScore: {
    type: mongoose.Schema.Types.Number,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot be more than 100"],
    default : 0 
  },
  passed: { type: Boolean, default : false},
  completed: { type: Boolean , default : false},
  spentTime: { type: mongoose.Schema.Types.Number },
  startingTime: { type: mongoose.Schema.Types.Date },
  endingTime: { type: String },
  attempts: { type: mongoose.Schema.Types.Number , default : 0 },
});



trackingSchema.virtual("Activity", {
  localField: "activityId",
  foreignField: "_id",
  justOne: true,
  ref: "activites",
});



const Tracking = mongoose.model("trackings", trackingSchema);

module.exports = Tracking;