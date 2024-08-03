import mongoose from "mongoose";
require("./User");

const schema = new mongoose.Schema({
  user: {
    type : mongoose.Types.ObjectId,
    ref : 'User',
    required: true
  },

  address: {
    type: String,
    required: true,
  },

  province: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  postal_code: {
    type: String,
    required: true,
  },
});

const model = mongoose.models.Address || mongoose.model("Address", schema);

export default model;
