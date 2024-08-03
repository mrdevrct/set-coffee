import React from "react";
import styles from "@/components/templates/p-admin/comments/table.module.css";
import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import Layout from "@/components/layouts/adminPanelLayout";
import Table from "@/components/templates/p-admin/comments/Table";
import BanModel from "@/models/Ban";

const page = async () => {
  connectToDB();
  const comments = await CommentModel.find({ isAnswer : false})
    .sort({ _id: -1 })
    .populate("userID")
    .populate("productID")
    .lean();

  const isBanned = await BanModel.find({}).lean();

  return (
    <Layout>
      <main>
        {comments.length === 0 ? (
          <p className={styles.empty}>کامنتی وجود ندارد</p>
        ) : (
          <Table
            isBanned={JSON.parse(JSON.stringify(isBanned))}
            comments={JSON.parse(JSON.stringify(comments))}
            title="لیست کامنت ها"
          />
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  کامنت ها |  پنل مدیریت",
}