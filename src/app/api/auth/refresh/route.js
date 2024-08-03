import connectToDB from "@/configs/db";
import { cookies } from "next/headers";
import UserModel from "@/models/User";
import { verify } from "jsonwebtoken";
import { generateAccessToken } from "@/utils/auth";

export async function POST(req) {
  try {
    connectToDB();
    const refreshToken = cookies().get("refresh-token").value;

    if (!refreshToken) {
      return Response.json(
        { message: "no have refresh token !!!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return Response.json(
        { message: "no have refresh token !!!" },
        { status: 401 }
      );
    }

    verify(refreshToken, process.env.REFRESH_TOKEN);

    const newAccessToken = generateAccessToken({ email: user.email });

    return Response.json(
      { message: "new access token generated successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${newAccessToken};path=/;httpOnly=true;`,
        },
      }
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
