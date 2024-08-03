"use client";
import { useState } from "react";
import styles from "./sms.module.css";
import { ShowSwal } from "@/utils/helper";
import { validatePhone } from "@/utils/auth";
import swal from 'sweetalert'

const Sms = ({ hideOtpForm, phone }) => {
  const [code, setCode] = useState();

  const verifyCode = async () => {
    if (!code.trim()) {
      return ShowSwal("لطفا کد را وارد کنید", "error", "فهمیدم");
    }

    const body = { phone, code };

    const res = await fetch("/api/auth/sms/register/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      swal({
        title: "با موفقیت ثبت نام شدید",
        icon: "success",
        buttons: "ورود",
      }).then(() => {
        location.pathname = "/";
      });
    } else if (res.status === 409) {
      return ShowSwal("کد وارد شده معتبر نیست", "error", "فهمیدم");
    } else if (res.status === 410) {
      return ShowSwal("کد وارد شده منقضی شده", "error", "فهمیدم");
    }
  };

  const sendOtp = async () => {
    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "تلاش مجدد");
    }

    const res = await fetch("/api/auth/sms/register/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (res.status === 201) {
      swal({
        title: "کد با موفقیت ارسال شد",
        icon: "success",
        buttons: "وارد کردن کد",
      });
    } else if (res.status === 422) {
      swal({
        title: "این شماره تماس قبلا ثبت نام",
        icon: "error",
        buttons: "لاگین می کنم",
      }).then(() => {
        showloginForm();
      });
    } else if (res.status === 429) {
      ShowSwal(
        "برای درخواست کد جدید باید 2 دقیقه منتظر بمانید",
        "error",
        "فهمیدم"
      );
    }
  };

  return (
    <>
      <div className={styles.form}>
        <p>کد تایید</p>
        <span className={styles.code_title}>
          لطفاً کد تأیید ارسال شده را تایپ کنید
        </span>
        <span className={styles.number}>{phone}</span>
        <input
          className={styles.input}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          style={{ marginTop: "1rem" }}
          className={styles.btn}
          onClick={verifyCode}
        >
          ثبت کد تایید
        </button>
        <p className={styles.send_again_code} onClick={sendOtp}>
          ارسال مجدد کد یکبار مصرف
        </p>
      </div>
      <p className={styles.redirect_to_home} onClick={hideOtpForm}>
        لغو
      </p>
    </>
  );
};

export default Sms;
