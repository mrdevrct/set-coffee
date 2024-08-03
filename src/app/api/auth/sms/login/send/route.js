import connectToDB from "@/configs/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { validatePhone } from "@/utils/auth";
const request = require("request");

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { phone } = body;

    const now = new Date();
    const expTime = now.getTime() + 300_000; // 5 دقیقه زمان انقضا

    if (!phone) {
      return Response.json(
        { message: "شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        { message: "شماره تلفن معتبر نیست" },
        { status: 401 }
      );
    }

    const isExitsUser = await UserModel.findOne({ phone });
    if (!isExitsUser) {
      return Response.json(
        {
          message: "نام کاربری یا ایمیل یا شماره تلفن قبلاً ثبت نشده است",
        },
        { status: 422 }
      );
    }

    // بررسی آخرین کد ارسال شده به این شماره تلفن
    const latestOtp = await OtpModel.findOne({ phone }).sort({ createdAt: -1 });

    if (
      latestOtp &&
      now.getTime() - new Date(latestOtp.createdAt).getTime() < 120_000
    ) {
      return Response.json(
        {
          message: "لطفاً ۲ دقیقه صبر کنید و سپس درخواست کد جدید کنید",
        },
        { status: 429 }
      );
    }

    const code = Math.floor(Math.random() * 99999);

    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: "u09023883441",
          pass: "Faraz@1427240372938515",
          fromNum: "3000505",
          toNum: phone,
          patternCode: "h9swr3bb40f5ojx",
          inputData: [{ "verification-code": code }],
        },
        json: true,
      },
      async function (error, response, body) {
        if (!error && response.statusCode === 200) {
          await OtpModel.create({ phone, code, expTime });
        } else {
          console.log("خطا در ارسال کد: ", error || body);
        }
      }
    );

    return Response.json(
      { message: "کد با موفقیت ارسال شد" },
      {
        status: 201,
      }
    );
  } catch (e) {
    return Response.json(
      { message: "خطای سرور", error: e.message },
      { status: 500 }
    );
  }
}
