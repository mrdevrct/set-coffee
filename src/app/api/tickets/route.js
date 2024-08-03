import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import TicketModel from "@/models/Ticket";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    connectToDB();
    const user = await authUser();
    const reqBody = await req.json();
    const { title, body, department, subDepartment, priority } = reqBody;

    // validation

    if (!title) {
      return Response.json(
        { message: "Title is required and should be a string" },
        { status: 400 }
      );
    }

    if (!body) {
      return Response.json(
        { message: "Body is required and should be a string" },
        { status: 400 }
      );
    }

    if (!department) {
      return Response.json(
        { message: "Department is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(department)) {
      return Response.json({ message: "Invalid department" }, { status: 401 });
    }

    if (!subDepartment) {
      return Response.json(
        { message: "Sub-department is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(subDepartment)) {
      return Response.json({ message: "Invalid department" }, { status: 401 });
    }

    await TicketModel.create({
      title,
      body,
      user: user._id,
      department,
      subDepartment,
      priority,
    });

    return Response.json(
      { message: "Ticket Saved successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Error Server", e }, { status: 500 });
  }
}
