const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    default : "کاربر ست کافی"
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  
  img: {
    type: String,
    default : ""
  },

  role: {
    type: String,
    default: "USER",
  },
  refreshToken: {
    type: String,
  },
});

const model = mongoose.models.User || mongoose.model("User", schema);

export default model;
