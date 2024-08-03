import connectToDB from "@/configs/db";
import ContactModel from "@/models/Contact";
import { validateEmail, validatePhone } from "@/utils/auth";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { name, email, phone, company, message } = body;

    // validation
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      return Response.json(
        { message: "please enter a name and email and phone and message" },
        { status: 400 }
      );
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return Response.json(
        { message: "phone is not Valid !!!" },
        { status: 409 }
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return Response.json(
        { message: "email is not Valid !!!" },
        { status: 409 }
      );
    }

    await ContactModel.create({ name, email, phone, company, message });

    return Response.json({ message : 'message sended successfull' }, { status : 201 });
  } catch (e) {
    return Response.json(
      { message: "خطای سرور داخلی", e },
      {
        status: 500,
      }
    );
  }
}
