import connectToDB from "@/configs/db";
import EmailVerificationModel from "@/models/EmailVerification";
import { hashPassword, validateEmail, validatePassword } from "@/utils/auth";
import UserModel from "@/models/User";
const request = require("request");

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { email, code, newPassword } = body;

    if (!email) {
      return Response.json({ message: "email is required" }, { status: 400 });
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

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json({ message: "email is not valid" }, { status: 401 });
    }

    const isValidPassword = validatePassword(newPassword);
    if (!isValidPassword) {
      return Response.json(
        { message: "password is not valid" },
        { status: 401 }
      );
    }

    const emailVerification = await EmailVerificationModel.findOne({
      email,
      code,
    });

    if (emailVerification) {
      const date = new Date();
      const now = date.getTime();

      if (emailVerification.expTime > now) {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return Response.json(
            { message: "user is not found" },
            { status: 404 }
          );
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
