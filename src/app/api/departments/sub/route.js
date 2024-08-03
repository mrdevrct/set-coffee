import connectToDB from "@/configs/db";
import DepartmentModel from "@/models/Department";
import SubDepartmentModel from "@/models/SubDepartment";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { title, department } = body;

    if (!title || typeof title !== "string") {
      return Response.json(
        { message: "Title is required and should be a string" },
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

    const departmentExits = await DepartmentModel.findOne({ _id: department });
    if (!departmentExits) {
      return Response.json(
        { message: "department not the found!!!" },
        { status: 401 }
      );
    }

    await SubDepartmentModel.create({ title, department });

    return Response.json(
      { message: "Create SubDepartment successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Error Server", e }, { status: 500 });
  }
}
