import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import { roles } from "@/utils/constans";
import { authAdmin, authUser } from "@/utils/isLogin";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const user = await authUser();
    const body = await req.json();
    const { code, percent, maxUse } = body;

    if (!user) {
      return Response.json({ message: "user is required" }, { status: 400 });
    }

    if (!code) {
      return Response.json({ message: "code is required" }, { status: 400 });
    }

    if (!percent) {
      return Response.json({ message: "percent is required" }, { status: 400 });
    }

    if (!maxUse) {
      return Response.json({ message: "maxUse is required" }, { status: 400 });
    }

    if (typeof code !== "string") {
      return Response.json(
        { message: "code must be a string" },
        { status: 400 }
      );
    }

    if (typeof percent !== "number") {
      return Response.json(
        { message: "percent must be a number" },
        { status: 400 }
      );
    }

    if (typeof maxUse !== "number") {
      return Response.json(
        { message: "maxUse must be a number" },
        { status: 400 }
      );
    }

    if (user.role !== roles.ADMIN) {
      return Response.json(
        { message: "Only admin can create discount code" },
        { status: 409 }
      );
    }

    await DiscountModel.create({ user: user._id, code, percent, maxUse });
    return Response.json(
      { message: "discount created successfully :)" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const user = await authUser();
    const body = await req.json();
    const { discountID } = body;

    if (!user) {
      return Response.json({ message: "user is required" }, { status: 400 });
    }

    if (!discountID) {
      return Response.json(
        { message: "discount id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(discountID)) {
      return Response.json(
        { message: "discount id is not valid" },
        { status: 401 }
      );
    }

    const isExitsDiscount = await DiscountModel.findOne({ _id: discountID });
    if (!isExitsDiscount) {
      return Response.json(
        { message: "discount is not found" },
        { status: 404 }
      );
    }

    if (user.role !== roles.ADMIN) {
      return Response.json(
        { message: "Only the administrator can remove the discount code" },
        { status: 409 }
      );
    }

    await DiscountModel.findOneAndDelete({ _id: discountID });
    return Response.json(
      { message: "discount removed successfully :)" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
