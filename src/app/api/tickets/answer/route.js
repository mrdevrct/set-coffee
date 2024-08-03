import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authAdmin, authUser } from "@/utils/isLogin";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB();
    const reqBody = await req.json();
    const user = await authUser();
    const { ticketID, title, body, department, subDepartment, priority } =
      reqBody;

    if (!title) {
      return Response.json({ message: "title is required" }, { status: 400 });
    }

    if (!body) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    if (!department) {
      return Response.json(
        { message: "department is required" },
        { status: 400 }
      );
    }

    if (!subDepartment) {
      return Response.json(
        { message: "subDepartment is required" },
        { status: 400 }
      );
    }

    if (!priority) {
      return Response.json(
        { message: "priority is required" },
        { status: 400 }
      );
    }

    if (!ticketID) {
      return Response.json(
        { message: "ticket id is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(ticketID)) {
      return Response.json(
        { message: "ticket id is not valid" },
        { status: 422 }
      );
    }

    const isExitsTicket = await TicketModel.findOne({ _id: ticketID });
    if (!isExitsTicket) {
      return Response.json(
        { message: "ticket id not defind" },
        { status: 422 }
      );
    }
    await TicketModel.findOneAndUpdate(
      { _id: ticketID },
      {
        $set: {
          hasAnswer: true,
        },
      }
    );

    await TicketModel.create({
      title,
      body,
      department,
      subDepartment,
      user: user._id,
      priority,
      isAnswer: true,
      hasAnswer: false,
      mainTicket: ticketID,
    });

    return Response.json(
      { message: "answer saved successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
