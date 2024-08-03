import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Articles from "@/components/templates/articles/Articles";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { authAdmin, authUser } from "@/utils/isLogin";
import ProductModel from "@/models/Product";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  const articles = await ArticleModel.find({}).lean();
  const lastArticles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const products = await ProductModel.find({}).lean();
  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Breadcrumb route={"اخبار و مقالات"} />
      <Articles articles={JSON.parse(JSON.stringify(articles))} />
      <Footer
        articles={JSON.parse(JSON.stringify(lastArticles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;

export const metadata = {
  title: "مقالات  | فروشگاه اینترنتی قهوه ست",
}