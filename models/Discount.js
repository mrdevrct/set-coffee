const mongoose = require("mongoose");
require("./User");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },

    percent: {
      type: Number,
      required: true,
    },

    maxUse: {
      type: Number,
      required: true,
    },

    uses: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    usedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.Discount || mongoose.model("Discount", schema);

module.exports = model;
