"use client";
import { useState } from "react";
import styles from "./form.module.css";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePhone } from "@/utils/auth";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const submitMessage = async (e) => {
    e.preventDefault();

    // validation
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      return ShowSwal("لطفا تمامی فیلد ها مهم را پر کنید ", "error", "قهمیدم");
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return ShowSwal("ایمیل وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    const contact = { name, email, phone, company, message };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Contact-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (res.status === 201) {
      ShowSwal("پیام شما با موفقیت ثبت شد", "success", "فهمیدم");
      setName();
      setEmail();
      setPhone();
      setCompany();
      setMessage();
    } else if (res.status === 500) {
      ShowSwal("خطای سرور لطفا بعدا تلاش کنید", "error", "فهمیدم");
    }
  };

  return (
    <form className={styles.form}>
      <span>فرم تماس با ما</span>
      <p>برای تماس با ما می توانید فرم زیر را تکمیل کنید</p>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>نام و نام خانوادگی</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label>آدرس ایمیل</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>شماره تماس</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label>(اختیاری) نام شرکت</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.group}>
        <label>درخواست شما</label>
        <textarea
          name=""
          id=""
          cols="30"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <button onClick={submitMessage}>ارسال</button>
    </form>
  );
};

export default Form;
