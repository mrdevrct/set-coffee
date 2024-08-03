"use client"
import React from "react";
import styles from "@/styles/complate-order.module.css";
import Link from "next/link";
import { ShowSwal } from "@/utils/helper";

function Complate({ order }) {

  const complateHandler = async () => {
    const res = await fetch("/api/orders/complate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderID: order._id }),
    });

    if (res.status === 200) {
      swal({
        title: "پرداخت با موفقیت انجام شد محصول بعد از بررسی ارسال می شود",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        localStorage.removeItem('cart');
        location.pathname = "/";
      });
    } else {
      ShowSwal("در پرداخت مشکلی پیش امد", "error", "فهمیدم");
    }
  };

  return (
    <main className={styles.container} data-aos="fade-left">
      <div className={styles.box}>
        <ul>
          <li>شماره سفارش: {order._id}</li>
          <li>
            تاریخ: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </li>
          <li>
            قیمت نهایی:{" "}
            <strong>{order.total_price.toLocaleString("fa-IR")} تومان</strong>
          </li>
          <li>روش پرداخت: {order.payment_method}</li>
        </ul>
        <div>
          <button onClick={complateHandler}>پرداخت</button>
          <Link href={"/checkout"}>
            <button>بازگشت</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Complate;
