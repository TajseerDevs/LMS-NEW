const mongoose = require('mongoose')


const AdaptiveRuleSchema = new mongoose.Schema({
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    recommendedContentType: { type: String, enum: ['Video', 'Activity', 'Document' , 'Image']},
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' },
})


const Adaptive = mongoose.model("adaptives" , AdaptiveRuleSchema)


module.exports = Adaptive
