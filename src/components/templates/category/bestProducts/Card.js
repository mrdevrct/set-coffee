"use client";
import Link from "next/link";
import styles from "./card.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";

const Card = ({ _id, name, img, price, score }) => {
  const locale = "fa-IR";

  function formatPrice(price, locale) {
    return price.toLocaleString(locale);
  }


  return (
    <div className={styles.card}>
      <img
        src={img || "https://set-coffee.com/wp-content/uploads/2021/10/03.png"}
        alt=""
      />
      <div>
        <Link href={`/product/${_id}`}>{name}</Link>
        <div className={styles.stars}>
          {new Array(score).fill(0).map((item, i) => (
            <FaStar key={i} />
          ))}
          {new Array(5 - score).fill(0).map((item, i) => (
            <FaRegStar key={i} />
          ))}
        </div>
        <span>{formatPrice(price , locale)} تومان</span>
      </div>
    </div>
  );
};

export default Card;
