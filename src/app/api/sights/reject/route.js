import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import mongoose from "mongoose";
import SightModel from "@/models/Sight";
import ArticleModel from "@/models/Article";

export async function PUT(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { sightID } = reqBody;

    if (!mongoose.isValidObjectId(sightID)) {
      return Response.json(
        { message: "sight id is not valid" },
        { status: 401 }
      );
    }

    const isExitsSight = await SightModel.findOne({ _id: sightID });
    if (!isExitsSight) {
      return Response.json(
        { message: "sight id is not found" },
        { status: 404 }
      );
    }

    await SightModel.findOneAndUpdate(
      { _id: sightID },
      { $set: { isAccept: false } }
    );

    return Response.json(
      { message: "sight reject successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
