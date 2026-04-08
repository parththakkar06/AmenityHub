// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./uploads"); // 
  // },
  filename: (req, file, cb) => {
    // unique file name
    cb(null,file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.test(ext)) {
    console.log("here")
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits : {fileSize : 1000000}
});

module.exports = upload;