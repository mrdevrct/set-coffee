"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";

function AddDiscount() {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [maxUse, setMaxUse] = useState("");

  const addDiscount = async () => {
    if (!code) {
      return ShowSwal("لطفا شناسه تخفیف را وارد کنید", "error", "فهمیدم");
    }

    if (typeof code !== "string") {
      return ShowSwal("شناسه تخفیف باید یک رشته باشد", "error", "فهمیدم");
    }

    if (!percent) {
      return ShowSwal("لطفا درصد تخفیف را وارد کنید", "error", "فهمیدم");
    }

    if (isNaN(percent)) {
      return ShowSwal("درصد تخفیف باید یک عدد باشد", "error", "فهمیدم");
    }

    if (!maxUse) {
      return ShowSwal("لطفا حداکثر استفاده را وارد کنید", "error", "فهمیدم");
    }

    if (isNaN(maxUse)) {
      return ShowSwal("حداکثر استفاده باید یک عدد باشد", "error", "فهمیدم");
    }

    const discount = { code, percent: Number(percent), maxUse: Number(maxUse) };

    const res = await fetch("/api/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discount),
    });

    if (res.status === 201) {
      swal({
        title: "کد تخفیف با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
      });
    } else {
      ShowSwal("در ایجاد کد تخفیف اشکالی به وجود آمد", "error", "فهمیدم");
    }
  };

  return (
    <section className={styles.discount}>
      <p>افزودن کد تخفیف جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>شناسه تخفیف</label>
          <input
            placeholder="لطفا شناسه تخفیف را وارد کنید"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <label>درصد تخفیف</label>
          <input
            placeholder="لطفا درصد تخفیف را وارد کنید"
            type="number"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </div>
        <div>
          <label>حداکثر استفاده</label>
          <input
            placeholder="حداکثر استفاده از کد تخفیف"
            type="number"
            value={maxUse}
            onChange={(e) => setMaxUse(e.target.value)}
          />
        </div>
      </div>
      <button onClick={addDiscount}>افزودن</button>
    </section>
  );
}

export default AddDiscount;
