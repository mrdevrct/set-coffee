import Layout from "@/components/layouts/adminPanelLayout";
import AddProduct from "@/components/templates/p-admin/products/AddProduct";
import React from "react";

function page() {
  return (
    <Layout>
        <AddProduct />
    </Layout>
  );
}

export default page;

export const metadata = {
  title: "  محصول جدید |  پنل مدیریت",
}