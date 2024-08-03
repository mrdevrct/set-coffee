import React from "react";
import styles from "@/styles/p-admin/index.module.css";
import Box from "@/components/modules/infoBox/InfoBox";
import Layout from "@/components/layouts/adminPanelLayout";

import TicketModel from "@/models/Ticket";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import ProductModel from "@/models/Product";
import connectToDB from "@/configs/db";
import SaleChart from "@/components/templates/p-admin/index/SaleChart";
import GrowthChart from "@/components/templates/p-admin/index/GrowthChart";

async function AdminHomePage() {
  connectToDB();
  const tickets = await TicketModel.find({}).lean();
  const users = await UserModel.find({}).lean();
  const products = await ProductModel.find({}).lean();
  const orders = await OrderModel.find({ status: "shipped" }).lean();

  // Process the orders to group by month and sum the total_price
  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const year = date.getFullYear();
    const monthYear = `${year}/${month.toString().padStart(2, "0")}`;

    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear] += order.total_price;

    return acc;
  }, {});

  // Get current and previous month sales
  const now = new Date();
  const currentMonth = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  const prevMonth = `${now.getFullYear()}/${(now.getMonth()).toString().padStart(2, "0")}`;

  const currentMonthSales = salesData[currentMonth] || 0;
  const prevMonthSales = salesData[prevMonth] || 0;

  const growthData = [
    {
      date: currentMonth,
      current: currentMonthSales,
      prev: prevMonthSales,
    },
  ];

  // Convert the salesData object into an array of objects for SaleChart
  const chartData = Object.keys(salesData).map((key) => ({
    date: key,
    sale: salesData[key],
  }));

  return (
    <Layout>
      <main>
        <section className={styles.dashboard_contents}>
          <Box title="مجموع تیکت های دریافتی" value={tickets.length || 0} />
          <Box title="مجموع محصولات سایت" value={products.length || 0} />
          <Box title="مجموع سفارشات" value={orders.length || 0} />
          <Box title="مجموع کاربر های سایت" value={users.length || 0} />
        </section>
        <div className={styles.dashboard_charts}>
          <section>
            <p>آمار فروش</p>
            <SaleChart data={chartData} />
          </section>
          <section>
            <p>نرخ رشد</p>
            <GrowthChart data={growthData} />
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default AdminHomePage;


export const metadata = {
  title: "پنل مدیریت",
}