import connectToDB from "@/configs/db";
import {
  hashPassword,
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/auth";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { authAdmin } from "@/utils/isLogin";
export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const body = await req.json();
    const { id, name, email, phone, password } = body;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid ID" },
        {
          status: 456,
        }
      );
    }

    if (!name) {
      return Response.json(
        { message: "Name is required" },
        {
          status: 457,
        }
      );
    }

    if (!email) {
      return Response.json(
        { message: "Email is required" },
        {
          status: 458,
        }
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "Invalid email" },
        {
          status: 459,
        }
      );
    }

    if (!phone) {
      return Response.json(
        { message: "Phone is required" },
        {
          status: 461,
        }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        { message: "Invalid phone number" },
        {
          status: 462,
        }
      );
    }

    const ExitsUser = await UserModel.findOne({ _id: id });
    if (!ExitsUser) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    const updateData = { name, email, phone };

    if (password) {
      const isValidPassword = validatePassword(password);
      if (!isValidPassword) {
        return Response.json(
          { message: "password is not valid" },
          {
            status: 466,
          }
        );
      }
      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
    }

    await UserModel.findOneAndUpdate({ _id: id }, { $set: updateData });

    return Response.json(
      { message: "User updated successfully" },
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json({ message: "error server" }, { status: 500 });
  }
}
