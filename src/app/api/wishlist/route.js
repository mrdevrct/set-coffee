import connectToDB from "@/configs/db";
import WishlistModel from "@/models/Wishlist";
import ProductModel from "@/models/Product";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { user, product } = body;

    // validation
    if (!user.trim() || !product.trim()) {
      return Response.json(
        { message: "Please provide both user and product IDs." },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(user)) {
      return Response.json({ message: "Invalid user ID." }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(product)) {
      return Response.json({ message: "Invalid product ID." }, { status: 400 });
    }

    const products = await ProductModel.findOne({ _id: product });
    if (!products) {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }

    const users = await UserModel.findOne({ _id: user });
    if (!users) {
      return Response.json({ message: "User not found." }, { status: 404 });
    }

    const wishlistExist = await WishlistModel.findOne({ user, product });
    if (wishlistExist) {
      return Response.json(
        { message: "Product is already in the wishlist." },
        { status: 409 }
      );
    }

    await WishlistModel.create({ user, product });

    return Response.json(
      { message: "Product added to wishlist successfully." },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Error Server .", e }, { status: 500 });
  }
}

export async function GET(req) {
  connectToDB();
  const wishlist = await WishlistModel.find({})
  return Response.json(wishlist)
}
