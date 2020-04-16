const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const checkAuth = require("../middleware/check-auth");

const User = require("../models/user");
const NewUserData = require("../models/NewUserData");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    //cb(error, "../images/");
    console.log("service oathm"+ path.join(__dirname, '../images/'));
    cb(null, path.join(__dirname, '../images/'));
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(".")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + new Date().toISOString().replace(/:/g, '-') + "." + ext);
  }
});

var uploading = multer({ storage: storage }).single("userProfilePic");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "User Created",
          result: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Auth Failed",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Auth Failed",
        });
      }
      // JSON web token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "NM_Finance_secret_password",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Login Successful",
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth Failed",
      });
    });
});

router.get("/getAllUser", (req, res, next) => {
  const userList = NewUserData.find();
  let fetchedUserList;
  userList
    .then((result) => {
      fetchedUserList = result;
      return NewUserData.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "success",
        userList: fetchedUserList,
        userListCount: count,
      });
    });
});

router.get("/getUserById/:id", (req, res, next) => {
  NewUserData.findById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not Fount" });
    }
  });
});


router.post("/addNewUser", checkAuth, uploading, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("url->"+ url);
  const newUserData = NewUserData({
    prefix: req.body.prefix,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    areaCode: req.body.areaCode,
    mobileNumber: req.body.mobileNumber,
    dob: req.body.dob,
    gender: req.body.gender,
    martialStatus: req.body.martialStatus,
    addresLine1: req.body.addresLine1,
    addresLine2: req.body.addresLine2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    loanAmount: req.body.loanAmount,
    intrestRate: req.body.intrestRate,
    term: req.body.term,
    loanStartDate: req.body.loanStartDate,
    creator: req.userData.userId,
    imagePath: url + "/images/" + req.file.filename
  });
  console.log("add New User Data -> " + newUserData);

  newUserData
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "success",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "error",
        result: err,
      });
    });
});

router.delete("/deleteUser/:id", checkAuth, (req, res, next) => {
  NewUserData.deleteOne({ _id: req.params.id }).then(result => {
    console.log("response : " + result);
    res.status(200).json({ message: "User Deleted" });
  });
});

module.exports = router;
