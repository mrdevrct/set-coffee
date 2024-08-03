const mongoose = require("mongoose");
require("./Product");
require("./User");

const schema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },

  username: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "USER",
  },

  email: {
    type: String,
    required: false,
  },

  replay : {
    type: String,
    required: false,
  },

  body: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    default: 5,
    enum: [1, 2, 3, 4, 5],
  },

  isAccept: {
    type: Boolean,
    default: false,
  },

  hasAnswer: {
    type: Boolean,
    default: false,
  },

  isAnswer: {
    type: Boolean,
    default: false,
  },

  mainComment: {
    type: mongoose.Types.ObjectId,
    ref: "Comment",
    required: false,
  },

  date: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },

  productID: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
});

const model = mongoose.models.Comment || mongoose.model("Comment", schema);

module.exports = model;
