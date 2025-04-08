const Ticket = require("../models/Ticket")


const generateUniqueTicketCode = async () => {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let code
    let exists = true
  
    while (exists) {

      code = Array.from({ length: 8 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('')
  
      const existing = await Ticket.findOne({ ticketCode: code })
      if (!existing) exists = false

    }
  
    return code
}


module.exports = generateUniqueTicketCode
  