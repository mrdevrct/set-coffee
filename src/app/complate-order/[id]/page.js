import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import connectToDB from "@/configs/db";
import { authAdmin, authUser } from "@/utils/isLogin";
import OrderModel from "@/models/Order";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import Complate from "@/components/templates/complate-order/Complate";
import ArticleModel from "@/models/Article";
import ProductModel from "@/models/Product";

const page = async ({ params }) => {
  connectToDB();
  const user = await authUser();
  if (!user) {
    redirect("/login-register");
  }
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  const lastArticles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const orderID = params.id;
  const products = await ProductModel.find({}).lean();

  // Check if the orderID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    redirect("/");
    return;
  }

  const order = await OrderModel.findOne({ _id: orderID });
  if (!order) {
    // Redirect to the home page if the order is not found
    redirect("/");
    return;
  }

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Stepper step="complate" />
      {order.status === "pending" ? (
        <Complate order={JSON.parse(JSON.stringify(order))} />
      ) : order.status === "processing" ? (
        <p style={{ textAlign: "center", margin: "20px", fontSize: "30px" }}>
          پرداخت شده درحال پردازش و ارسال کالا
        </p>
      ) : order.status === "shipped" ? (
        <p style={{ textAlign: "center", margin: "20px", fontSize: "30px" }}>
          محصول به کاربر تحویل داده شده
        </p>
      ) : order.status === "canceled" ? (
        <p style={{ textAlign: "center", margin: "20px", fontSize: "30px" }}>
          سفارش کننده این سفارش لغو کرده است
        </p>
      ) : null}
      <Footer
        articles={JSON.parse(JSON.stringify(lastArticles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;

export const metadata = {
  title: "تکمیل خرید  | فروشگاه اینترنتی قهوه ست",
}