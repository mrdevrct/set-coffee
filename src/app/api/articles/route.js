import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin, authUser } from "@/utils/isLogin";
import { promises as fs } from "fs";
import path from "path";
import { S3 } from "aws-sdk";

const s3 = new S3({
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This is api protected and you can't access it !!!");
    }

    await connectToDB();
    const user = await authUser();
    const formData = await req.formData();
    const title = formData.get("title");
    const author = formData.get("author");
    const body = formData.get("body");
    const cover_image = formData.get("cover_image");
    const images = formData.getAll("images");

    if (!title.trim() || !author.trim() || !body.trim() || !cover_image) {
      return new Response(
        JSON.stringify({ message: "Required fields are missing" }),
        { status: 400 }
      );
    }

    const coverBuffer = Buffer.from(await cover_image.arrayBuffer());
    const coverFilename = Date.now() + path.extname(cover_image.name);
    const coverUploadParams = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: `articles/cover/${coverFilename}`,
      Body: coverBuffer,
      ContentType: cover_image.type,
      ACL: "public-read",
    };
    const { Location: coverImageURL } = await s3
      .upload(coverUploadParams)
      .promise();

    const imageUrls = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + path.extname(image.name);
      const uploadParams = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: `articles/images/${filename}`,
        Body: buffer,
        ContentType: image.type,
        ACL: "public-read",
      };
      const { Location: imageUrl } = await s3.upload(uploadParams).promise();
      imageUrls.push(imageUrl);
    }

    await ArticleModel.create({
      title,
      author,
      body,
      user: user._id,
      cover_image: coverImageURL,
      images: imageUrls,
    });

    return new Response(
      JSON.stringify({ message: "Article created successfully" }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API is protected and you can't access it!");
    }

    await connectToDB();
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

    if (!title.trim() || !author.trim() || !body.trim()) {
      return Response.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const article = await ArticleModel.findOne({ _id: id });
    if (!article) {
      return Response.json(
        { message: "Article not found" },
        {
          status: 404,
        }
      );
    }

    // Delete existing cover image if a new one is provided
    let coverImageURL = cover_image_url;
    if (cover_image && cover_image instanceof File) {
      if (cover_image_url) {
        const coverImageKey = new URL(cover_image_url).pathname
          .split("/")
          .pop();
        const deleteParams = {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: `articles/cover/${coverImageKey}`,
        };
        await s3.deleteObject(deleteParams).promise();
      }

      const coverBuffer = Buffer.from(await cover_image.arrayBuffer());
      const coverFilename = Date.now() + path.extname(cover_image.name);
      const coverUploadParams = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: `articles/cover/${coverFilename}`,
        Body: coverBuffer,
        ContentType: cover_image.type,
        ACL: "public-read",
      };
      const { Location: newCoverImageURL } = await s3
        .upload(coverUploadParams)
        .promise();
      coverImageURL = newCoverImageURL;
    }

    const imageUrls = [...existing_images];
    if (images.length > 0) {
      for (const oldImageUrl of existing_images) {
        const oldImageKey = new URL(oldImageUrl).pathname.split("/").pop();
        const deleteParams = {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: `articles/images/${oldImageKey}`,
        };
        await s3.deleteObject(deleteParams).promise();
      }

      // Upload new images
      for (const image of images) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = Date.now() + path.extname(image.name);
        const uploadParams = {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: `articles/images/${filename}`,
          Body: buffer,
          ContentType: image.type,
          ACL: "public-read",
        };
        const { Location: imageUrl } = await s3.upload(uploadParams).promise();
        imageUrls.push(imageUrl);
      }
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

    return Response.json(
      { message: "Article updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: err.message }, { status: 500 });
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
