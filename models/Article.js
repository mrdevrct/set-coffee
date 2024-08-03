import mongoose from "mongoose";
require("./User")

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    cover_image: {
      type: String,
      required: true,
    },

    images: {
      type: [
        {
          type: String,
        },
      ],
    },

    sights: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Sight",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.Article || mongoose.model("Article", schema);

export default model;
