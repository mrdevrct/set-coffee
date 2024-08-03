import connectToDB from "@/configs/db";
import SightModel from "@/models/Sight";
import ArticleModel from "@/models/Article";
import { validateEmail } from "@/utils/auth";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { user, username, email, body, articleID, company } = reqBody;

    if (!user) {
      return Response.json({ message: "title is required" }, { status: 400 });
    }

    if (!username) {
      return Response.json(
        { message: "username is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json({ message: "email is required" }, { status: 400 });
    }

    if (!body) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    if (!articleID) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json({ message: "email is not valid" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(user)) {
      return Response.json(
        { message: "user id is not valid" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(articleID)) {
      return Response.json(
        { message: "article id is not valid" },
        { status: 400 }
      );
    }

    const sight = await SightModel.create({
      user,
      username,
      email,
      body,
      company,
      articleID,
    });

    const articleUpadted = await ArticleModel.findOneAndUpdate(
      { _id: articleID },
      { $push: { sights: sight._id } }
    );

    return Response.json(
      { message: "sight created successfully:)" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Server error: ", e }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { sightID } = reqBody;

    if (!sightID) {
      return Response.json(
        { message: "sight id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(sightID)) {
      return Response.json(
        { message: "sight id is not valid" },
        { status: 404 }
      );
    }

    const sight = await SightModel.findOne({ _id: sightID });
    if (!sight) {
      return Response.json({ message: "sight not found" }, { status: 404 });
    }

    await SightModel.findOneAndDelete({ _id: sightID });

    return Response.json(
      { message: "sight removed successfully:)" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: "Server error: ", e }, { status: 500 });
  }
}
