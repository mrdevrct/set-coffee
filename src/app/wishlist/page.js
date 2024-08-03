import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Product from "@/components/modules/product/Product";
import connectToDB from "@/configs/db";
import styles from "@/styles/wishlist.module.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import WishlistModel from "@/models/Wishlist";
import { authAdmin, authUser } from "@/utils/isLogin";
import ArticleModel from "@/models/Article";
import ProductModel from "@/models/Product";

const page = async () => {
  let wishes = [];
  let userID = null;
  connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();

  if (user) {
    const wishlists = await WishlistModel.find({ user: user._id })
      .populate("product", "_id img name price score")
      .lean();
    wishes = JSON.parse(JSON.stringify(wishlists));
    userID = user._id.toString() || null;
  }
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
      <Breadcrumb route={"علاقه مندی ها"} />
      <main className={styles.container} data-aos="fade-up">
        <p className={styles.title}>محصولات مورد علاقه شما</p>
        <section>
          {wishes.length > 0 &&
            wishes.map((wish) => <Product key={wish._id} {...wish.product} />)}
        </section>
      </main>

      {wishes.length === 0 && (
        <div className={styles.wishlist_empty} data-aos="fade-up">
          <FaRegHeart />
          <p>محصولی یافت نشد</p>
          <span>شما هنوز هیچ محصولی در لیست علاقه مندی های خود ندارید.</span>
          <span>در صفحه "فروشگاه" محصولات جالب زیادی پیدا خواهید کرد.</span>
          <div>
            <Link href="/category">بازگشت به فروشگاه</Link>
          </div>
        </div>
      )}

      <Footer
        articles={JSON.parse(JSON.stringify(lastArticles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;

export const metadata = {
  title: "علاقه مندی ها  | فروشگاه اینترنتی قهوه ست",
}