import DataTable from "@/components/templates/p-admin/sights/Table";
import React from "react";
import connectToDB from "@/configs/db";
import SightModel from "@/models/Sight";
import Layout from "@/components/layouts/adminPanelLayout";
import styles from "@/styles/p-user/dataTable.module.css";

const page = async () => {
  connectToDB();
  const sights = await SightModel.find({ isAnswer: false })
    .populate("articleID", "_id title")
    .sort({ _id : -1})
    .lean();

  return (
    <Layout>
      <main>
        {sights.length ? (
          <DataTable
            sights={JSON.parse(JSON.stringify(sights))}
            header="لیست دیدگاه ها"
          />
        ) : (
          <p className={styles.empty}>دیدگاهی وجود ندارد</p>
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  دیدگاه ها |  پنل مدیریت",
}