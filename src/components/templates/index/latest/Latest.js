"use client";
import Link from "next/link";
import styles from "./latest.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import Product from "@/components/modules/product/Product";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Latest = ({ products, wishs = [] }) => {
  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  const isProductInWishlist = (productId) => {
    return wishs.some(
      (wish) => wish.product.toString() === productId.toString()
    );
  };

  return (
    <div className={styles.container}>
      <section className={styles.title}>
        <div>
          <p>آخرین محصولات</p>
        </div>
        <Link className={styles.link} href={"/category"}>
          مشاهده همه <FaChevronLeft className={styles.icon_link}/>{" "}
        </Link>
      </section>
      <main data-aos="fade-up" className={styles.products} dir="rtl">
        {products.map((product) => (
          <Product
            key={product._id}
            isWish={isProductInWishlist(product._id)}
            allProducts={products}
            {...product}
          />
        ))}
      </main>
    </div>
  );
};

export default Latest;
