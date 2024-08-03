import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import UserModel from "@/models/User";
import { hashPassword, validatePassword, verifyPassword } from "@/utils/auth";

export async function PUT(req) {
  try {
    connectToDB();
    const body = await req.json();
    const user = await authUser();
    const { password } = body;

    if (!password) {
      return Response.json(
        { message: "Please enter a password" },
        { status: 400 }
      );
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return Response.json(
        { message: "Please enter a valid password" },
        { status: 401 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const isExitsUser = await UserModel.findOne({ _id: user._id });
    if (!isExitsUser) {
      return Response.json(
        { message: "user not found!!" },
        { status: 404 }
      );
    }

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return Response.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );
  }
}
