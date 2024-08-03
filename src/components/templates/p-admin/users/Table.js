"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";

export default function DataTable({ users, title, isBanned }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Change Role User
  const changeRole = async (userID) => {
    const res = await fetch("/api/user/role", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userID }),
    });

    if (res.status === 200) {
      swal({
        title: "نقش کاربر با موفقیت تغییر یافت",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.reload();
      });
    } else if (res.status === 404) {
      ShowSwal("کاربری با این شناسه یافت نشد", "error", "فهمیدم");
    } else if (res.status === 401) {
      ShowSwal("شناسه کاربر نامعتبر می باشد", "error", "فهمیدم");
    } else {
      ShowSwal(
        "در انجام عملیات مشکلی پیش امد بعدا تلاش کنید",
        "error",
        "فهمیدم"
      );
    }
  };

  // delete User
  const removeUser = async (userID) => {
    swal({
      title: "ایا از حذف کاربر اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userID }),
        });

        if (res.status === 200) {
          swal({
            title: "کاربر با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("کاربری با این شناسه یافت نشد", "error", "فهمیدم");
        } else if (res.status === 401) {
          ShowSwal("شناسه کاربر نامعتبر می باشد", "error", "فهمیدم");
        } else {
          ShowSwal(
            "در انجام عملیات مشکلی پیش امد بعدا تلاش کنید",
            "error",
            "فهمیدم"
          );
        }
      }
    });
  };

  // Is User Banned
  const isUserBanned = (email, phone) => {
    return isBanned.some((ban) => ban.email === email || ban.phone === phone);
  };

  // Ban User
  const banUser = async (email, phone) => {
    if (!email && !phone) {
      return ShowSwal("ایمیل یا شماره تلفن الزامی است", "error", "فهمیدم");
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return ShowSwal("ایمیل کاربر نامعتبر است", "error", "فهمیدم");
      }
    }

    if (phone) {
      const isValidPhone = validatePhone(phone);
      if (!isValidPhone) {
        return ShowSwal("شماره کاربر نامعتبر است", "error", "فهمیدم");
      }
    }

    swal({
      title: "ایا از بن کردن کاربر اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/user/Ban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });

        if (res.status === 201) {
          swal({
            title: "کاربر با موفقیت بن شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("کاربری با این ایمیل یا شماره یافت نشد", "error", "فهمیدم");
        } else if (res.status === 401) {
          ShowSwal("ایمیل یا شماره کاربر نامعتبر می باشد", "error", "فهمیدم");
        } else if (res.status === 422) {
          ShowSwal("این کاربر قبلا بن شده است", "error", "فهمیدم");
        } else {
          ShowSwal(
            "در انجام عملیات مشکلی پیش امد بعدا تلاش کنید",
            "error",
            "فهمیدم"
          );
        }
      }
    });
  };

  // UnBan User
  const unbanUser = async (email, phone) => {
    swal({
      title: "ایا از ان بن کردن کاربر اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/user/Ban/Unban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });

        if (res.status === 200) {
          swal({
            title: "کاربر با موفقیت ان بن شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal(
            "در انجام عملیات مشکلی پیش امد بعدا تلاش کنید",
            "error",
            "فهمیدم"
          );
        }
      }
    });
  };

  // Open Editor User
  const openEditModal = (user) => {
    setCurrentUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setPhone(user.phone || "");
    setIsModalOpen(true);
  };

  // Close Editor User
  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  // Edite User Data
  const handleEditUser = async () => {
    if (!name) {
      return ShowSwal("لطفا نام را وارد کنید", "error", "فهمیدم");
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return ShowSwal("ایمیل وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return ShowSwal("شماره وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    if (password) {
      const isValidPassword = validatePassword(password);
      if (!isValidPassword) {
        return ShowSwal("رمز وارد شده معتبر نمی باشد", "error", "فهمیدم");
      }
    }

    const res = await fetch("/api/user/edite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentUserId, name, email, phone, password }),
    });

    if (res.status === 200) {
      swal({
        title: "اطلاعات کاربر با موفقیت ویرایش شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        closeEditModal();
        location.reload();
      });
    }
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام و نام خانوادگی</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>ویرایش</th>
              <th>تغییر سطح</th>
              <th>حذف</th>
              <th>بن/ان بن</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email ? user.email : "ایمیلی یافت نشد"}</td>
                <td>{user.role === "USER" ? "کاربر عادی" : "ادمین"}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => openEditModal(user)}
                  >
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => changeRole(user._id)}
                  >
                    تغییر نقش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => removeUser(user._id)}
                  >
                    حذف
                  </button>
                </td>
                <td>
                  {isUserBanned(user.email, user.phone) ? (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() => unbanUser(user.email, user.phone)}
                    >
                      ان بن
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() => banUser(user.email, user.phone)}
                    >
                      بن
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h2>ویرایش کاربر</h2>
              <label>
                نام:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                ایمیل:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                رمز عبور:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                تلفن:
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <div className={styles.modal_buttons}>
                <button type="button" onClick={handleEditUser}>
                  ذخیره
                </button>
                <button type="button" onClick={closeEditModal}>
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
