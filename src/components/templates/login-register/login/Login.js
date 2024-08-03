"use client";
import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Sms from "./sms/Sms";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";

const Login = ({ showRegisterForm }) => {
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const hideOtpForm = () => setIsLoginWithOtp(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  useEffect(() => {
    setIsPhoneValid(validatePhone(identifier));
  }, [identifier]);

  const signIn = async () => {
    if (!identifier.trim()) {
      return ShowSwal("لطفا شماره یا ایمیل خود را وارد کنید", "error", "بستن");
    }

    if (!password.trim()) {
      return ShowSwal("لطفا رمز عبور خود را وارد کنید", "error", "بستن");
    }

    const isValidEmail = validateEmail(identifier);
    const isValidPhone = validatePhone(identifier);

    if (!isValidEmail && !isValidPhone) {
      return ShowSwal(
        "ایمیل یا شماره تلفن وارد شده صحیح نمی باشد",
        "error",
        "بستن"
      );
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return ShowSwal(
        "پسورد وارد شده به اندازه کافی قوی نمی باشد",
        "error",
        "فهمیدم"
      );
    }

    const user = { identifier, password };

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.status === 200) {
      swal({
        title: "شما با موفقیت وارد شدید",
        icon: "success",
        buttons: "ورود",
      }).then(() => {
        location.pathname = "/";
      });
    } else if (res.status === 422) {
      ShowSwal("کاربر با این اطلاعات یافت نشد", "error", "فهمیدم");
    } else if (res.status === 401) {
      ShowSwal("ایمیل یا پسورد درست نمی باشد", "error", "فهمیدم");
    } else if (res.status === 419) {
      ShowSwal("ایمیل یا پسورد درست نمی باشد", "error", "فهمیدم");
    } else if (res.status === 403) {
      ShowSwal("این کاربر از سایت بن شده است", "error", "فهمیدم");
    } else {
      ShowSwal("خطا سرور اتفاق افتاد لطفا بعدا تلاش کنید", "error", "فهمیدم");
    }
  };

  const sendOtp = async () => {
    const isValidPhone = validatePhone(identifier);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "تلاش مجدد");
    }

    const res = await fetch("/api/auth/sms/login/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone : identifier }),
    });

    if (res.status === 201) {
      swal({
        title: "کد با موفقیت ارسال شد",
        icon: "success",
        buttons: "وارد کردن کد",
      }).then(() => {
        setIsRegisterWithOtp(true);
      });
    } else if (res.status === 422) {
      swal({
        title: "این شماره در سایت ثبت نام نکرده است",
        icon: "error",
        buttons: "لاگین می کنم",
      }).then(()=>{
        showRegisterForm()
      })
    } else if(res.status === 429){
      ShowSwal("برای درخواست کد جدید باید 2 دقیقه منتظر بمانید" , "error" , "فهمیدم")
    }
  };

  return (
    <>
      {!isLoginWithOtp ? (
        <>
          <div className={styles.form}>
            <input
              className={styles.input}
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ایمیل/شماره موبایل"
            />
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
            />
            <div className={styles.checkbox}>
              <input type="checkbox" name="" id="" />
              <p>مرا به یاد داشته باش</p>
            </div>
            <button className={styles.btn} onClick={signIn}>
              ورود
            </button>
            <Link href="/forget-password" className={styles.forgot_pass}>
              رمز عبور را فراموش کرده اید؟
            </Link>
            <button
              className={styles.btn}
              onClick={() => {
                if (isPhoneValid) {
                  setIsLoginWithOtp(true);
                  sendOtp()
                } else {
                  ShowSwal("شماره تلفن معتبر نیست", "error", "بستن");
                }
              }}
            >
              ورود با کد یکبار مصرف
            </button>
            <span>ایا حساب کاربری ندارید؟</span>
            <button className={styles.btn_light} onClick={showRegisterForm}>
              ثبت نام
            </button>
          </div>
          <Link href="/" className={styles.redirect_to_home}>
            لغو
          </Link>
        </>
      ) : (
        <Sms hideOtpForm={hideOtpForm} phone={identifier} />
      )}
    </>
  );
};

export default Login;
