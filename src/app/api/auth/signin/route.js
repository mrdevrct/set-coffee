import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
import {
  generateAccessToken,
  generateRefreshToken,
  validateEmail,
  validatePassword,
  validatePhone,
  verifyPassword,
} from "@/utils/auth";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { identifier, password } = body;

    const isValidEmail = validateEmail(identifier);
    const isValidPhone = validatePhone(identifier);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail && !isValidPhone) {
      return Response.json(
        { message: "ایمیل یا شماره معتبر نمی باشد" },
        { status: 419 }
      );
    }

    if (!isValidPassword) {
      return Response.json(
        { message: "پسورد وارد شده معتبر نمی باشد" },
        {
          status: 419,
        }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return Response.json(
        { message: "کاربر با این اطلاعات یافت نشد" },
        { status: 422 }
      );
    }

    const isBanned = await BanModel.findOne({
      $or: [{ email: user.email }, { phone: user.phone }],
    });

    if (isBanned) {
      return Response.json({ message: "User is banned" }, { status: 403 });
    }

    const isCorrectPasswordWithHash = await verifyPassword(
      password,
      user.password
    );

    if (!isCorrectPasswordWithHash) {
      return Response.json(
        { message: "ایمیل یا پسورد درست نمی باشد" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ email: user.email });

    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: { refreshToken },
      }
    );

    const headers = new Headers();
    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true;`);
    headers.append(
      "Set-Cookie",
      `refresh-token=${refreshToken};path=/;httpOnly=true;`
    );

    return Response.json(
      { message: "شما با موفقیت وارد شدید" },
      {
        status: 200,
        headers
      }
    );
  } catch (e) {
    console.log(e);
    return Response.json({ message: "خطای سرور داخلی" }, { status: 500 });
  }
}
