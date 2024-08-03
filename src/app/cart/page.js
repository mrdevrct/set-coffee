import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Stepper from "@/components/modules/stepper/Stepper";
import Table from "@/components/templates/cart/Table";
import connectToDB from "@/configs/db";
import { authAdmin, authUser } from "@/utils/isLogin";
import ArticleModel from "@/models/Article"
import ProductModel from "@/models/Product"

const page = async () => {
  connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  const deliveryCost = 40000;
  const articles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const products = await ProductModel.find({});

  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Stepper step="cart" />
      <Table isLogin={user ? true : false} deliveryCost={deliveryCost} products={JSON.parse(JSON.stringify(products))}/>
      <Footer articles={JSON.parse(JSON.stringify(articles))} isLogin={user ? true : false}/>
    </>
  );
};

export default page;

export const metadata = {
  title: "سبد خرید  | فروشگاه اینترنتی قهوه ست",
}