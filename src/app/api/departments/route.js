import connectToDB from "@/configs/db";
import DepartmentModel from "@/models/Department";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return Response.json(
        { message: "Title is required and should be a string" },
        { status: 400 }
      );
    }

    const isExits = await DepartmentModel.findOne({ title });
    if (isExits) {
      return Response.json(
        { message: "title department already !!" },
        { status: 401 }
      );
    }

    await DepartmentModel.create({ title });

    return Response.json(
      { message: "Create Department successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Error Server", e }, { status: 500 });
  }
}

export async function GET(req) {
  connectToDB();
  const departments = await DepartmentModel.find({});
  return Response.json(departments);
}
