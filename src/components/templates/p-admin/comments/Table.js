"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";
import { FaRegStar, FaStar } from "react-icons/fa";
import { validateEmail, validatePhone } from "@/utils/auth";
import swal from "sweetalert";

export default function DataTable({ comments, title, isBanned }) {
  const [isAccepted, setIsAccepted] = useState({});

  const showCommentBody = (body) => {
    ShowSwal(body, undefined, "خوندم");
  };

  const acceptComment = async (commentID) => {
    swal({
      title: "ایا کامنت را تایید میکنید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/comments/accept", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID }),
        });

        if (res.status === 200) {
          swal({
            title: "کامنت کاربر با موفقیت تایید شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("چنین کامنتی وجود ندارد", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  const rejectComment = async (commentID) => {
    swal({
      title: "ایا کامنت را رد میکنید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/comments/reject", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID }),
        });

        if (res.status === 200) {
          swal({
            title: "کامنت کاربر با موفقیت رد شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("چنین کامنتی وجود ندارد", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  const editeComment = async (commentID) => {
    swal({
      title: "لطفا متن جدید را وارد کنید",
      content: "input",
      buttons: "ثبت",
    }).then(async (text) => {
      if (text) {
        const res = await fetch("/api/comments/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID, body: text }),
        });

        if (res.status === 200) {
          swal({
            title: "کامنت با موفقیت ویرایش شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("چنین کامنتی وجود ندارد", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  // is User Banned
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

  // Delete Comment
  const deleteComment = async (commentID) => {
    swal({
      title: "ایا از حذف کردن کامنت اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/comments", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID }),
        });

        if (res.status === 200) {
          swal({
            title: "کامنت با موفقیت حذف شد",
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

  // replay comment
  const ReplyToComment = async (comment) => {
    swal({
      title: "پاسخ برای کامنت را وارد کنید",
      content: "input",
      buttons: "ثبت پاسخ",
    }).then(async (text) => {
      if (text) {
        const answer = {
          ...comment,
          body: text,
          commentID: comment._id,
        };

        const res = await fetch("/api/comments/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answer),
        });

        if (res.status === 201) {
          swal({
            title: "پاسخ کامنت با موفقیت ثبت شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("در انجام عملیات در سرور مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  // show answer admin for users
  const showAnswer = async (commentID) => {
    swal({
      title:
        "ایا از نمایش پاسخ داده شده به دیگران اطمینان دارید زیرا  پس تایید غیر قابل رد میشود",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/comments/answer/accept", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID }),
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت تایید شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            setIsAccepted({ commentID });
            location.reload();
          });
        } else if (res.status === 401) {
          ShowSwal("هنوز به این کامنت پاسخی ندادید", "error", "فهمیدم");
        } else if (res.status === 403) {
          ShowSwal("پاسخ از قبل تایید شده است", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  const rejectAnswer = async (commentID) => {
    swal({
      title: "ایا از رد پاسخ داده شده به دیگران اطمینان دارید ",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/comments/answer/reject", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentID }),
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت رد شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            setIsAccepted({ commentID });
            location.reload();
          });
        } else if (res.status === 401) {
          ShowSwal("هنوز به این کامنت پاسخی ندادید", "error", "فهمیدم");
        } else if (res.status === 403) {
          ShowSwal("پاسخ از قبل رد شده است", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
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
              <th>کاربر</th>
              <th>ایمیل</th>
              <th>امتیاز</th>
              <th>محصول</th>
              <th>تاریخ ثبت</th>
              <th>مشاهده</th>
              <th>ویرایش</th>
              <th>حذف</th>
              <th>تایید</th>
              <th>پاسخ</th>
              <th>نمایش پاسخ برای دیگران</th>
              <th>بن</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={comment._id}>
                <td
                  className={
                    comment.isAccept
                      ? styles.accept_comment
                      : styles.reject_comment
                  }
                >
                  {index + 1}
                </td>
                <td>{comment.username}</td>
                <td>{comment.email}</td>
                <td>
                  {new Array(comment.score).fill(0).map((_, index) => (
                    <FaStar key={index} />
                  ))}
                  {new Array(5 - comment.score).fill(0).map((_, index) => (
                    <FaRegStar key={index} />
                  ))}
                </td>
                <td>{comment.productID?.name}</td>
                <td>{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => showCommentBody(comment.body)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => editeComment(comment._id)}
                  >
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => deleteComment(comment._id)}
                  >
                    حذف
                  </button>
                </td>
                <td>
                  {comment.isAccept ? (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() => rejectComment(comment._id)}
                    >
                      رد
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() => acceptComment(comment._id)}
                    >
                      تایید
                    </button>
                  )}
                </td>
                <td>
                  {comment.hasAnswer ? (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      style={{ fontSize: "10px" }}
                    >
                      پاسخ داده شد
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() => ReplyToComment(comment)}
                    >
                      پاسخ
                    </button>
                  )}
                </td>
                <td className={styles.buttonContainer}>
                  <button
                    className={styles.delete_btn}
                    style={{ marginTop: "16px" }}
                    onClick={() => showAnswer(comment._id)}
                  >
                    تایید
                  </button>
                  <button
                    className={styles.delete_btn}
                    style={{ marginTop: "16px" }}
                    onClick={() => rejectAnswer(comment._id)}
                  >
                    رد
                  </button>
                </td>
                <td>
                  {isUserBanned(comment.userID.email, comment.userID.phone) ? (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() =>
                        unbanUser(comment.userID.email, comment.userID.phone)
                      }
                    >
                      ان بن
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() =>
                        banUser(comment.userID.email, comment.userID.phone)
                      }
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
    </div>
  );
}
