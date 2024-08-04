import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import UserModel from "@/models/User";
import { promises as fs } from "fs";
import path from "path";
import { S3 } from "aws-sdk";

const s3 = new S3({
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

export async function PUT(req) {
  try {
    await connectToDB();
    const user = await authUser();
    const formData = await req.formData();
    const img = formData.get("img");

    if (!img) {
      return Response.json(
        { message: "Image is required" },
        {
          status: 400,
        }
      );
    }

    const existingUser = await UserModel.findOne({ _id: user._id });
    if (!existingUser) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    let previousImgUrl = existingUser.img;

    if (previousImgUrl) {
      const previousImgKey = previousImgUrl.split("/").pop();
      const deleteParams = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: `users-image/${previousImgKey}`,
      };

      await s3.deleteObject(deleteParams).promise();
    }

    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = Date.now() + path.extname(img.name);

    const uploadParams = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: `users-image/${filename}`,
      Body: buffer,
      ContentType: img.type,
      ACL: "public-read",
    };

    const { Location: imgUrl } = await s3.upload(uploadParams).promise();

    const updateUser = { img: imgUrl };
    await UserModel.findOneAndUpdate({ _id: user._id }, { $set: updateUser });

    return Response.json(
      { message: "Profile image updated successfully", imgUrl },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}
