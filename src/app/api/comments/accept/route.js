import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { authAdmin } from "@/utils/isLogin";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const body = await req.json();
    const { commentID } = body;

    if (!commentID) {
      return Response.json(
        { message: "commentID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(commentID)) {
      return Response.json(
        { message: "commentID is not Valid" },
        { status: 401 }
      );
    }

    const ExitsComment = await CommentModel.findOne({ _id: commentID });

    if (!ExitsComment) {
      return Response.json({ message: "comment not defind" }, { status: 404 });
    }

    await CommentModel.findOneAndUpdate(
      { _id: commentID },
      { $set: { isAccept: true } }
    );

    return Response.json(
      { message: "comment is accept updated" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
