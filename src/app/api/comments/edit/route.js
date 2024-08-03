import connectToDB from "@/configs/db";
import mongoose from "mongoose";
import CommentModel from "@/models/Comment";
import { authAdmin } from "@/utils/isLogin";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const reqBody = await req.json();
    const { commentID, body } = reqBody;

    //Validation
    if (!commentID) {
      return Response.json(
        { message: "commentID is required" },
        { status: 400 }
      );
    }

    if (!body) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(commentID)) {
      return Response.json(
        { message: "commentID is not Valid" },
        { status: 401 }
      );
    }

    const isExitsComment = await CommentModel.findOne({ _id: commentID });
    if (!isExitsComment) {
      return Response.json({ message: "comment not defind" }, { status: 404 });
    }

    await CommentModel.findOneAndUpdate({ _id: commentID }, { $set: { body } });

    return Response.json({ message: "comment updated" }, { status: 200 });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
