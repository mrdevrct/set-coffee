import Layout from "@/components/layouts/userPanelLayout";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/isLogin";
import React from "react";
import TicketModel from "@/models/Ticket";
import Tickets from "@/components/templates/p-user/tickets/Tickets";

async function page() {
  connectToDB();
  const user = await authUser();
  const tickets = await TicketModel.find({ user: user._id , isAnswer : false})
    .populate("department", "title")
    .sort({ _id: -1 })
    .lean();

  return (
    <Layout>
      <Tickets tickets={JSON.parse(JSON.stringify(tickets))} />
    </Layout>
  );
}

export default page;


export const metadata = {
  title: " تیکت ها |  پنل کاربری",
}