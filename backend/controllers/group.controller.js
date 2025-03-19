const Group = require("../models/Group")
const User = require("../models/User")
const Message = require("../models/Message")
const Conversation = require("../models/Conversation")
const File = require("../models/File")
const path  = require("path")
const fs  = require("fs")
const crypto = require("crypto")

const createError = require("../utils/createError")
const InviteGroupToken = require("../models/InviteGroupToken")




const createGroup = async (req, res, next) => {

    try {
        
        const {name , description , addedGroupMembers} = req.body

        const userId = req.user._id

        const groupImagesDir = path.resolve(__dirname, "../uploads/groups_images")
            
        if (!fs.existsSync(groupImagesDir)) {
            fs.mkdirSync(groupImagesDir , { recursive: true })
        }

        if (!name || name.length === 0 || name.length > 30 || !addedGroupMembers || !addedGroupMembers.length) {
            return next(createError("Invalid group fields" , 400))
        }

        const user = await User.findById(userId)

        if(!user){
            return next(createError("User not exist" , 404))
        }

        if(user.role !== "instructor" && user.role !== "admin"){
            return next(createError("you are not authorized to create new group" , 404))
        }

        let groupImageUrl = null

        if (req.files && req.files.groupPic) {

            const groupPic = req.files.groupPic
      
            const allowedTypes = ["image/png", "image/jpg" , "image/jpeg"]
            
            if (!allowedTypes.includes(groupPic.mimetype)) {
              return next(createError("Invalid group image type. Only png , jpg , jpeg are allowed" , 400))
            }
      
            const uniqueName = `${Date.now()}-${groupPic.name}`
            const uploadPath = path.join(groupImagesDir , uniqueName)
      
            try {
      
              await groupPic.mv(uploadPath)
        
              const file = new File({
                originalName: groupPic.name,
                uniqueName,
                filePath: `/uploads/groups_images/${uniqueName}`,
                fileType: groupPic.mimetype,
                fileSize: groupPic.size,
                user: userId, 
              })
      
              await file.save()
        
              groupImageUrl = file.filePath
      
            } catch (error) {
              return res.status(500).json({ message: "Error uploading the file", error })
            }
      
          }

        const users = await Promise.all(addedGroupMembers.map((user) => {
                return User.findById(user)
            })
        )

        const usersIds = users.map((user) => user._id)

        const newGroup = new Group({
            name ,
            members: [...usersIds] ,
            groupCreatorId: user._id ,
            picture : groupImageUrl ? groupImageUrl : null ,
            description : description ? description : ""
        })

        const conversation = new Conversation()

        newGroup.members.unshift(user._id)

        newGroup.conversation = conversation._id

        conversation.group = newGroup._id
        
        conversation.isGroup = true

        if (!newGroup.admins.includes(user._id)) {
            newGroup.admins.push(user._id)
        }

        if (!conversation.members.includes(user._id)) {
            conversation.members.unshift(user._id)
        }
        
        addedGroupMembers.map((userId) => {
            if (!conversation.members.includes(userId)) {
              conversation.members.unshift(userId)
            }
        })

        conversation.members = Array.from(new Set([user._id, ...addedGroupMembers]))
        
        newGroup.members = Array.from(new Set([user._id, ...addedGroupMembers]))

        await conversation.save()

        await newGroup.save()

        res.status(201).json({ newGroup , conversation })

    } catch (error) {
        next(error)
    }

}




const updateGroup = async (req , res , next) => {

    try {
        
        const { groupId } = req.params;
        const { name , description , addedGroupMembers } = req.body
    
        const userId = req.user._id

        const group = await Group.findById(groupId).populate('members')

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== userId.toString() && req.user.role !== "admin") {
            return next(createError("You are not authorized to update this group", 403))
        }

        if (name && (name.length === 0 || name.length > 30)) {
            return next(createError("Invalid group name", 400))
        }

        if (name) group.name = name
        if (description) group.description = description

        const groupImagesDir = path.resolve(__dirname, "../uploads/groups_images")

        let newGroupImageUrl = null

        if (req.files && req.files.groupPic) {

            const groupPic = req.files.groupPic

            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"]

            if (!allowedTypes.includes(groupPic.mimetype)) {
                return next(createError("Invalid group image type. Only png, jpg, jpeg are allowed" , 400))
            }

            const uniqueName = `${Date.now()}-${groupPic.name}`
            const uploadPath = path.join(groupImagesDir, uniqueName)

            if (group.picture) {
             
                const previousFile = await File.findOne({ filePath : group.picture })
             
                if (previousFile) {

                    const previousFilePath = path.resolve(__dirname , `..${previousFile.filePath}`)

                    if (fs.existsSync(previousFilePath)) {
                        fs.unlinkSync(previousFilePath)
                    }

                    await previousFile.deleteOne()
                }

            }

            await groupPic.mv(uploadPath)

            const file = new File({
                originalName: groupPic.name,
                uniqueName,
                filePath: `/uploads/groups_images/${uniqueName}`,
                fileType: groupPic.mimetype,
                fileSize: groupPic.size,
                user: userId,
            })

            await file.save()

            newGroupImageUrl = file.filePath
            group.picture = newGroupImageUrl

        }

        await group.save();

        res.status(200).json({
            message: "Group updated successfully",
            group,
        })

    } catch (error) {
        next(error)
    }

}




