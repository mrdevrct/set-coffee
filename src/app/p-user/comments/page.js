import DataTable from "@/components/templates/p-user/commants/DataTable";
import React from "react";
import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import Layout from "@/components/layouts/userPanelLayout";
import { authUser } from "@/utils/isLogin";
import styles from "@/styles/p-user/dataTable.module.css";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const comments = await CommentModel.find({ userID: user._id })
    .sort({ _id: -1 })
    .populate("productID", "name")
    .lean();

  return (
    <Layout>
      <main>
        {comments.length ? (
          <DataTable
          comments={JSON.parse(JSON.stringify(comments))}
            title="لیست کامنت‌ها"
          />
        ) : (
          <p className={styles.empty}>کامنتی وجود ندارد</p>
        )}
      </main>
    </Layout>
  );
};

export default page;


export const metadata = {
  title: " کامنت ها |  پنل کاربری",
}