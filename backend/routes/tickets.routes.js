const {Router} = require("express")

const {protectRoutes} = require("../middlewares/auth")

const {
    getAllUserTickets , 
    addNewTicket , 
    deleteTicket,
    getFilteredTickets,
    updateTicket
} = require("../controllers/tickets.controller")


const router = Router()


router.get("/" , protectRoutes , getAllUserTickets)

router.post("/new-ticket" , protectRoutes , addNewTicket)

router.put("/update/:ticketId", protectRoutes, updateTicket)

router.delete("/delete-ticket/:ticketId" , protectRoutes , deleteTicket)

router.get("/filtered-tickets" , protectRoutes , getFilteredTickets)


module.exports = router