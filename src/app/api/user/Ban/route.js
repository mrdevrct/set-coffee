import connectToDB from "@/configs/db";
import BanModel from "@/models/Ban";
import UserModel from "@/models/User";
import { validateEmail, validatePhone } from "@/utils/auth";
import { authAdmin } from "@/utils/isLogin";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const body = await req.json();
    const { email, phone } = body;

    if (!email && !phone) {
      return Response.json(
        { message: "Email or phone is required" },
        { status: 400 }
      );
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return Response.json({ message: "Invalid email" }, { status: 401 });
      }
    }

    if (phone) {
      const isValidPhone = validatePhone(phone);
      if (!isValidPhone) {
        return Response.json({ message: "Invalid phone" }, { status: 401 });
      }
    }

    const user = await UserModel.findOne({ $or: { email, phone } });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const Exits = await BanModel.findOne({ $or: { email, phone } });
    
    if (Exits) {
      return Response.json(
        { message: "User Baned Already !!" },
        { status: 422 }
      );
    }

    await BanModel.create({ email, phone });

    return Response.json(
      { message: "Baned User successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
