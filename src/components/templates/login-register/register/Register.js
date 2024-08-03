"use client";
import { useState } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import Sms from "./sms/Sms";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";

const Register = ({ showloginForm }) => {
  const [isRegisterWithPass, setIsRegisterWithPass] = useState(false);
  const [isRegisterWithOtp, setIsRegisterWithOtp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const hideOtpForm = () => setIsRegisterWithOtp(false);

  const checkPasswordStrength = (password) => {
    const regexWeak = /^(?=.*[a-z])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexMedium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    const regexStrong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (regexStrong.test(password)) {
      setStrength("strong");
      setPasswordMessage("رمز وارد شده قوی می باشد");
    } else if (regexMedium.test(password)) {
      setStrength("medium");
      setPasswordMessage("رمز وارد شده به اندازه کافی قوی نمی باشد");
    } else if (regexWeak.test(password)) {
      setStrength("weak");
      setPasswordMessage("رمز وارد شده ساده می باشد");
    } else {
      setStrength("");
      setPasswordMessage(
        "رمز عبور باید شامل: حروف بزرگ، کوچک، عدد، علامت (@, !, ?) باشد"
      );
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const signUp = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      return ShowSwal("لطفا فیلد ها لازم را پرکنید", "error", "فهمیدم");
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return ShowSwal("ایمیل وارد شده معتبر نمی باشد", "error", "تلاش مجدد");
      }
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "تلاش مجدد");
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return ShowSwal("رمز وارد شده معتبر نمی باشد", "error", "تلاش مجدد");
    }

    const user = { name, phone, email, password };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.status === 201) {
      swal({
        title: "ثبت نام با موفقیت انجام شد",
        icon: "success",
        buttons: "ورود",
      }).then(() => {
        location.pathname = "/";
      });
    } else if (res.status === 500) {
      ShowSwal("خطای سرور داخلی", "error", "فهمیدم");
    } else if (res.status === 422) {
      ShowSwal(
        "نام کاربری یا ایمیل یا شماره تلفن از قبل وجود دارد ",
        "error",
        "فهمیدم"
      );
    } else {
      ShowSwal("خطا سرور اتفاق افتاد لطفا بعدا تلاش کنید", "error", "فهمیدم");
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
      }).then(() => {
        setIsRegisterWithOtp(true);
      });
    } else if (res.status === 422) {
      swal({
        title: "این شماره تماس قبلا ثبت نام",
        icon: "error",
        buttons: "لاگین می کنم",
      }).then(()=>{
        showloginForm()
      })
    } else if(res.status === 429){
      ShowSwal("برای درخواست کد جدید باید 2 دقیقه منتظر بمانید" , "error" , "فهمیدم")
    }
  };

  return (
    <>
      {!isRegisterWithOtp ? (
        <>
          <div className={styles.form}>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="نام"
            />
            <input
              className={styles.input}
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="شماره موبایل  "
            />
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل (دلخواه)"
            />
            {isRegisterWithPass && (
              <>
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="رمز عبور"
                />
                <div
                  className={`${styles.strengthMeter} ${styles[strength]}`}
                />
                <div
                  className={`${styles.message} ${
                    styles[
                      `message${
                        strength.charAt(0).toUpperCase() + strength.slice(1)
                      }`
                    ]
                  }`}
                >
                  {passwordMessage}
                </div>
              </>
            )}
            <p
              style={{ marginTop: "1rem" }}
              className={styles.btn}
              onClick={sendOtp}
            >
              ثبت نام با کد تایید
            </p>
            <button
              style={{ marginTop: ".7rem" }}
              className={styles.btn}
              onClick={() => {
                if (isRegisterWithPass) {
                  signUp();
                } else {
                  setIsRegisterWithPass(true);
                }
              }}
            >
              ثبت نام با رمزعبور
            </button>
            <p className={styles.back_to_login} onClick={showloginForm}>
              برگشت به ورود
            </p>
          </div>
          <Link href="/" className={styles.redirect_to_home}>
            لغو
          </Link>
        </>
      ) : (
        <Sms hideOtpForm={hideOtpForm} phone={phone} />
      )}
    </>
  );
};

export default Register;
