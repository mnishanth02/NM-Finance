const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const addNewUserSchema = mongoose.Schema({
  prefix: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  areaCode: { type: String, required: true },
  mobileNumber: { type: Number, required: true, unique: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  martialStatus: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  country: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  intrestRate: { type: Number, required: true },
  term: { type: Number, required: true },
  loanStartDate: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,  required: true },
  imagePath: { type: String, required: true }

});

addNewUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("NewUser", addNewUserSchema);
