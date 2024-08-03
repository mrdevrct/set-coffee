import React from "react";
import styles from "@/components/templates/p-admin/articles/table.module.css";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import Layout from "@/components/layouts/adminPanelLayout";
import Table from "@/components/templates/p-admin/articles/Table";
import Link from "next/link";

const page = async () => {
  connectToDB();
  const articles = await ArticleModel.find({})
    .sort({ _id: -1 })
    .populate("user")
    .lean();

  return (
    <Layout>
      <main>
        {articles.length === 0 ? (
          <>
            <p style={{ display: "flex", justifyContent: "center" }}>
              <Link
                href="/p-admin/articles/add-article"
                className={styles.createArticleLink}
              >
                ایجاد مقاله جدید
              </Link>
            </p>
            <p className={styles.empty}>مقاله ای وجود ندارد</p>
          </>
        ) : (
          <Table
            articles={JSON.parse(JSON.stringify(articles))}
            header="لیست مقاله ها"
          />
        )}
      </main>
    </Layout>
  );
};

export default page;


export const metadata = {
  title: "  مقاله ها |  پنل مدیریت",
}