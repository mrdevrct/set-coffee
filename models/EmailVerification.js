const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expTime: {
      type: Number,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const model =  mongoose.models.EmailVerification || mongoose.model("EmailVerification", emailVerificationSchema);

module.exports = model;
