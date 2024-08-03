import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import styles from "@/styles/checkout.module.css";
import Order from "@/components/templates/checkout/order/Order";
import connectToDB from "@/configs/db";
import { authAdmin, authUser } from "@/utils/isLogin";
import { redirect } from "next/navigation"; // Import the redirect function
import ArticleModel from "@/models/Article";
import ProductModel from "@/models/Product";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  if (!user) {
    redirect("/login-register");
  }

  const deliveryCost = 40000;
  const lastArticles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const allProducts = await ProductModel.find({}).lean();

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(allProducts))}

      />
      <Stepper step="checkout" />
      <div className={styles.container} data-aos="fade-up">
        <main className={styles.checkout}>
          <Order
            deliveryCost={deliveryCost}
            allProducts={JSON.parse(JSON.stringify(allProducts))}
          />
        </main>
      </div>

      <Footer
        articles={JSON.parse(JSON.stringify(lastArticles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;

export const metadata = {
  title: "مشخصات خرید  | فروشگاه اینترنتی قهوه ست",
}