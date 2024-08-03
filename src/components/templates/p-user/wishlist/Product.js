"use client";
import styles from "./product.module.css";
import Link from "next/link";
import { FaRegStar, FaStar } from "react-icons/fa";
import swal from "sweetalert";
const Card = ({ productID, productImage, price, score, name }) => {
  const removeProduct = () => {
    swal({
      title: "آیا از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/wishlist/${productID}`, {
          method: "DELETE",
        });

        if (res.status === 200) {
          swal({
            title: "محصول با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        }
      }
    });
  };

  return (
    <div className={styles.card}>
      <Link href={`/product/${productID}`}>
        <img
          width={283}
          height={283}
          src={
            productImage ||
            "https://set-coffee.com/wp-content/uploads/2022/03/ethiopia-430x430.png"
          }
          alt=""
        />
      </Link>
      <p dir="rtl">{name}</p>
      <div>
        <div dir="ltr">
          {new Array(score).fill(0).map((item, index) => (
            <FaStar key={index} />
          ))}

          {new Array(5 - score).fill(0).map((item, index) => (
            <FaRegStar key={index} />
          ))}
        </div>
        <span>{price.toLocaleString()} تومان</span>
      </div>
      <button onClick={removeProduct} className={styles.delete_btn}>
        حذف محصول{" "}
      </button>
    </div>
  );
};

export default Card;
