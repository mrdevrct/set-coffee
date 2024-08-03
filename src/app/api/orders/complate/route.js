import request from "request";
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import OtpOrderModel from "@/models/OtpOrder";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { orderID } = body;

    if (!orderID) {
      return Response.json({ message: "orderID is required" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(orderID)) {
      return Response.json(
        { message: "order id is not valid" },
        { status: 401 }
      );
    }

    const isExitsOrder = await OrderModel.findOne({ _id: orderID });
    if (!isExitsOrder) {
      return Response.json({ message: "order is not found" }, { status: 403 });
    }

    const code = Math.floor(Math.random() * 99999);

    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: "u09023883441",
          pass: "Faraz@1427240372938515",
          fromNum: "3000505",
          toNum: isExitsOrder.phone,
          patternCode: "pnm1z5rmfwztvuq",
          inputData: [
            {
              "verification-code": code,
              "total_price": isExitsOrder.total_price,
              "order-id": isExitsOrder._id,
            },
          ],
        },
        json: true,
      },
      async function (error, response, body) {
        if (!error && response.statusCode === 200) {
          await OtpOrderModel.create({ phone: isExitsOrder.phone, code });

          await OrderModel.findOneAndUpdate(
            { _id: orderID },
            { $set: { status: "processing" } }
          );
        } else {
          console.log("خطا در ارسال کد: ", error || body);
        }
      }
    );

    return Response.json(
      { message: "Order status updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
