const mongoose = require("mongoose")


const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Technology', 'Business', 'Health', 'Arts', 'Science'], 
  },
}, { timestamps: true });



const Category = mongoose.model("categories", CategorySchema)


module.exports = Category
