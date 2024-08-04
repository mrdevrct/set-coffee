"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/p-user/accountDetails.module.css";
import swal from "sweetalert";
import { IoCloudUploadOutline } from "react-icons/io5";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";
import { ShowSwal } from "@/utils/helper";

function AccountDetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setImg(data.img);
    };
    getUser();
  }, []);

  const updateUser = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return ShowSwal("لطفا فیلد ها را خالی نگذارید", "error", "فهمیدم");
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return ShowSwal("ایمیل وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    const userNewInfo = { name, email, phone };

    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userNewInfo),
    });

    if (res.status === 200) {
      swal({
        title: "اطلاعات با موفقیت اپدیت شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(async () => {
        await fetch("/api/auth/signout", { method: "POST" });
        location.replace("/login-register");
      });
    }
  };

  const updatePassword = async () => {
    if (!password.trim()) {
      return ShowSwal("لطفا فیلد ها را خالی نگذارید", "error", "فهمیدم");
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return ShowSwal(
        "رمز عبور جدید وارد شده معتبر نمی باشد",
        "error",
        "فهمیدم"
      );
    }

    swal({
      title: "ایا از تغییر رمز عبور اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/user/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (res.status === 200) {
          swal({
            title: "رمز عبور با موفقیت تغییر کرد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(()=>{
            location.reload()
          })
        } else {
          swal({
            title: "خطا در تغییر رمز عبور",
            icon: "error",
            buttons: "فهمیدم",
          });
        }
      }
    });
  };

  const uploadImgUser = async () => {
    if (!img) {
      return ShowSwal("لطفا عکس را انتخاب کنید", "error", "فهمیدم");
    }

    const formData = new FormData();
    formData.append("img", img);

    const res = await fetch("/api/user/upload-images", {
      method: "PUT",
      body: formData,
    });

    if (res.status === 200) {
      swal({
        title: "عکس کاربر با موفقیت تغییر پیدا کرد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
      });
    } else {
      ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
    }
  };

  return (
    <main>
      <div className={styles.details}>
        <h1 className={styles.title}>
          <span> جزئیات اکانت</span>
        </h1>
        <div className={styles.details_main}>
          <section>
            <div>
              <label>نام کاربری</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="لطفا نام کاربری خود را وارد کنید"
                type="text"
              />
            </div>
            <div>
              <label>ایمیل</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="لطفا ایمیل خود را وارد کنید"
                type="text"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>
            <div>
              <label>شماره تماس</label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="لطفا شماره تماس خود را وارد کنید"
                type="number"
              />
            </div>
          </section>
          <section>
            <div className={styles.uploader}>
              <img src={img || "/images/user-icon.png"} alt="" />
              <div>
                <div>
                  <button>
                    <IoCloudUploadOutline />
                    انتخاب تصویر
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImg(event.target.files[0])}
                  />
                </div>
                <button onClick={uploadImgUser}>ثبت تصویر</button>
              </div>
            </div>
            <div>
              <label> رمز عبور جدید</label>
              <div className={styles.password_group}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={updatePassword}>تغییر رمز عبور</button>
              </div>
            </div>
          </section>
        </div>
        <button
          type="submit"
          onClick={updateUser}
          className={styles.submit_btn}
        >
          ثبت تغییرات
        </button>
      </div>
    </main>
  );
}

export default AccountDetails;
