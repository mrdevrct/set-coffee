import mongoose from "mongoose";
require("./User");
require("./Address");

const schema = new mongoose.Schema(
  {
    firstname :{
      type: String,
      required: true,
    },

    lastname :{
      type: String,
      required: true,
    },

    company : {
      type: String,
    },

    address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    email :{
      type: String,
      required: false,
    },

    phone :{
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "canceled"],
      default: "pending",
      required: true,
    },

    total_price: {
      type: Number,
      required: true,
    },

    payment_method: {
      type: String,
      required: true,
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.Order || mongoose.model("Order", schema);

export default model;
