const mongoose = require("mongoose")



const InviteTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    createdAt: { type: Date, default: Date.now , expires: '7d' }
})



const InviteGroupToken = mongoose.model("InviteToken" , InviteTokenSchema)



module.exports = InviteGroupToken
