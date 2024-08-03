import styles from "@/styles/p-user/index.module.css";
import Tickets from "@/components/templates/p-user/index/Tickets";
import Orders from "@/components/templates/p-user/index/Orders";
import Layout from "@/components/layouts/userPanelLayout";
import { authUser } from "@/utils/isLogin";
import TicketModel from "@/models/Ticket";
import WishlistModel from "@/models/Wishlist";
import CommentModel from "@/models/Comment";
import OrderModel from "@/models/Order";
import OrderItemModel from "@/models/OrderItem";
import Box from "@/components/modules/infoBox/InfoBox";

const page = async () => {
  const user = await authUser();
  const tickets = await TicketModel.find({ user: user._id, isAnswer: false })
    .populate("department", "title")
    .sort({ _id: -1 })
    .limit(3)
    .lean();

  const allTickets = await TicketModel.find({
    user: user._id,
    isAnswer: false,
  });
  const wishlists = await WishlistModel.find({ user: user._id });
  const comments = await CommentModel.find({ userID: user._id });
  const orders = await OrderModel.find({ user: user._id, status: "shipped" });
  const lastOrders = await OrderModel.find({
    user: user._id,
    status: "shipped",
  })
    .sort({ _id: -1 })
    .limit(2);

  const orderItems = await OrderItemModel.find({})
    .populate("product", "name img")
    .lean();

  return (
    <Layout>
      <main>
        <section className={styles.boxes}>
          <Box title="مجموع تیکت ها " value={allTickets.length || 0} />
          <Box title="مجموع کامنت ها " value={comments.length || 0} />
          <Box title="مجموع سفارشات" value={orders.length || 0} />
          <Box title="مجموع علاقه مندی ها" value={wishlists.length || 0} />
        </section>
        <section className={styles.contents}>
          <Tickets tickets={JSON.parse(JSON.stringify(tickets))} />
          <Orders
            orders={JSON.parse(JSON.stringify(lastOrders))}
            orderItems={JSON.parse(JSON.stringify(orderItems))}
          />
        </section>
      </main>
    </Layout>
  );
};

export default page;

export const metadata = {
  title: "پنل کاربری",
}