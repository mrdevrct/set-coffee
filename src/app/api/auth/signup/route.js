import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import {
  generateAccessToken,
  hashPassword,
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/utils/auth";
import { roles } from "@/utils/constans";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { name, phone, email, password } = body;

    // Validation
    if ((!name.trim() || !phone.trim() || !password.trim())) {
      return Response.json(
        { message: "لطفاً فیلدهای مورد نیاز را پر کنید" },
        { status: 400 }
      );
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return Response.json(
          { message: "ایمیل وارد شده معتبر نمی باشد" },
          { status: 422 }
        );
      }
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        { message: "شماره وارد شده معتبر نمی باشد" },
        { status: 422 }
      );
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return Response.json(
        { message: "رمز وارد شده معتبر نمی باشد" },
        { status: 422 }
      );
    }

    const isUserExist = await UserModel.findOne({
      $or: [{ name }, { email }, { phone }],
    });

    if (isUserExist) {
      return Response.json(
        {
          message: "نام کاربری یا ایمیل یا شماره تلفن از قبل وجود دارد !!",
        },
        {
          status: 422,
        }
      );
    }

    const hashedPassword = await hashPassword(password);
    const accessToken = generateAccessToken({ email });

    const users = await UserModel.find({});

    await UserModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: users.length > 0 ? roles.USER : roles.ADMIN,
    });

    return Response.json(
      { message: "ثبت نام کاربر با موفقیت انجام شد :))" },
      {
        status: 201,
        headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` },
      }
    );
  } catch (error) {
    console.error("خطا در ثبت نام کاربر:", error);
    return Response.json(
      { message: "خطای سرور داخلی" },
      {
        status: 500,
      }
    );
  }
}
