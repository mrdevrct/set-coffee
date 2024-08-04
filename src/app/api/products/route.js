import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import { authAdmin } from "@/utils/isLogin";
import mongoose from "mongoose";
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

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const shortDesc = formData.get("shortDesc");
    const longDesc = formData.get("longDesc");
    const weight = formData.get("weight");
    const suitableFor = formData.get("suitableFor");
    const smell = formData.get("smell");
    const inventory = formData.get("inventory");
    const tags = formData.get("tags");
    const img = formData.get("img");

    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = Date.now() + "-" + img.name;

    const uploadParams = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: img.type,
      ACL: "public-read",
    };

    const { Location: imgUrl } = await s3.upload(uploadParams).promise();
    console.log("Image Url => ", imgUrl);

    // ذخیره محصول در دیتابیس
    const product = await ProductModel.create({
      name,
      price,
      shortDesc,
      longDesc,
      weight,
      suitableFor,
      smell,
      inventory,
      tags,
      img: imgUrl,
    });

    console.log("Product => ", product);

    return Response.json(
      { message: "Product created successfully :))", data: product },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  connectToDB();
  const products = await ProductModel.find({}, "-__v").populate("comments");
  return Response.json(products);
}

export async function DELETE(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const formData = await req.formData();
    const id = formData.get("id");

    if (!id) {
      return Response.json(
        { message: "product id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "product id is not valid" },
        { status: 401 }
      );
    }

    const isExitsProduct = await ProductModel.findOne({ _id: id });
    if (!isExitsProduct) {
      return Response.json(
        { message: "product is not found" },
        { status: 404 }
      );
    }

    await ProductModel.findOneAndDelete({ _id: id });
    return Response.json(
      { message: "product removed successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This is a protected API, and you can't access it!");
    }

    await connectToDB();

    const formData = await req.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const price = formData.get("price");
    const shortDesc = formData.get("shortDesc");
    const longDesc = formData.get("longDesc");
    const weight = formData.get("weight");
    const suitableFor = formData.get("suitableFor");
    const smell = formData.get("smell");
    const inventory = formData.get("inventory");
    const tags = formData.get("tags");
    const img = formData.get("img");

    if (
      !name ||
      !price ||
      !shortDesc ||
      !longDesc ||
      !weight ||
      !suitableFor ||
      !smell ||
      !inventory ||
      !tags
    ) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Product ID is not valid" },
        { status: 400 }
      );
    }

    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    const updateData = {
      name,
      price,
      shortDesc,
      longDesc,
      weight,
      suitableFor,
      smell,
      inventory,
      tags,
    };

    if (img && img.size > 0) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename = Date.now() + "-" + img.name;

      const uploadParams = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: img.type,
        ACL: "public-read",
      };

      const { Location: imgUrl } = await s3.upload(uploadParams).promise();

      // حذف تصویر قبلی از S3
      const oldImgKey = existingProduct.img.split("/").pop();
      if (oldImgKey) {
        await s3
          .deleteObject({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: oldImgKey,
          })
          .promise();
      }

      updateData.img = imgUrl;
    } else {
      updateData.img = existingProduct.img;
    }

    await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

    return Response.json(
      { message: "Product updated successfully" },
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
