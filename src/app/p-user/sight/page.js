import DataTable from "@/components/templates/p-user/sights/DataTable";
import React from "react";
import connectToDB from "@/configs/db";
import SightModel from "@/models/Sight";
import Layout from "@/components/layouts/userPanelLayout";
import { authUser } from "@/utils/isLogin";
import styles from "@/styles/p-user/dataTable.module.css";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const sights = await SightModel.find({ user: user._id })
    .populate("articleID", "title")
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
  title: "  دیدگاه ها |  پنل کاربری",
}