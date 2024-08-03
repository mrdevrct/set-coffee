import mongoose from "mongoose";
require("./Product");
require("./Order");

const schema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.OrderItem || mongoose.model("OrderItem", schema);

export default model;
