import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authAdmin, authUser } from "@/utils/isLogin";
import ProductModel from "@/models/Product";
import { roles } from "@/utils/constans";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const reqBody = await req.json();
    const user = await authUser();
    const { commentID, body, productID, score, username } = reqBody;

    if (!mongoose.isValidObjectId(commentID)) {
      return Response.json(
        { message: "Comment id is not valid" },
        {
          status: 400,
        }
      );
    }

    const isExitsComment = await CommentModel.findOne({ _id: commentID });
    if (!isExitsComment) {
      return Response.json(
        { message: "Comment Not the found" },
        {
          status: 404,
        }
      );
    }

    await CommentModel.findOneAndUpdate(
      { _id: commentID },
      {
        $set: { hasAnswer: true },
      }
    );

    const comment = await CommentModel.create({
      body,
      username: user.name,
      email: user.email,
      replay: isExitsComment.body,
      userID: user._id,
      score,
      username,
      isAccept: false,
      hasAnswer: false,
      isAnswer: true,
      role: roles.ADMIN,
      mainComment: commentID,
    });

    const productUpadted = await ProductModel.findOneAndUpdate(
      { _id: productID },
      { $push: { comments: comment._id } }
    );

    return Response.json(
      { message: "answer comment saved successfully" },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}
