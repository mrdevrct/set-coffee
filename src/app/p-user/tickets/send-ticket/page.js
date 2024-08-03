import Layout from "@/components/layouts/userPanelLayout";
import SendTicket from "@/components/templates/p-user/tickets/SendTicket";

const page = () => {
  return (
    <Layout>
      <SendTicket/>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: " تیکت جدید |  پنل کاربری",
}