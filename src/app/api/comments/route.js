import connectToDB from "@/configs/db";
import { validateEmail } from "@/utils/auth";
import mongoose from "mongoose";
import CommentModel from "@/models/Comment";
import UserModel from "@/models/User";
import ProductModel from "@/models/Product";

export async function POST(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { userID, username, email, body, score, productID } = reqBody;

    //Validation
    if (!username.trim() || !email.trim() || !body.trim() || !productID.trim) {
      return Response.json(
        { message: "Username, email, and body are required." },
        { status: 400 }
      );
    }

    if (!userID) {
      return Response.json({ message: "please login first" }, { status: 404 });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return Response.json(
        { message: "user id not valid !!" },
        { status: 401 }
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "The email address is not valid." },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(productID)) {
      return Response.json(
        { message: "The Product is not valid." },
        { status: 400 }
      );
    }

    const userExits = await UserModel.findOne({ _id: userID });
    if (!userExits) {
      return Response.json({ message: "User Not Found !!!" }, { status: 404 });
    }

    const comment = await CommentModel.create({
      userID,
      username,
      email,
      body,
      score: score || 5,
      productID,
    });

    const productUpadted = await ProductModel.findOneAndUpdate(
      { _id: productID },
      { $push: { comments: comment._id } }
    );

    return Response.json(
      { message: "comment created successfully:)" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Server error: ", e }, { status: 500 });
  }
}

export async function GET() {
  connectToDB();
  const comments = await CommentModel.find({}, "-__v");
  return Response.json(comments);
}

export async function DELETE(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { commentID } = body;

    if (!commentID) {
      return Response.json(
        { message: "commentID are required." },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(commentID)) {
      return Response.json(
        { message: "comment id not valid !!" },
        { status: 401 }
      );
    }

    const isExitsComment = await CommentModel.findOne({ _id: commentID });
    if (!isExitsComment) {
      return Response.json(
        { message: "comment Not Found !!!" },
        { status: 404 }
      );
    }

    await CommentModel.findOneAndDelete({ _id: commentID });

    return Response.json(
      { message: "comment deleted successfully:)" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: "Server error: ", e }, { status: 500 });
  }
}
