import React from "react";
import styles from "@/components/templates/p-admin/products/table.module.css";
import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import Layout from "@/components/layouts/adminPanelLayout";
import Table from "@/components/templates/p-admin/products/Table";
import Link from "next/link";

const page = async () => {
  connectToDB();
  const products = await ProductModel.find({}).sort({ _id: -1 }).lean();

  return (
    <Layout>
      <main className={styles.container}>
        {products.length === 0 ? (
          <>
            <p className={styles.empty}>
              محصولی وجود ندارد
              <Link
                href="/p-admin/products/add-product"
                className={styles.addProduct}
              >
                ایجاد محصول جدید
              </Link>
            </p>
          </>
        ) : (
          <Table
            products={JSON.parse(JSON.stringify(products))}
            title="لیست محصولات ها"
          />
        )}
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  محصولات |  پنل مدیریت",
}