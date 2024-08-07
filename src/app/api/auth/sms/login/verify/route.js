import connectToDB from "@/configs/db";
import OtpModel, { findOne } from "@/models/Otp";
import { generateAccessToken, validatePhone } from "@/utils/auth";
import UserModel from "@/models/User";
import { roles } from "@/utils/constans";
const request = require("request");

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { phone, code } = body;

    if (!phone) {
      return Response.json({ message: "phone is required" }, { status: 400 });
    }

    if (!code) {
      return Response.json({ message: "code is required" }, { status: 400 });
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json({ message: "Phone is not valid" }, { status: 401 });
    }

    const otp = await OtpModel.findOne({ phone, code });

    if (otp) {
      const date = new Date();
      const now = date.getTime();

      if (otp.expTime > now) {
        const user = await UserModel.findOne({ phone });
        if (!user) {
          return Response.json(
            { message: "in user not found" },
            { status: 404 }
          );
        }

        const accessToken = generateAccessToken({ email: user.email });

        return Response.json(
          { message: "Code is correct" },
          {
            status: 200,
            headers: {
              "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
            },
          }
        );
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
