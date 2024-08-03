import mongoose from "mongoose";

const sightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: false,
    },
    articleID: {
      type: mongoose.Types.ObjectId,
      ref: "Article",
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
    replay: {
      type: mongoose.Types.ObjectId,
      ref: "Sight",
    },
    mainSight: {
      type: mongoose.Types.ObjectId,
      ref: "Sight",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Sight = mongoose.models.Sight || mongoose.model("Sight", sightSchema);

export default Sight;
