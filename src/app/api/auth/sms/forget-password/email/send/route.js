import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import EmailVerificationModel from "@/models/EmailVerification";
import UserModel from "@/models/User";
import connectToDB from "@/configs/db";

export async function POST(req) {
  try {
    connectToDB()
    const body = await req.json();
    const { email } = body;

    const user = await UserModel.findOne({ email })

    if (!user) {
        return Response.json({ message : "User not found" } , { status : 404})
    }

    const now = new Date();
    const expTime = now.getTime() + 300_000; // 5 minutes expiration time
    const latestOtp = await EmailVerificationModel.findOne({ email }).sort({
      createdAt: -1,
    });

    if (
      latestOtp &&
      now.getTime() - new Date(latestOtp.createdAt).getTime() < 120_000
    ) {
      return NextResponse.json(
        {
          message: "لطفاً ۲ دقیقه صبر کنید و سپس درخواست کد جدید کنید",
        },
        { status: 429 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code

    // Nodemailer settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is ${code}. This code will expire in 5 minutes.`,
    });

    // Save OTP to the database
    await EmailVerificationModel.create({ email, code, expTime, attempts: 0 });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending email:", error); // Log error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
