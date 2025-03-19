const express = require("express")
const { protectRoutes } = require("../middlewares/auth")

const { getCalendarEvents } = require("../controllers/calendar.controller")



const router = express.Router()



router.get("/events" , protectRoutes , getCalendarEvents)



module.exports = router