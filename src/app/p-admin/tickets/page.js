import React from "react";
import styles from "@/components/templates/p-admin/tickets/table.module.css";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import BanModel from "@/models/Ban"
import Layout from "@/components/layouts/adminPanelLayout";
import Table from "@/components/templates/p-admin/tickets/Table";

const page = async () => {
  connectToDB();
  const tickets = await TicketModel.find({ isAnswer : false})
    .sort({ _id: -1 })
    .populate("department", "title")
    .populate("user")
    .lean();

  const isBanned = await BanModel.find({}).lean();

  return (
    <Layout>
      <main>
        {tickets.length === 0 ? (
          <p className={styles.empty}>تیکتی وجود ندارد</p>
        ) : (
          <Table
            tickets={JSON.parse(JSON.stringify(tickets))}
            isBanned={JSON.parse(JSON.stringify(isBanned))}
            title="لیست تیکت ها"
          />
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "تیکت ها |  پنل مدیریت",
}