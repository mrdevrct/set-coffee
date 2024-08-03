import Layout from "@/components/layouts/adminPanelLayout";
import React from "react";
import AddArticle from "@/components/templates/p-admin/articles/AddArticle"

function addArticle() {
  return (
    <Layout>
      <AddArticle />
    </Layout>
  );
}

export default addArticle;

export const metadata = {
  title: "  مقاله جدید |  پنل مدیریت",
}
