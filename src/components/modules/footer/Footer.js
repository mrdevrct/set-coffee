"use client";
import styles from "./footer.module.css";
import { MdOutlineCopyright } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import Article from "./Article";
import Link from "next/link";
import React, { useState } from "react";

import { BsShop } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { LuShoppingCart } from "react-icons/lu";
import { LiaHomeSolid } from "react-icons/lia";
import { IoIosArrowDown } from "react-icons/io";

const Footer = ({ articles, isLogin }) => {
  const [showArticle, setShowArticle] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        <main className="container">
          <section className={styles.descriptions}>
            <img src="/images/logo_light.png" alt="" />
            <p className={styles.descriptions_title}>
              شرکت فنجان داغ خوارزمی، فروشگاه اینترنتی قهوه ست
            </p>

            <div className={styles.description}>
              <FaRegHeart style={{ fontSize: "2rem" }} />
              <p>
                تهران. شریف آباد . شهرک صنعتی خوارزمی فاز 2 . بلوار بهارستان.
                خیابان ماگنولیا بلوک آ117
              </p>
            </div>
            <div className={styles.description}>
              <FaRegHeart />
              <p>پیگیری سفارشات : 02188305827</p>
            </div>
            <div className={styles.description}>
              <FaRegHeart />
              <p>support [at] set-coffee.com</p>
            </div>
          </section>

          {articles && (
            <section className={styles.article_footer}>
              <div className={styles.article_header}>
                <IoIosArrowDown onClick={() => setShowArticle(!showArticle)} />
                <h4>جدیدترین نوشته ها</h4>
              </div>
              <div className={styles.articles_desktop}>
                {articles.map((article) => (
                  <React.Fragment key={article._id}>
                    <Article
                      key={article._id}
                      href={`/article/${article._id}`}
                      data={article.createdAt.toLocaleString()}
                      comments={
                        article.sights.length
                          ? "دیدگاه" + " " + article.sights.length
                          : "بدون دیدگاه"
                      }
                      img={
                        article.cover_image ||
                        "https://set-coffee.com/wp-content/uploads/elementor/thumbs/IMG_20230920_130854_091-qconsqrfwm7t626t2hckfjifv0kdd7cofsbfd1jcig.jpg"
                      }
                      title={article.title}
                    />
                    <hr />
                  </React.Fragment>
                ))}
              </div>

              {showArticle && (
                <div className={styles.articles_mobile}>
                  {articles.map((article) => (
                    <React.Fragment key={article._id}>
                      <Article
                        key={article._id}
                        href={`/article/${article._id}`}
                        data={article.createdAt.toLocaleString()}
                        comments={
                          article.sights.length
                            ? "دیدگاه" + " " + article.sights.length
                            : "بدون دیدگاه"
                        }
                        img={
                          article.cover_image ||
                          "https://set-coffee.com/wp-content/uploads/elementor/thumbs/IMG_20230920_130854_091-qconsqrfwm7t626t2hckfjifv0kdd7cofsbfd1jcig.jpg"
                        }
                        title={article.title}
                      />
                      <hr />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </section>
          )}
          <ul className={styles.links}>
            <div>
              <h4>منوی فوتر</h4>
              <li>
                <Link href={"/contact-us"}>تماس با ما</Link>
              </li>
              <li>
                <Link href={"/about-us"}>درباره ما </Link>
              </li>
              <li>
                <Link href={"/rules"}>قوانین</Link>
              </li>
            </div>
            <div>
              <h4>دسترسی سریع</h4>
              <li>
                <Link href={"/category"}> فروشگاه </Link>
              </li>
              <li>
                <Link href={"/articles"}> مقالات </Link>
              </li>
              <li>
                <Link href={"/cart"}>سبد خرید</Link>
              </li>
              <li>
                <Link href={"/wishlist"}>علاقه مندی ها</Link>
              </li>
            </div>
          </ul>
          <div className={styles.licenses}>
            <img src="/images/license4.htm" width={76} height={76} alt="" />
            <img src="/images/license1.png" width={85} height={85} alt="" />
            <img src="/images/license3.png" alt="" />
            <img src="/images/license2.svg" width={62} height={95} alt="" />
          </div>
        </main>
        <hr />
        <div className="container">
          <p className={styles.copyRight}>
            {" "}
            2023
            <MdOutlineCopyright /> تمام حقوق متعلق است به{" "}
            <strong>قهوه ست</strong> | طراحی و اجرا{" "}
            <strong>نیلامارکتینگ</strong>
          </p>
        </div>
      </footer>

      <div className={styles.footer_mobile}>
        <div className={styles.footer_main}>
          <Link href="/category">
            <div className={styles.icon_footer}>
              <BsShop />
              <span>فروشگاه</span>
            </div>
          </Link>
          <Link href={isLogin ? "/p-user" : "/login-register"}>
            <div className={styles.icon_footer}>
              <GoPerson />
              <span>حساب کاربری من</span>
            </div>
          </Link>
          <Link href="/cart">
            <div className={styles.icon_footer}>
              <LuShoppingCart />
              <span>سبد خرید</span>
            </div>
          </Link>
          <Link href="/">
            <div className={styles.icon_footer}>
              <LiaHomeSolid />
              <span>خانه</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
