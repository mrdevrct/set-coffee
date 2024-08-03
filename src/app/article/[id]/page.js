import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Sight from "@/components/templates/article/sight/Sight";
import Details from "@/components/templates/article/details/Details";
import styles from "@/styles/article.module.css";
import { authAdmin, authUser } from "@/utils/isLogin";
import ArticleModel from "@/models/Article";
import SightModel from "@/models/Sight"; // این را اضافه کنید
import connectToDB from "@/configs/db";
import Sights from "@/components/templates/article/sights/Sights";
import ProductModel from "@/models/Product";

const page = async ({ params }) => {
  await connectToDB();
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }

  const articleID = params.id;
  const article = await ArticleModel.findOne({ _id: articleID })
    .populate("user", "name img")
    .populate({
      path: "sights",
      populate: [
        {
          path: "user",
          select: "name img role",
        },
        {
          path: "replay",
          select: "username body",
        },
      ],
    })
    .lean();

  const articles = await ArticleModel.find({}).sort({ _id: -1 }).limit(2);
  const products = await ProductModel.find({}).lean();
  return (
    <>
      <Navbar
        isLogin={user ? true : false}
        userID={userID ? userID : null}
        isAdmin={isAdmin ? true : false}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Breadcrumb route={"قهوه"} />
      <div className={styles.container}>
        <Details article={JSON.parse(JSON.stringify(article))} />
        <Sight articleID={JSON.parse(JSON.stringify(article._id))} />
        <Sights sights={JSON.parse(JSON.stringify(article.sights))} />
      </div>
      <Footer
        articles={JSON.parse(JSON.stringify(articles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default page;


export async function generateMetadata({ params }) {
  const article = await ArticleModel.findOne({ _id: params.id }, "title");

  return {
    title: `${article.title} | فروشگاه اینترنتی قهوه ست`,
    description: `کاوش در مجموعه قهوه‌های تخصصی ما. محصول ${article.title} با ویژگی‌های منحصر به فرد، طعم عالی، و کیفیت بی‌نظیر. بررسی و خرید آنلاین قهوه مورد علاقه‌تان از فروشگاه قهوه ست، با امکان مقایسه و افزودن به لیست علاقه‌مندی‌ها.`,
  };
}
