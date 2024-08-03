const mongoose = require("mongoose");
require("./Comment");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  shortDesc: {
    type: String,
    required: true,
  },

  longDesc: {
    type: String,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  suitableFor: {
    type: String,
    required: true,
  },

  smell: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    default: 5,
  },

  inventory: {
    type: Number,
    default: 0,
  },

  img: {
    type: String,
    required: true,
  },

  comments: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  tags: {
    type: [String],
    required: true,
  },
});

const model = mongoose.models.Product || mongoose.model("Product", schema);

module.exports = model;
