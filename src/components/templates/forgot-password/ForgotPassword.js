"use client";
import { useEffect, useState } from "react";
import styles from "./forgotPassword.module.css";
import Link from "next/link";
import Sms from "./sms/Sms";
import { validateEmail, validatePhone } from "@/utils/auth";
import { ShowSwal } from "@/utils/helper";
import swal from "sweetalert";

const ForgetPassword = () => {
  const [isForgotWithOtp, setIsForgotWithOtp] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const hideOtpForm = () => setIsForgotWithOtp(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsPhoneValid(validatePhone(identifier));
    setIsEmailValid(validateEmail(identifier));
  }, [identifier]);

  const handleResetPassword = async () => {
    if (!isPhoneValid && !isEmailValid) {
      ShowSwal("ایمیل یا شماره تلفن معتبر نیست", "error", "بستن");
      return;
    }

    if (isPhoneValid) {
      const res = await fetch("/api/auth/sms/forget-password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier }),
      });

      if (res.status === 201) {
        swal({
          title: "کد به شماره وارد شده ارسال شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          setIsForgotWithOtp(true);
        });
      } else if (res.status === 429) {
        ShowSwal(
          "لطفا برای درخواست کد جدید 2 دقیقه منتظر بمانید",
          "error",
          "فهمیدم"
        );
      } else if (res.status === 400) {
        ShowSwal("شماره معتبر نیست", "error", "فهمیدم");
      } else if (res.status === 404) {
        ShowSwal("چنین کاربری با این ایمیل یافت نشد", "error", "فهمیدم");
      }
    }

    if (isEmailValid) {
      const res = await fetch("/api/auth/sms/forget-password/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier }),
      });

      if (res.status === 201) {
        swal({
          title: "کد به ایمیل وارد شده ارسال شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          setIsForgotWithOtp(true);
        });
      } else if (res.status === 429) {
        ShowSwal(
          "لطفا برای درخواست کد جدید 2 دقیقه منتظر بمانید",
          "error",
          "فهمیدم"
        );
      } else if (res.status === 404) {
        ShowSwal("چنین کاربری با این ایمیل یافت نشد", "error", "فهمیدم");
      }
    }
  };

  return (
    <>
      {!isForgotWithOtp ? (
        <>
          <div className={styles.form}>
            <input
              className={styles.input}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              type="text"
              placeholder="لطفا ایمیل یا شماره خود را وارد کنید"
            />
            <p
              style={{ marginTop: "1rem" }}
              className={styles.btn}
              onClick={handleResetPassword}
            >
              بازنشانی رمزعبور
            </p>
            <Link href="/login-register" className={styles.back_to_login}>برگشت به ورود</Link>
          </div>
          <Link href="/" className={styles.redirect_to_home}>
            لغو
          </Link>
        </>
      ) : (
        <Sms hideOtpForm={hideOtpForm} identifier={identifier} />
      )}
    </>
  );
};

export default ForgetPassword;
