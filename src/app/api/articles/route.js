import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin, authUser } from "@/utils/isLogin";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    connectToDB(); // Ensure database is connected
    const user = await authUser();
    const formData = await req.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const body = formData.get("body");
    const cover_image = formData.get("cover_image");
    const images = formData.getAll("images"); // Use getAll to get an array of images

    if (!title.trim()) {
      return Response.json({ message: " title is required" }, { status: 400 });
    }
    if (!author.trim()) {
      return Response.json({ message: " author is required" }, { status: 400 });
    }
    if (!body.trim()) {
      return Response.json({ message: " body is required" }, { status: 400 });
    }

    if (!cover_image) {
      return Response.json(
        { message: " cover_image is required" },
        { status: 400 }
      );
    }

    // آپلود cover image
    const coverBuffer = Buffer.from(await cover_image.arrayBuffer());
    const coverFilename = Date.now() + path.extname(cover_image.name); // Use path.extname to get the extension
    const coverImgPath = path.join(
      process.cwd(),
      "public/uploads",
      coverFilename
    );
    await fs.writeFile(coverImgPath, coverBuffer);
    const coverImageURL = `https://set-coffee-omega.vercel.app/uploads/${coverFilename}`;

    // آپلود عکس‌های اضافی
    const imageUrls = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + path.extname(image.name); // Use path.extname to get the extension
      const imgPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(imgPath, buffer);
      imageUrls.push(`https://set-coffee-omega.vercel.app/uploads/${filename}`);
    }

    await ArticleModel.create({
      title,
      author,
      body,
      user: user._id,
      cover_image: coverImageURL,
      images: imageUrls,
    });

    return Response.json(
      { message: "created Article successfully" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This API is protected and you can't access it!");
    }

    connectToDB();
    const user = await authUser();
    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const author = formData.get("author");
    const body = formData.get("body");
    const cover_image = formData.get("cover_image");
    const cover_image_url = formData.get("cover_image_url");
    const images = formData.getAll("images");
    const existing_images = formData.getAll("existing_images");

    if (!title.trim()) {
      return Response.json({ message: "title is required" }, { status: 400 });
    }
    if (!author.trim()) {
      return Response.json({ message: "author is required" }, { status: 400 });
    }
    if (!body.trim()) {
      return Response.json({ message: "body is required" }, { status: 400 });
    }

    let coverImageURL = cover_image_url;
    if (cover_image && cover_image instanceof File) {
      const coverBuffer = Buffer.from(await cover_image.arrayBuffer());
      const coverFilename = Date.now() + path.extname(cover_image.name);
      const coverImgPath = path.join(process.cwd(), "public/uploads", coverFilename);
      await fs.writeFile(coverImgPath, coverBuffer);
      coverImageURL = `https://set-coffee-omega.vercel.app/uploads/${coverFilename}`;
    }

    const imageUrls = [...existing_images];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + path.extname(image.name);
      const imgPath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(imgPath, buffer);
      imageUrls.push(`https://set-coffee-omega.vercel.app/uploads/${filename}`);
    }

    const newData = {
      title,
      author,
      body,
      user: user._id,
      cover_image: coverImageURL,
      images: imageUrls,
    };

    await ArticleModel.findOneAndUpdate({ _id: id }, { $set: newData });

    return Response.json({ message: "updated Article successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ message: err }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    connectToDB();
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw Error("This is api protected and you can't access is !!!");
    }

    const body = await req.json();
    const { articleId } = body;

    const isExitsArticle = await ArticleModel.findOne({ _id: articleId });
    if (!isExitsArticle) {
      return Response.json({ message: "Article not found" }, { status: 404 });
    }

    await ArticleModel.findOneAndDelete({ _id: articleId });

    return Response.json(
      { message: "removed Article successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ message: err }, { status: 500 });
  }
}
