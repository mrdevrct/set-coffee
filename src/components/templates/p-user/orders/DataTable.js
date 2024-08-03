"use client";
import React, { useState } from "react";
import styles from "@/styles/p-user/dataTable.module.css";

export default function DataTable({ orders, ordersItems, title }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  function getStatusStyle(status) {
    switch (status) {
      case "pending":
        return styles.blue;
      case "processing":
        return styles.yellow;
      case "shipped":
        return styles.green;
      case "canceled":
        return styles.red;
      default:
        return "";
    }
  }

  function closeDetails() {
    setSelectedOrder(null);
  }

  function getOrderItems(orderId) {
    return ordersItems.filter((item) => item.order === orderId);
  }

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام گیرنده</th>
              <th>مجموع قیمت</th>
              <th>تاریخ</th>
              <th>مشاهده سفارش</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id}>
                <td>{i + 1}</td>
                <td>{order.firstname}</td>
                <td>{order.total_price.toLocaleString("fa-IR")}</td>
                <td>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
                <td>
                  <button
                    className={styles.delete_btn}
                    onClick={() => setSelectedOrder(order)}
                  >
                    مشاهده سفارش
                  </button>
                </td>
                <td>
                  {order.status === "pending" ? (
                    <a href={`/complate-order/${order._id}`}>
                      <button
                        className={`${styles.delete_btn} ${getStatusStyle(
                          order.status
                        )}`}
                      >
                       پرداخت
                      </button>
                    </a>
                  ) : (
                    <button
                      className={`${styles.delete_btn} ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status === "processing"
                        ? "درحال پردازش"
                        : order.status === "shipped"
                        ? "تحویل داده شده"
                        : order.status === "canceled"
                        ? "لغو شده"
                        : null}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <>
          <div className={styles.overlay} onClick={closeDetails}></div>
          <div className={styles.orderDetails}>
            <h2>جزئیات سفارش</h2>
            <ul style={{ marginTop: "20px" }}>
              <li>
                <strong>نام:</strong> {selectedOrder.firstname}{" "}
                {selectedOrder.lastname}
              </li>
              <li>
                <strong>شرکت:</strong>{" "}
                {selectedOrder.company || "چیزی وارد نشده"}
              </li>
              <li>
                <strong>استان:</strong> {selectedOrder.address.province}
              </li>
              <li>
                <strong>شهر:</strong> {selectedOrder.address.city}
              </li>
              <li>
                <strong>کد پستی:</strong> {selectedOrder.address.postal_code}
              </li>
              <li>
                <strong>ایمیل:</strong> {selectedOrder.email || "چیزی وارد نشده"}
              </li>
              <li>
                <strong>تلفن:</strong> {selectedOrder.phone}
              </li>
              <li>
                <strong>آدرس:</strong> {selectedOrder.address.address}
              </li>
              <li>
                <strong>قیمت کل:</strong> {selectedOrder.total_price}
              </li>
              <li>
                <strong>روش پرداخت:</strong> {selectedOrder.payment_method}
              </li>
              <li>
                <strong>یادداشت:</strong>{" "}
                {selectedOrder.note || "چیزی وارد نشده"}
              </li>
              <li>
                <strong>محصولات:</strong>
                <ul>
                  <ul>
                    {getOrderItems(selectedOrder._id).map((item, index) => (
                      <li key={index}>
                        {item.product.name} - تعداد: {item.quantity} مبلغ:{" "}
                        {item.price}
                      </li>
                    ))}
                  </ul>
                </ul>
              </li>
            </ul>
            <button className={styles.closeBtn} onClick={closeDetails}>
              بستن
            </button>
          </div>
        </>
      )}
    </div>
  );
}
