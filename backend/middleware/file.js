const multer = require("multer");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    //cb(error, "../images/");
    console.log("service oathm" + path.join(__dirname, "../images/"));
    cb(null, path.join(__dirname, "../images/"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(".").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(
      null,
      name + "-" + new Date().toISOString().replace(/:/g, "-") + "." + ext
    );
  },
});

module.exports = multer({ storage: storage }).single("userProfilePic");
