import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Products from "@/components/templates/category/products/Products";
import styles from "@/styles/category.module.css";
import ProductModel from "@/models/Product";
import WishlistModel from "@/models/Wishlist";
import { authAdmin, authUser } from "@/utils/isLogin";
import ArticleModel from "@/models/Article";

const page = async () => {
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  let wishs = [];

  if (user) {
    userID = user._id.toString() || null;
  }

  const products = await ProductModel.find({});
  const lastProducts = await ProductModel.find({}).sort({ _id: -1 });
  const wishlist = await WishlistModel.find({}).populate("product", "name");
  const lastArticles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  if (user) {
    wishs = await WishlistModel.find({ user: user._id });
  }


  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Breadcrumb route={"فروشگاه"} />
      <main className={styles.container} data-aos="fade-up">
        <div className={styles.category}>
          <Products
            products={JSON.parse(JSON.stringify(products))}
            sortBylastProduct={JSON.parse(JSON.stringify(lastProducts))}
            wishlist={JSON.parse(JSON.stringify(wishlist))}
            wishs={JSON.parse(JSON.stringify(wishs))}
          />
        </div>
      </main>
      <Footer articles={JSON.parse(JSON.stringify(lastArticles))} isLogin={user ? true : false}/>
    </>
  );
};

export default page;

export const metadata = {
  title: "محصولات  | فروشگاه اینترنتی قهوه ست",
}