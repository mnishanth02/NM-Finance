const NewUserData = require("../models/NewUserData");

exports.getAllUsers = (req, res, next) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while Fetching User Data.",
      });
    });
};

exports.addNewUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("url->" + url);
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
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    loanAmount: req.body.loanAmount,
    intrestRate: req.body.intrestRate,
    term: req.body.term,
    loanStartDate: req.body.loanStartDate,
    creator: req.userData.userId,
    imagePath: url + "/images/" + req.file.filename,
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
      res.status(500).json({
        message: "Error while adding New User.",
      });
    });
};

exports.getUserById = (req, res, next) => {
  NewUserData.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while Fetching User Data.",
      });
    });
};

exports.updateUser = (req, res, next) => {
  let imagePathTemp = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePathTemp = url + "/images/" + req.file.filename;
  }

  const updateUserData = NewUserData({
    _id: req.params.id,
    prefix: req.body.prefix,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    areaCode: req.body.areaCode,
    mobileNumber: req.body.mobileNumber,
    dob: req.body.dob,
    gender: req.body.gender,
    martialStatus: req.body.martialStatus,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    loanAmount: req.body.loanAmount,
    intrestRate: req.body.intrestRate,
    term: req.body.term,
    loanStartDate: req.body.loanStartDate,
    creator: req.userData.userId,
    imagePath: imagePathTemp,
  });
  NewUserData.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId,
    },
    updateUserData
  )
    .then((result) => {
      console.log("reslultUpdate- >" + result);
      if (result.n > 0) {
        res.status(200).json({ message: "success", result: result });
      } else {
        res.status(401).json({ message: "error", result: result });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while Updating user.",
      });
    });
};

exports.deleteUser = (req, res, next) => {
  NewUserData.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      // if (result.nModified > 0) {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion Successful" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while deleting the user.",
      });
    });
};
