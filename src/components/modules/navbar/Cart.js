import React, { useEffect, useState } from "react";
import styles from "./cart.module.css";
import { IoMdClose } from "react-icons/io";
import { ShowSwal } from "@/utils/helper";

function Cart({ allProduct, setTotalPrice }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  useEffect(calcTotalPrice, [cart]);

  function calcTotalPrice() {
    let price = 0;

    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0
      );
      setTotalPrice(price);
    } else {
      setTotalPrice(price);
    }
  }

  function updateCartItem(id, count) {
    const product = allProduct.find((item) => item._id === id);
    if (!product) {
      console.error("Product not found");
      return;
    }

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const localCartItem = localCart.find((item) => item.id === id);

    if (localCartItem && localCartItem.count + count > product.inventory) {
      ShowSwal("تعداد بیشتر از موجودی است", "error", "فهمیدم");
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newCount = item.count + count;
        if (newCount > product.inventory) {
          ShowSwal("تعداد بیشتر از موجودی است", "error", "فهمیدم");
          return item;
        }
        return { ...item, count: Math.max(newCount, 1) };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function removeCartItem(id) {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <>
      {cart.map((item, index) => (
        <div
          className={`${styles.cartItem} ${
            index !== 0 ? styles.borderTop : ""
          }`}
          key={item.id}
        >
          <div className={styles.cart_img}>
            <img src={item.img} alt="" className={styles.cart_img} />
            <span onClick={() => removeCartItem(item.id)}>
              <IoMdClose />
            </span>
          </div>
          <div className={styles.details}>
            <p className={styles.cart_name}>{item.name}</p>
            <span>{item.price.toLocaleString("fa-IR")} تومان</span>
            <div className={styles.count}>
              <span
                onClick={() => updateCartItem(item.id, 1)}
                className={styles.increment}
              >
                +
              </span>
              {item.count}
              <span
                onClick={() => updateCartItem(item.id, -1)}
                className={styles.decrement}
              >
                -
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Cart;
