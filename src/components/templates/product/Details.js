"use client";
import { FaFacebookF, FaRegStar, FaStar, FaTwitter } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { TbSwitch3 } from "react-icons/tb";
import { FaTelegram, FaLinkedinIn, FaPinterest } from "react-icons/fa";
import styles from "./details.module.css";
import Breadcrumb from "./Breadcrumb";
import { IoMdClose } from "react-icons/io";
import AddToWishlist from "./AddToWishlist";
import { useState } from "react";

const Details = ({ product }) => {
  const [count, setCount] = useState(1);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    if (count < product.inventory) {
      setCount(count + 1);
    } else {
      swal({
        title: "تعداد وارد شده بیشتر از موجودی انبار است",
        icon: "warning",
        buttons: "فهمیدم",
      });
    }
  };

  const addToCart = () => {
    if (count > product.inventory) {
      swal({
        title: "تعداد وارد شده بیشتر از موجودی انبار است",
        icon: "warning",
        buttons: "فهمیدم",
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length) {
      const isInCart = cart.some((item) => item.id === product._id);

      if (isInCart) {
        cart.forEach((item) => {
          if (item.id === product._id) {
            item.count = item.count + count;
          }
        });
        localStorage.setItem("cart", JSON.stringify(cart));

        swal({
          title: "محصول با موفقیت به سبد خرید اضافه شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          setCount(1);
          location.reload();
        });
      } else {
        const cartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          img: product.img,
          count,
        };

        cart.push(cartItem);

        localStorage.setItem("cart", JSON.stringify(cart));

        swal({
          title: "محصول با موفقیت به سبد خرید اضافه شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          setCount(1);
          location.reload();
        });
      }
    } else {
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        img: product.img,
        count,
      };

      cart.push(cartItem);

      localStorage.setItem("cart", JSON.stringify(cart));

      swal({
        title: "محصول با موفقیت به سبد خرید اضافه شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        setCount(1);
        location.reload();
      });
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumb title={product.name} />
      <h2>{product.name}</h2>

      <div className={styles.rating}>
        <div dir="ltr">
          {new Array(product.score).fill(0).map((item, index) => (
            <FaStar key={index} />
          ))}

          {new Array(5 - product.score).fill(0).map((item, index) => (
            <FaRegStar key={index} />
          ))}
        </div>
        <p>
          (دیدگاه{" "}
          {product.comments.filter((comment) => comment.isAccept).length} کاربر)
        </p>
      </div>

      <p className={styles.price}>
        {product.price.toLocaleString("fa-IR")} تومان
      </p>

      <span className={styles.description}>{product.shortDesc}</span>

      <hr />

      <div className={styles.Available}>
        {!product.inventory > 0 ? (
          <IoMdClose style={{ color: "red" }} />
        ) : (
          <IoCheckmark />
        )}
        <p>
          {product.inventory <= 0 ? (
            "در انبار موجود نمی باشد"
          ) : product.inventory > 10 ? (
            <span>موجود در انبار</span>
          ) : (
            `${
              product.inventory.toLocaleString("fa-IR") + " عدد "
            } موجود در انبار`
          )}
        </p>
      </div>

      <div className={styles.cart}>
        {product.inventory > 0 && (
          <>
            <button onClick={addToCart} style={{ color: "white" }}>
              افزودن به سبد خرید
            </button>
            <div>
              <span onClick={decrementCount}>-</span>
              {count}
              <span onClick={incrementCount}>+</span>
            </div>
          </>
        )}
      </div>

      <section className={styles.wishlist}>
        <AddToWishlist productID={product._id} />
      </section>

      <hr />

      <div className={styles.details}>
        <strong>شناسه محصول: {product._id}</strong>
        <p>
          {" "}
          <strong>دسته:</strong> Coffee Capsule, کپسول قهوه, همه موارد
        </p>
        <p>
          <strong>برچسب:</strong>
          {product.tags.join(",")}
        </p>
      </div>

      <div className={styles.share}>
        <p>به اشتراک گذاری: </p>
        <a href="/">
          <FaTelegram />
        </a>
        <a href="/">
          <FaLinkedinIn />
        </a>
        <a href="/">
          <FaPinterest />
        </a>
        <a href="/">
          <FaTwitter />
        </a>
        <a href="/">
          <FaFacebookF />
        </a>
      </div>

      <hr />
    </main>
  );
};

export default Details;
