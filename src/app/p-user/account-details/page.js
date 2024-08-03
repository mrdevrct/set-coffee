import Layout from "@/components/layouts/userPanelLayout";
import AccountDetails from "@/components/templates/p-user/details/AccountDetails"

const page = () => {
  return (
    <Layout>
      <AccountDetails />
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "  جزئیات اکانت |  پنل کاربری",
}