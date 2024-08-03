import React from "react";
import styles from "@/components/templates/p-admin/users/table.module.css";
import Table from "@/components/templates/p-admin/users/Table";
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
import Layout from "@/components/layouts/adminPanelLayout";

const page = async () => {
  connectToDB();
  const users = await UserModel.find({}).lean();
  const isBanned = await BanModel.find({}).lean();


  return (
    <Layout>
      <main>
        {users.length === 0 ? (
          <p className={styles.empty}>کاربری وجود ندارد</p>
        ) : (
          <Table
            users={JSON.parse(JSON.stringify(users))}a
            isBanned={JSON.parse(JSON.stringify(isBanned))}
            title="لیست کاربران"
          />
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  کاربران |  پنل مدیریت",
}