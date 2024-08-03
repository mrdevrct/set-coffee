import connectToDB from "@/configs/db";
import { validateEmail, validatePhone } from "@/utils/auth";
import UserModel from "@/models/User";
import { authAdmin, authUser } from "@/utils/isLogin";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    connectToDB();
    const body = await req.json();
    const user = await authUser();
    const { name, email, phone } = body;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      return Response.json(
        { message: "Please enter your name or email or phone" },
        { status: 400 }
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "Please enter a valid email" },
        { status: 401 }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        { message: "Please enter a valid phone" },
        { status: 401 }
      );
    }

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          name,
          email,
          phone,
        },
      }
    );

    return Response.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: "Error Server", e }, { status: 500 });
  }
}

export async function DELETE(req) {
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

    await UserModel.findOneAndDelete({ _id: id });

    return Response.json(
      { message: "User Deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message:  e.message }, { status: 500 });
  }
}
