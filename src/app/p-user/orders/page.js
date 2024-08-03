import DataTable from "@/components/templates/p-user/orders/DataTable";
import React from "react";
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import OrderItemsModel from "@/models/OrderItem";
import Layout from "@/components/layouts/userPanelLayout";
import { authUser } from "@/utils/isLogin";
import styles from "@/styles/p-user/dataTable.module.css";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const orders = await OrderModel.find({ user: user._id })
    .sort({ _id: -1 })
    .populate("address");
  const ordersItems = await OrderItemsModel.find({}).populate('product');

  return (
    <Layout>
      <main>
        {orders.length ? (
          <DataTable
            orders={JSON.parse(JSON.stringify(orders))}
            ordersItems={JSON.parse(JSON.stringify(ordersItems))}
            title="لیست سفارش ها"
          />
        ) : (
          <p className={styles.empty}>سفارشی وجود ندارد</p>
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  سفارشات |  پنل کاربری",
}