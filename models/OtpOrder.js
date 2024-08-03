const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.OtpOrder || mongoose.model("OtpOrder", schema);

module.exports = model;
