import styles from "@/styles/product.module.css";
import Gallery from "@/components/templates/product/Gallery";
import Details from "@/components/templates/product/Details";
import Tabs from "@/components/templates/product/Tabs";
import MoreProducts from "@/components/templates/product/MoreProducts";
import { authAdmin, authUser } from "@/utils/isLogin";
import Navbar from "@/components/modules/navbar/Navbar";
import Footer from "@/components/modules/footer/Footer";
import ProductModel from "@/models/Product";
import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";

const product = async ({ params }) => {
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  connectToDB();
  const productID = params.id;
  const product = await ProductModel.findOne({ _id: productID }).populate({
    path: "comments",
    populate: {
      path: "userID",
      select: "img name",
    },
  });

  const relatedProducts = await ProductModel.find({ smell: product.smell });
  const lastArticles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const allProducts = await ProductModel.find({}).lean();

  return (
    <>
      <div className={styles.container}>
        <Navbar
          isLogin={user ? true : false}
          userID={userID ? userID : null}
          isAdmin={isAdmin ? true : false}
          products={JSON.parse(JSON.stringify(allProducts))}
        />
        <div data-aos="fade-up" className={styles.contents}>
          <div className={styles.main}>
            <Details product={JSON.parse(JSON.stringify(product))} />
            <Gallery product={JSON.parse(JSON.stringify(product))} />
          </div>
          <Tabs product={JSON.parse(JSON.stringify(product))} />
          <MoreProducts
            relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
          />
        </div>
        <Footer
          articles={JSON.parse(JSON.stringify(lastArticles))}
          isLogin={user ? true : false}
        />
      </div>
    </>
  );
};

export default product;

// Metadata 
export async function generateMetadata({ params }) {
  const product = await ProductModel.findOne({ _id: params.id }, "name");

  return {
    title: `${product.name} | فروشگاه اینترنتی قهوه ست`,
    description: `کاوش در مجموعه قهوه‌های تخصصی ما. محصول ${product.name} با ویژگی‌های منحصر به فرد، طعم عالی، و کیفیت بی‌نظیر. بررسی و خرید آنلاین قهوه مورد علاقه‌تان از فروشگاه قهوه ست، با امکان مقایسه و افزودن به لیست علاقه‌مندی‌ها.`,
  };
}

