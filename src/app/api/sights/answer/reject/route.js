import connectToDB from "@/configs/db";
import mongoose from "mongoose";
import SightModel from "@/models/Sight";

export async function PUT(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { sightID } = body;

    if (!sightID) {
      return Response.json(
        { message: "sight id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(sightID)) {
      return Response.json(
        { message: "sight id is not valid" },
        { status: 401 }
      );
    }

    const isExistSight = await SightModel.findOne({
      mainSight: sightID,
    });

    if (!isExistSight) {
      return Response.json(
        { message: "answer sight is not found" },
        { status: 401 }
      );
    }

    const answerd = await SightModel.findOne({
      mainSight: sightID,
      isAccept: false,
    });
    if (answerd) {
      return Response.json(
        { message: "This comment has already been answered." },
        { status: 403 }
      );
    }

    await SightModel.findOneAndUpdate(
      { mainSight: sightID },
      { $set: { isAccept: false } }
    );

    return Response.json({ message: "Answer sight updated" }, { status: 200 });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