const addGroupMembers = async (req , res , next) => {

    try {
        
        const { groupId } = req.params
        const { addedGroupMembers } = req.body

        const userId = req.user._id

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== userId.toString() && req.user.role !== "admin") {
            return next(createError("You are not authorized to add members to this group" , 403))
        }

        if (!addedGroupMembers || !Array.isArray(addedGroupMembers) || addedGroupMembers.length === 0) {
            return next(createError("Invalid members list", 400))
        }

        const users = await Promise.all(addedGroupMembers.map((userId) => User.findById(userId)))

        const validUsers = users.filter((user) => user)

        if (validUsers.length === 0) {
            return next(createError("No valid users to add", 400));
        }

        validUsers.forEach((user) => {
            if (!group.members.includes(user._id)) {
                group.members.push(user._id)
            }
        })

        await group.save()

        res.status(200).json({
            message: "Members added successfully",
            group,
        })

    } catch (error) {
        next(error)
    }

}




const removeGroupMember = async (req , res , next) => {

    try {
        
        const { groupId, userId } = req.params
        const loggedUserId = req.user._id

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== loggedUserId.toString() && req.user.role !== "admin") {
            return next(createError("You are not authorized to remove members from this group" , 403))
        }

        const userToRemove = group.members.find((member) => member.toString() === userId)
        
        if (!userToRemove) {
            return next(createError("User is not a member of this group" , 404))
        }

        group.members = group.members.filter((member) => member.toString() !== userId)

        if(group.admins.includes(userId)){
            group.admins = group.admins.filter(member => member._id.toString() !== userId.toString())
        }

        if (group.groupCreatorId.toString() === userId && group.admins.length === 0) {

            const newCreator = group.members.find(async (memberId) => {
                const member = await User.findById(memberId)
                return member && (member.role === 'admin' || member.role === 'instructor')
            })

            if (newCreator) {

                group.groupCreatorId = newCreator._id
                
                if (!group.admins.includes(newCreator._id)) {
                    group.admins.push(newCreator._id)
                }
                
            } else {
                group.groupCreatorId = group.members[0]
            }

        }

        await group.save()

        res.status(200).json({
            message: "User removed from the group successfully",
            group,
        })

    } catch (error) {
        next(error)
    }

}




const getGroupDetails = async (req , res , next) => {

    try {
        
        const { groupId } = req.params

        const group = await Group.findById(groupId).populate("members groupCreatorId")

        if (!group) {
            return next(createError("Group not found", 404))
        }

        res.status(200).json({
            message: "Group details fetched successfully",
            group, 
        })

    } catch (error) {
        next(error)
    }

}




const leaveGroup = async (req , res , next) => {

    try {
        
        const { groupId } = req.params
        const userId = req.user._id

        const group = await Group.findById(groupId).populate("members")

        if (!group) {
            return next(createError("Group not found", 404))
        }

        if (!group.members.some(member => member._id.toString() === userId.toString())) {
            return next(createError("You are not a member of this group" , 400))
        }

        if (group.groupCreatorId.toString() === userId.toString() && group.admins.length === 0) {

            const newCreator = group.members.find(member => member._id.toString() !== userId.toString())

            if (newCreator) {

                group.groupCreatorId = newCreator._id
                
                if (!group.admins.includes(newCreator._id)) {
                    group.admins.push(newCreator._id)
                }

            } else {
                return next(createError("Cannot leave the group as it has no other members", 400))
            }
        }

        group.members = group.members.filter(member => member._id.toString() !== userId.toString())

        if(group.admins.includes(userId)){
            group.admins = group.admins.filter(member => member._id.toString() !== userId.toString())
        }

        await group.save()

        res.status(200).json({
            message: "You have successfully left the group",
            group
        })

    } catch (error) {
        next(error)
    }

}




const assignGroupMemberToAdmin = async (req , res , next) => {

    try {
        
        const { groupId, userId } = req.params
        const currentUserId = req.user._id

        const group = await Group.findById(groupId).populate("members");

        if (!group) {
            return next(createError("Group not found", 404))
        }

        if (group.groupCreatorId.toString() !== currentUserId.toString() && req.user.role !== "admin") {
            return next(createError("You are not authorized to promote a group member to admin", 403))
        }

        const userToPromote = group.members.find(member => member._id.toString() === userId.toString())

        if (!userToPromote) {
            return next(createError("User not found in the group", 404))
        }

        if (group.admins.includes(userToPromote._id)) {
            return next(createError("User is already an admin", 400))
        }

        group.admins.push(userToPromote._id)

        await group.save()

        res.status(200).json({
            message: `User ${userToPromote.name} has been promoted to admin`,
            user: {
                userId: userToPromote._id,
                name: userToPromote.name,
            },
            group
        })

    } catch (error) {
        next(error)
    }

}




