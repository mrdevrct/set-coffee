import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { authAdmin } from "@/utils/isLogin";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const body = await req.json();
    const { id } = body;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ message: "Invalid id" }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { role: user.role === "ADMIN" ? "USER" : "ADMIN" } }
    );

    return Response.json(
      { message: "User role updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json(
      { message: e.message },
      { status: 500 }
    );
  }
}
