import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import { authAdmin } from "@/utils/isLogin";
import mongoose from "mongoose";
import { promises as fs } from "fs";
import path from "path";

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
    const filename = Date.now() + img.name;
    const imgPath = path.join(process.cwd(), "public/uploads/" + filename);

    await fs.writeFile(imgPath, buffer);

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
      img: `http://localhost:3000/uploads/${filename}`,
    });

    return Response.json(
      { message: "Product created successfully :))", data: product },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
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

    if (!name) {
      return Response.json({ message: "name is required" }, { status: 400 });
    }

    if (!price) {
      return Response.json({ message: "price is required" }, { status: 400 });
    }

    if (!shortDesc) {
      return Response.json({ message: "shortDesc is required" }, { status: 400 });
    }

    if (!longDesc) {
      return Response.json({ message: "longDesc is required" }, { status: 400 });
    }

    if (!weight) {
      return Response.json({ message: "weight is required" }, { status: 400 });
    }

    if (!suitableFor) {
      return Response.json({ message: "suitableFor is required" }, { status: 400 });
    }

    if (!smell) {
      return Response.json({ message: "smell is required" }, { status: 400 });
    }

    if (!inventory) {
      return Response.json({ message: "inventory is required" }, { status: 400 });
    }

    if (!tags) {
      return Response.json({ message: "tags is required" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ message: "Product ID is not valid" }, { status: 401 });
    }

    const isExitsProduct = await ProductModel.findOne({ _id: id });
    if (!isExitsProduct) {
      return Response.json({ message: "Product not found" }, { status: 404 });
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
      const filename = Date.now() + img.name;
      const imgPath = path.join(process.cwd(), "public/uploads/" + filename);
      await fs.writeFile(imgPath, buffer);
      updateData.img = `http://localhost:3000/uploads/${filename}`;
    } else {
      updateData.img = isExitsProduct.img; // Retain the existing image URL if no new image is provided
    }

    await ProductModel.findOneAndUpdate({ _id: id }, { $set: updateData });

    return Response.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ message: e.message }, { status: 500 });
  }
}