const demoteUserFromAdmin = async (req , res , next) => {

    try {
        
        const { groupId , userId } = req.params
        const currentUserId = req.user._id

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== currentUserId.toString() && !group.admins.includes(currentUserId) && req.user.role !== "admin") {
            return next(createError("You are not authorized to demote a user" , 403))
        }

        if (!group.admins.includes(userId)) {
            return next(createError("User is not an admin" , 400))
        }

        group.admins = group.admins.filter(admin => admin.toString() !== userId.toString())

        await group.save()

        res.status(200).json({
            message: "User has been demoted from admin role" ,
            group
        })

    } catch (error) {
        next(error)
    }

}




const deleteGroup  = async (req , res , next) => {

    try {
        
        const { groupId } = req.params
        const userId = req.user._id

        const group = await Group.findById(groupId).populate("conversation")

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== userId.toString() && req.user.role !== "admin") {
            return next(createError("You are not authorized to delete this group", 403))
        }

        if (group.conversation) {
            await Message.deleteMany({ conversation : group.conversation._id })
            await File.deleteMany({ group : group._id })
            await Conversation.findByIdAndDelete(group.conversation._id)
        }

        await Group.findByIdAndDelete(groupId)

    } catch (error) {
        next(error)
    }

}




const generateInviteLink = async (req, res, next) => {

    try {
    
        const { groupId } = req.params
        const userId = req.user._id

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError("Group not found", 404))
        }

        if (!group.members.includes(userId)) {
            return next(createError("You are not a member of this group", 403))
        }

        const token = crypto.randomBytes(20).toString("hex")

        const inviteToken = new InviteGroupToken({ token , groupId })
        await inviteToken.save()

        const inviteLink = `${process.env.BASE_URL}/group/invite/${token}`

        res.status(200).json({ message: "Invite link generated successfully", inviteLink })

    } catch (error) {
        next(error)
    }

}




const handleInviteLink = async (req, res, next) => {

    try {

        const { token } = req.params
        const userId = req.user._id

        const inviteToken = await InviteGroupToken.findOne({ token })

        if (!inviteToken) {
            return next(createError("Invalid or expired invite link" , 400))
        }

        const group = await Group.findById(inviteToken.groupId)

        if (!group) {
            return next(createError("Group not found", 404))
        }

        const tokenAge = Date.now() - inviteToken.createdAt.getTime()

        const maxTokenAge = 7 * 24 * 60 * 60 * 1000

        if (tokenAge > maxTokenAge) {
            return next(createError("This invite link has expired" , 400))
        }

        if (group.members.includes(userId) || group.waitingList.includes(userId)) {
            return next(createError("You are already part of this group or waiting approval" , 400))
        }

        group.waitingList.push(userId)

        await group.save()

        res.status(200).json({ message: "You have been added to the waiting list" , group })
    
    } catch (error) {
        next(error)
    }

}




const approveOrRejectUserInvitation = async (req , res , next) => {

    try {
        
        const { groupId, userId } = req.params
        const { action } = req.body
        
        const loggedUserId = req.user._id

        const group = await Group.findById(groupId)

        if (!group) {
            return next(createError("Group not found" , 404))
        }

        if (group.groupCreatorId.toString() !== loggedUserId.toString() && !group.admins.includes(loggedUserId)) {
            return next(createError("You are not authorized to perform this action", 403))
        }

        if (!group.waitingList.includes(userId)) {
            return next(createError("User is not in the waiting list" , 400))
        }

        if (action === "approve") {
            group.members.push(userId)
            group.waitingList = group.waitingList.filter((id) => id.toString() !== userId)
        } else if (action === "reject") {
            group.waitingList = group.waitingList.filter((id) => id.toString() !== userId)
        } else {
            return next(createError("Invalid action" , 400))
        }

        await group.save()

        res.status(200).json({
            message: `User ${action === "approve" ? "approved" : "rejected"} successfully` ,
            group,
        })

    } catch (error) {
        next(error)
    }

}







module.exports = {
    createGroup , 
    updateGroup , 
    addGroupMembers , 
    removeGroupMember , 
    getGroupDetails ,
    leaveGroup ,
    assignGroupMemberToAdmin ,
    demoteUserFromAdmin ,
    deleteGroup ,
    generateInviteLink ,
    handleInviteLink ,
    approveOrRejectUserInvitation
}