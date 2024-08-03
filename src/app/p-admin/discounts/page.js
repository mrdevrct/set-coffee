import Layout from "@/components/layouts/adminPanelLayout";
import AddDiscount from "@/components/templates/p-admin/discounts/AddDiscount";
import Table from "@/components/templates/p-admin/discounts/Table";
import styles from "@/components/templates/p-admin/discounts/table.module.css";
import connectToDB from "@/configs/db";
import DiscountModel from "@/models/Discount";

const Discounts = async () => {
  connectToDB();
  const discounts = await DiscountModel.find({}).sort({ _id: -1 }).lean();

  return (
    <Layout>
      <main>
        <AddDiscount />

        {discounts.length === 0 ? (
          <p className={styles.empty}>کد تخفیفی وجود ندارد</p>
        ) : (
          <Table
            discounts={JSON.parse(JSON.stringify(discounts))}
            title="لیست تخفیفات"
          />
        )}
      </main>
    </Layout>
  );
};

export default Discounts;

export const metadata = {
  title: "  تخفیفات |  پنل مدیریت",
}