"use client";
import React, { useEffect, useState } from "react";
import styles from "./sight.module.css";
import { ShowSwal } from "@/utils/helper";
import swal from "sweetalert";
import { validateEmail } from "@/utils/auth";

const Sight = ({ articleID }) => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [company, setCompany] = useState("");

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

  const sendSight = async () => {
    if (!user) {
      return ShowSwal("لطفا برای ثبت دیدگاه اول لاگین کنید", "error", "فهمیدم");
    }

    if (!username.trim()) {
      return ShowSwal(
        "لطفا برای ثبت دیدگاه نام خود را وارد کنید",
        "error",
        "فهمیدم"
      );
    }

    if (!email.trim()) {
      return ShowSwal(
        "لطفا برای ثبت دیدگاه ایمیل خود را وارد کنید",
        "error",
        "فهمیدم"
      );
    }

    if (!body.trim()) {
      return ShowSwal(
        "لطفا برای ثبت دیدگاه متن دیدگاه خود را وارد کنید",
        "error",
        "فهمیدم"
      );
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return ShowSwal(
        "لطفا برای ثبت دیدگاه ایمیل معتبر وارد کنید",
        "error",
        "فهمیدم"
      );
    }

    const sight = { user: user._id, username, email, body, articleID, company };

    const res = await fetch("/api/sights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sight),
    });

    if (res.status === 201) {
      swal({
        title: "دیدگاه پس از تایید مدیریت نمایش داده می شود",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
        setUsername("");
        setCompany("");
        setEmail("");
        setBody("");
      });
    }
  };

  return (
    <div className={styles.sight}>
      <p className={styles.title}>دیدگاهتان را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span>*</span>
      </p>
      <div className={styles.group}>
        <label>
          دیدگاه <span>*</span>
        </label>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={body}
          onFocus={false}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>وب‌سایت</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label>
            ایمیل <span>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={true}
          />
        </div>
        <div className={styles.group}>
          <label>
            نام <span>*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={true}
          />
        </div>
      </div>
      <div className={styles.checkbox}>
        <input type="checkbox" />
        <p>
          {" "}
          ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی
          می‌نویسم.
        </p>
      </div>
      <button onClick={sendSight}>ارسال دیدگاه</button>
    </div>
  );
};

export default Sight;
