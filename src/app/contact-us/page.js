import React from "react";
import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Form from "@/components/templates/contact-us/Form";
import Information from "@/components/templates/contact-us/Information";
import Map from "@/components/templates/contact-us/Map";
import styles from "@/styles/contact-us.module.css";
import { authAdmin, authUser } from "@/utils/isLogin";
import Link from "next/link";
import ArticleModel from "@/models/Article";
import ProductModel from "@/models/Product";

const Page = async () => {
  const user = await authUser();
  const isAdmin = await authAdmin();
  let userID = null;
  if (user) {
    userID = user._id.toString() || null;
  }
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
      <Breadcrumb route={"تماس با ما"} />

      <div className={styles.container}>
        <main className={styles.maps}>
          <section>
            <Map
              position={[35.72021225108499, 51.42222691580869]}
              center={[35.72021225108499, 51.42222691580869]}
            >
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه انقلاب)</h3>
              <p>
                تهران - خ انقلاب بین میدان فردوسی و چهار راه کالج روبروی خ ویلا
                شماره ۸۵۲
              </p>
              <p>021-66726563</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </Map>
            <div className={styles.infoMap}>
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه انقلاب)</h3>
              <p>
                تهران - خ انقلاب بین میدان فردوسی و چهار راه کالج روبروی خ ویلا
                شماره ۸۵۲
              </p>
              <p>021-66726563</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </div>
          </section>

          <section>
            <Map
              position={[35.70153474690238, 51.41497422314844]}
              center={[35.70153474690238, 51.41497422314844]}
            >
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه جم)</h3>
              <p>
                تهران – خ کریمخان زند – خ قائم مقام فراهانی – ابتدای خ فجر(جم) –
                شماره ۱۰
              </p>
              <p>021-88305827</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </Map>
            <div className={styles.infoMap}>
              <span>فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه جم)</h3>
              <p>
                تهران – خ کریمخان زند – خ قائم مقام فراهانی – ابتدای خ فجر(جم) –
                شماره ۱۰
              </p>
              <p>021-88305827</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </div>
          </section>
        </main>
      </div>

      <div className={styles.container}>
        <div className={styles.contents}>
          <Form />
          <Information />
        </div>
      </div>

      <Footer
        articles={JSON.parse(JSON.stringify(lastArticles))}
        isLogin={user ? true : false}
      />
    </>
  );
};

export default Page;

export const metadata = {
  title: "تماس با ما  | فروشگاه اینترنتی قهوه ست",
}