import connectToDB from "@/configs/db";
import mongoose from "mongoose";
import CommentModel from "@/models/Comment";

export async function PUT(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { commentID } = body;

    if (!commentID) {
      return Response.json(
        { message: "comment id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(commentID)) {
      return Response.json(
        { message: "comment id is not valid" },
        { status: 401 }
      );
    }

    const isExistComment = await CommentModel.findOne({
      mainComment: commentID,
    });
    
    if (!isExistComment) {
      return Response.json(
        { message: "answer comment is not found" },
        { status: 401 }
      );
    }

    const answered = await CommentModel.findOne({
      mainComment: commentID, isAccept : false
    });
    if (answered) {
      return Response.json(
        { message: "answer comment is rejected" },
        { status: 403 }
      );
    }

    await CommentModel.findOneAndUpdate(
      { mainComment: commentID },
      { $set: { isAccept: false } }
    );

    return Response.json(
      { message: "Answer comment updated" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
