import DataTable from "@/components/templates/p-admin/orders/Table";
import React from "react";
import connectToDB from "@/configs/db";
import OrderModel from "@/models/Order";
import OrderItemsModel from "@/models/OrderItem";
import Layout from "@/components/layouts/adminPanelLayout";
import styles from "@/components/templates/p-admin/orders/table.module.css";

const page = async () => {
  connectToDB();
  const orders = await OrderModel.find({}).sort({ _id: -1 }).populate("address");
  const ordersItems = await OrderItemsModel.find({}).populate("product");

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
  title: "  سفارشات |  پنل مدیریت",
}