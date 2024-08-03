"use client";
import Link from "next/link";
import styles from "./product.module.css";
import { FaHeart, FaRegStar, FaStar } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import { ShowSwal } from "@/utils/helper";

const Card = ({
  _id,
  img,
  name,
  price,
  score,
  isWish,
  inventory,
  allProducts,
}) => {
  const [count, setCount] = useState(1);
  const [user, setUser] = useState({});

  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const data = await res.json();
        setUser({ ...data });
      }
    };

    authUser();
  }, []);

  const addToWishlist = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      return swal({
        title: "برای اضافه کردن به علاقه مندی‌ها لطفا ابتدا لاگین کنید",
        icon: "error",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
      });
    }

    const wish = {
      user: user._id,
      product: _id,
    };

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wish),
    });

    if (res.status === 201) {
      swal({
        title: "محصول مورد نظر به علاقه‌مندی‌ها اضافه شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
      });
    } else if (res.status === 409) {
      return ShowSwal(
        "این محصول قبلا در لیست علاقه‌مندی‌ها اضافه شده است",
        "error",
        "فهمیدم"
      );
    }
  };

  const addToCart = () => {
    const product = allProducts.find((item) => item._id === _id);

    if (!product) {
      return swal({
        title: "محصول مورد نظر یافت نشد",
        icon: "error",
        buttons: "فهمیدم",
      });
    }

    if (product.inventory === 0) {
      return swal({
        title: "موجودی محصول کافی نیست",
        icon: "error",
        buttons: "فهمیدم",
      });
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find((item) => item.id === _id);
    const currentCount = cartItem ? cartItem.count : 0;
    const totalCount = currentCount + count;

    if (totalCount > product.inventory) {
      return swal({
        title: "تعداد محصول در سبد خرید بیشتر از موجودی است",
        icon: "error",
        buttons: "فهمیدم",
      });
    }

    if (cartItem) {
      cartItem.count = totalCount;
    } else {
      cart.push({
        id: _id,
        name: name,
        price: price,
        img: img,
        count: count,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    swal({
      title: "محصول با موفقیت به سبد خرید اضافه شد",
      icon: "success",
      buttons: "فهمیدم",
    }).then(() => {
      setCount(1);
      location.reload();
    });
  };

  const locale = "fa-IR";

  function formatPrice(price, locale) {
    return price.toLocaleString(locale);
  }

  return (
    <div className={styles.card}>
      <div className={styles.details_container}>
        <Link href={`/product/${_id}`}>
          <img src={img} alt={name} className={styles.imageLink} />
        </Link>
        <div className={styles.icons}>
          {isWish ? (
            <FaHeart style={{ color: "red" }} />
          ) : (
            <div onClick={addToWishlist}>
              <>
                <CiHeart />
                <p className={styles.tooltip}>افزودن به علاقه مندی ها</p>
              </>
            </div>
          )}
        </div>
        {typeof inventory === "number" && inventory > 0 ? (
          <button onClick={addToCart}>افزودن به سبد خرید</button>
        ) : (
          <button>موجود نیست</button>
        )}
      </div>

      <div className={styles.mobile}>
        <Link href={`/product/${_id}`}>
          <img src={img} alt={name} className={styles.imageLink} />
        </Link>
        <button className={styles.addBtn} onClick={addToCart}>
          افزودن
        </button>
      </div>

      <div className={styles.details}>
        <Link href={`/product/${_id}`}>{name}</Link>
        <div>
          {score ? (
            <>
              {new Array(score).fill(0).map((_, index) => (
                <FaStar key={index} />
              ))}

              {new Array(5 - score).fill(0).map((_, index) => (
                <FaRegStar key={index} />
              ))}
            </>
          ) : (
            <>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </>
          )}
        </div>
        <span>{formatPrice(price, locale)} تومان</span>
      </div>
    </div>
  );
};

export default Card;
