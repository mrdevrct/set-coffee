import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import UserModel from "@/models/User";
import { promises as fs } from "fs";
import path from "path";

export async function PUT(req) {
  try {
    connectToDB();
    const user = await authUser();
    const formData = await req.formData();

    const img = formData.get("img");

    if (!img) {
      return new Response(JSON.stringify({ message: "img is required" }), {
        status: 400,
      });
    }

    const isExsitsUser = await UserModel.findOne({ _id: user._id });
    if (!isExsitsUser) {
      return new Response(JSON.stringify({ message: "user is not found!!!" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = Date.now() + path.extname(img.name);
    const imgPath = path.join(
      process.cwd(),
      "public/uploads/users-image/",
      filename
    );

    await fs.writeFile(imgPath, buffer);

    const updateUser = {
      img: `http://localhost:3000/uploads/users-image/${filename}`,
    };

    await UserModel.findOneAndUpdate({ _id: user._id }, { $set: updateUser });
    return new Response(
      JSON.stringify({ message: "updated image profile successfully" }),
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: e.message }), {
      status: 500,
    });
  }
}
