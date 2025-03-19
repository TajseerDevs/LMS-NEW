const express = require("express")

const { protectRoutes } = require("../middlewares/auth")

const { 
    createGroup, 
    updateGroup, 
    addGroupMembers, 
    removeGroupMember, 
    getGroupDetails, 
    leaveGroup, 
    assignGroupMemberToAdmin,
    demoteUserFromAdmin,
    deleteGroup,
    generateInviteLink,
    handleInviteLink,
    approveOrRejectUserInvitation
} = require("../controllers/group.controller")



const router = express.Router()



router.post("/create-group" , protectRoutes , createGroup)

router.put("/update-group/:groupId" , protectRoutes , updateGroup)

router.post("/add-group-members/:groupId" , protectRoutes , addGroupMembers)

router.delete("/remove-group-member/:groupId/:userId" , protectRoutes , removeGroupMember)

router.get("/:groupId/details" , protectRoutes , getGroupDetails)

router.post("/leave-group/:groupId" , protectRoutes , leaveGroup)

router.post("/:groupId/promote/:userId" , protectRoutes , assignGroupMemberToAdmin)

router.post("/:groupId/demote/:userId" , protectRoutes , demoteUserFromAdmin)

router.post("/delete-group/:groupId" , protectRoutes , deleteGroup)

router.post("/invite-user/:groupId" , protectRoutes , generateInviteLink)

router.post("/handle-invite/:token" , protectRoutes , handleInviteLink)

router.post("/change-invitation-status/:groupId/:userId" , protectRoutes , approveOrRejectUserInvitation)



module.exports = router