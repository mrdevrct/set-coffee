import connectToDB from "@/configs/db";
import OtpModel, { findOne } from "@/models/Otp";
import { generateAccessToken, hashPassword, validatePassword, validatePhone } from "@/utils/auth";
import UserModel from "@/models/User";
import { roles } from "@/utils/constans";
const request = require("request");

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { phone, code, newPassword } = body;

    if (!phone) {
      return Response.json({ message: "phone is required" }, { status: 400 });
    }

    if (!code) {
      return Response.json({ message: "code is required" }, { status: 400 });
    }

    if (!newPassword) {
      return Response.json(
        { message: "new password is required" },
        { status: 400 }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json({ message: "Phone is not valid" }, { status: 401 });
    }

    const isValidPassword = validatePassword(newPassword);
    if (!isValidPassword) {
      return Response.json(
        { message: "password is not valid" },
        { status: 401 }
      );
    }

    const otp = await OtpModel.findOne({ phone, code });

    if (otp) {
      const date = new Date();
      const now = date.getTime();

      if (otp.expTime > now) {
        const user = await UserModel.findOne({ phone });
        if (!user) {
          return Response.json({ message: "User not found" }, { status: 404 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await UserModel.findOneAndUpdate(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );

        return Response.json({ message: "Code is correct" }, { status: 200 });
      } else {
        return Response.json(
          { message: "code is expired !!" },
          { status: 410 }
        );
      }
    } else {
      return Response.json(
        { message: "code is not correct !!" },
        { status: 409 }
      );
    }
  } catch (e) {
    return Response.json({ message: "error server ", e }, { status: 500 });
  }
}
