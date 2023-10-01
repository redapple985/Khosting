const multer = require("multer");
const jwt = require("jsonwebtoken");
const { extensions } = require("firebase-tools/lib/init/features");
let extension;
const cryptLib = require("@skavinvarnan/cryptlib");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the folder to save the file to
    let folderPath;

    if (file.mimetype.startsWith("video/")) {
      folderPath = "postvideos";
      extension = ".mp4";
    } else if (file.mimetype.startsWith("image/")) {
      extension = ".png";
      folderPath = "postimages";
    } else {
      // The file is not a video or an image
      return cb(new Error("Invalid file type"));
    }

    cb(null, folderPath);

    //decode json token
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the file

    //decrypt userId
    const userid = req.body.userId;
    const fileName = Date.now() + "_" + userid + "_" + file.originalname;
    console.log(userid);
    console.log("Added");
    cb(null, fileName);
  },
});

//approx 1 MB
const filesize = 1000000 * 5;

//getting multer ready with restrictions and storage options
const uploadpostmedia = multer({
  storage: storage,
  limits: {
    filesize: filesize,
  },
  fileFilter: (request, file, cb) => {
    if (file.size > filesize) {
      cb(null, false);
      console.log(file.size);
      return cb(new Error("File too large"));
    }

    cb(undefined, true);
  },
});

module.exports = uploadpostmedia;
