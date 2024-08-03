import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import SightModel from "@/models/Sight";
import ArticleModel from "@/models/Article";

export async function POST(req) {
  try {
    connectToDB();
    const user = await authUser();
    const reqBody = await req.json();
    const { sightID, body, articleID } = reqBody;

    if (!body.trim()) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    // if (!mongoose.isValidObjectId(articleID)) {
    //   return Response.json({message : "article id is not valid"},{ status: 401});
    // }

    // // if (!mongoose.isValidObjectId(sightID)) {
    // //   return Response.json({message : "sight id is not valid"},{ status: 401});
    // // }

    const isExitsSight = await SightModel.findOne({ _id: sightID });
    if (!isExitsSight) {
      return Response.json(
        { message: "sight id is not found" },
        { status: 404 }
      );
    }

    await SightModel.findOneAndUpdate(
      { _id: sightID },
      { $set: { hasAnswer: true } }
    );

    const sight = await SightModel.create({
      user: user._id,
      username: user.name,
      email: user.email,
      body,
      mainSight: sightID,
      replay : sightID,
      isAccept: false,
      hasAnswer: false,
      isAnswer: true,
    });

    const articleUpdated = await ArticleModel.findOneAndUpdate(
      { _id: articleID },
      { $push: { sights: sight._id } }
    );

    return Response.json(
      { message: "sight answer save successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return Response.json({ message: e.message }, { status: 500 });
  }
}
