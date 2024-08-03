"use client"
import React from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";

function Table({ discounts }) {
  const removeDiscount = async (discountID) => {
    swal({
      title: "آیا از حذف کد تخفیف مطمئن هستید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/discount", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discountID }),
        });

        if (res.status === 200) {
          swal({
            title: "کد تخفیف با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش آمد", "error", "فهمیدم");
        }
      }
    });
  };

  return (
    <div className={styles.table_container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>شناسه</th>
            <th>کد</th>
            <th>درصد</th>
            <th>حداکثر استفاده</th>
            <th>دفعات استفاده شده</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount, index) => (
            <tr key={discount._id}>
              <td
                className={discount.maxUse === discount.uses ? styles.red : styles.green}
              >
                {index + 1}
              </td>
              <td>{discount.code}</td>
              <td>{discount.percent}</td>
              <td>{discount.maxUse}</td>
              <td>{discount.uses}</td>
              <td>
                <button
                  className={styles.delete_btn}
                  onClick={() => removeDiscount(discount._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
