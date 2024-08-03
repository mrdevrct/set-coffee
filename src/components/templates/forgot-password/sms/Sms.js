"use client";
import { useState } from "react";
import styles from "./sms.module.css";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";
import { ShowSwal } from "@/utils/helper";
import swal from "sweetalert";

const Sms = ({ hideOtpForm, identifier }) => {
  const [code, setCode] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const verifyOpt = async () => {
    const isValidPhone = validatePhone(identifier);
    const isValidEmail = validateEmail(identifier);

    if (!isValidPhone && !isValidEmail) {
      ShowSwal("شماره یا ایمیل معتبر نمی باشد", "error", "فهمیدم");
      return;
    }

    if (newPassword !== confirmPassword) {
      ShowSwal("رمز عبور و تکرار آن مطابقت ندارند", "error", "فهمیدم");
      return;
    }

    const isPasswordValid = validatePassword(newPassword);
    if (!isPasswordValid) {
      ShowSwal("رمز به اندازه کافی قوی نیست", "error", "فهمیدم");
      return;
    }

    if (isValidPhone) {
      const res = await fetch("/api/auth/sms/forget-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier, code, newPassword }),
      });

      if (res.status === 200) {
        swal({
          title: "رمز عبور با موفقیت تغییر یافت",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          location.pathname = "/login-register";
        });
      } else if (res.status === 410) {
        ShowSwal("کد منقضی شده است !", "error", "فهمیدم");
      } else if (res.status === 409) {
        ShowSwal("کد وارد شده اشتباه است", "error", "فهمیدم");
      } else if (res.status === 404) {
        ShowSwal("کاربری با این شماره یا ایمیل یافت نشد", "error", "فهمیدم");
      } else {
        ShowSwal(
          "در انجام عملیات مشکلی پیش امد بعدا تست کنید",
          "error",
          "فهمیدم"
        );
      }
    }

    if (isValidEmail) {
      const res = await fetch("/api/auth/sms/forget-password/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, code, newPassword }),
      });

      if (res.status === 200) {
        swal({
          title: "رمز عبور با موفقیت تغییر یافت",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          location.pathname = "/login-register";
        });
      } else if (res.status === 410) {
        ShowSwal("کد منقضی شده است !", "error", "فهمیدم");
      } else if (res.status === 409) {
        ShowSwal("کد وارد شده اشتباه است", "error", "فهمیدم");
      } else if (res.status === 404) {
        ShowSwal("کاربری با این شماره یا ایمیل یافت نشد", "error", "فهمیدم");
      } else {
        ShowSwal(
          "در انجام عملیات مشکلی پیش امد بعدا تست کنید",
          "error",
          "فهمیدم"
        );
      }
    }
  };

  return (
    <>
      <div className={styles.form}>
        <p>کد تایید</p>
        <span className={styles.code_title}>
          لطفاً کد تأیید ارسال شده را تایپ کنید
        </span>
        <span className={styles.number}>{identifier}</span>
        <input
          className={styles.input}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="لطفاً کد ارسال شده وارد کنید"
          autoComplete="off"
        />

        <input
          className={styles.input}
          type="password"
          placeholder="رمز عبور جدید را وارد کنید"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="off"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="تکرار رمز عبور جدید را وارد کنید"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="off"
        />
        <button
          style={{ marginTop: "1rem" }}
          className={styles.btn}
          onClick={verifyOpt}
        >
          ثبت کد تایید
        </button>
        <p className={styles.send_again_code}>ارسال مجدد کد یکبار مصرف</p>
      </div>
      <p className={styles.redirect_to_home} onClick={hideOtpForm}>
        لغو
      </p>
    </>
  );
};

export default Sms;
