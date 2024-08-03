import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";
import { authUser } from "@/utils/isLogin";

export async function PUT(req) {
  try {
    await connectToDB();
    const user = await authUser();
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return Response.json(
        { message: "code is required" },
        {
          status: 400,
        }
      );
    }

    const discount = await DiscountModel.findOne({ code });

    if (!discount) {
      return Response.json(
        { message: "Discount not found" },
        {
          status: 404,
        }
      );
    } else if (discount.maxUse === discount.uses) {
      return Response.json(
        { message: "Discount usage limit reached" },
        { status: 409 }
      );
    } else if (discount.usedBy.includes(user._id)) {
      return Response.json(
        { message: "Discount code already used by this user" },
        { status: 410 }
      );
    } else {
      await DiscountModel.findOneAndUpdate(
        { code },
        { $inc: { uses: 1 }, $push: { usedBy: user._id } }
      );
      return Response.json(discount);
    }
  } catch (e) {
    return Response.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}
