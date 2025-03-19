const express = require("express");
const { protectRoutes } = require("../middlewares/auth");
const { getNotifications, deleteNotifications, deleteNotification } = require("../controllers/notification.controller");



const router = express.Router();


router.get("/" , protectRoutes , getNotifications) // ui todo

router.delete("/" , protectRoutes , deleteNotifications) // ui todo

router.delete("/:notificationId" , protectRoutes , deleteNotification) // ui todo


module.exports = router
