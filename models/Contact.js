const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: false,
    default: null,
  },

  message: {
    type: String,
    required: true,
  },
});

const model = mongoose.models.Contact || mongoose.model("Contact", schema);

module.exports = model;
