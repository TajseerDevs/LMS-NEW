// const multer = require("multer");
// const path = require("path");


// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 100000000 } // 100MB file size limit
// }).single("scormPackage");

// module.exports = upload;




// const multer = require('multer');
// const path = require('path');

// // Define storage and file filter for multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');  // Specify the directory to save uploaded files
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// // Create multer upload instance
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 100000000 },  // 100MB file size limit
// }).single('scormPackage');  // Ensure 'scormPackage' matches the field name in FormData


// module.exports = upload;





const multer = require("multer")


const storage = multer.memoryStorage()


const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
})



module.exports = upload
