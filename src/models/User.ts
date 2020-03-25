const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  role: {
    type: String,
    enum: ["customer", "owner","admin"],
    default: "customer"
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false
  },
  address:{
    type: String,
    required: [true, "Please add a password"]
    },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  activity: Number,
  offer: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});