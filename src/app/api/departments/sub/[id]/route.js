import connectToDB from "@/configs/db";
import SubDepartmentsModel from "@/models/SubDepartment";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    connectToDB();
    const id = params.id;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid Id department" },
        { status: 401 }
      );
    }

    const subDepartments = await SubDepartmentsModel.find({ department: id });

    return Response.json(subDepartments);
  } catch (e) {
    return Response.json({ message: "Error Server", e }, { status: 500 });
  }
}
