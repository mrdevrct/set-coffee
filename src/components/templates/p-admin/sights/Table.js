"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";
import swal from "sweetalert";

export default function DataTable({ sights, header }) {
  const showSightBody = (sightBody) => {
    ShowSwal(sightBody, undefined, "اوکی");
  };

  const removedSight = async (sightID) => {
    swal({
      title: "ایا از حذف دیدگاه اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/sights", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sightID }),
        });

        if (res.status === 200) {
          swal({
            title: "دیدگاه با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("خطا در حذف دیدگاه", "error", "فهمیدم");
        }
      }
    });
  };

  const rejectSight = async (sightID) => {
    swal({
      title: "ایا از رد دیدگاه اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/sights/reject", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sightID }),
        });

        if (res.status === 200) {
          swal({
            title: "دیدگاه با موفقیت رد شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("خطا در تغییر وضعیت دیدگاه", "error", "فهمیدم");
        }
      }
    });
  };

  const acceptSight = async (sightID) => {
    swal({
      title: "ایا از تایید دیدگاه اطمینان دارید",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/sights/accept", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sightID }),
        });

        if (res.status === 200) {
          swal({
            title: "دیدگاه با موفقیت تایید شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("خطا در تغییر وضعیت دیدگاه", "error", "فهمیدم");
        }
      }
    });
  };

  const answerSight = async (sight) => {
    swal({
      title: "پاسخ برای دیدگاه وارد کنید",
      content: "input",
      buttons: "ثبت پاسخ",
    }).then(async (text) => {
      if (text) {
        const answer = {
          ...sight,
          sightID: sight._id,
          body: text,
          articleID: sight.articleID._id,
        };

        const res = await fetch("/api/sights/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answer),
        });

        if (res.status === 201) {
          swal({
            title: "پاسخ با موفقیت ثبت شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else {
          ShowSwal("در ثبت پاسخ مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  const showAnswerSight = async (sightID) => {
    swal({
      title:
        "ایا از نمایش پاسخ داده شده به دیگران اطمینان دارید ",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/sights/answer/accept", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sightID }),
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت تایید شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 401) {
          ShowSwal("هنوز به این دیدگاه پاسخی ندادید", "error", "فهمیدم");
        } else if (res.status === 403) {
          ShowSwal("نمایش پاسخ برای دیگران قبلا تایید شده", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش امد", "error", "فهمیدم");
        }
      }
    });
  };

  const rejectAnswerSight = async (sightID) => {
    swal({
      title:
        "ایا از رد نمایش پاسخ داده شده به دیگران اطمینان دارید ",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (resulte) => {
      if (resulte) {
        const res = await fetch("/api/sights/answer/reject", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sightID }),
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت رد شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 401) {
          ShowSwal("هنوز به این دیدگاه پاسخی ندادید", "error", "فهمیدم");
        } else if (res.status === 403) {
          ShowSwal("نمایش پاسخ برای دیگران قبلا رد شده", "error", "فهمیدم");
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
          <span>{header}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>کاربر</th>
              <th>ایمیل</th>
              <th>مقاله</th>
              <th>تاریخ ثبت</th>
              <th>مشاهده</th>
              <th> تایید / رد</th>
              <th>پاسخ دادن</th>
              <th>نمایش پاسخ برای دیگران</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {sights.map((sight, index) => (
              <tr key={sight._id}>
                <td>{index + 1}</td>
                <td>{sight.username}</td>
                <td>{sight.email}</td>
                <td>{sight.articleID?.title}</td>
                <td>{new Date(sight.createdAt).toLocaleDateString("fa-IR")}</td>
                <td>
                  <button
                    className={styles.edit_btn}
                    onClick={() => showSightBody(sight.body)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  {sight.isAccept ? (
                    <button
                      className={styles.delete_btn}
                      onClick={() => rejectSight(sight._id)}
                    >
                      رد
                    </button>
                  ) : (
                    <button
                      className={styles.delete_btn}
                      onClick={() => acceptSight(sight._id)}
                    >
                      تایید
                    </button>
                  )}
                </td>
                <td>
                  {sight.hasAnswer ? (
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
                      onClick={() => answerSight(sight)}
                    >
                      پاسخ
                    </button>
                  )}
                </td>
                <td className={styles.buttonContainer}>
                  <button
                    className={styles.delete_btn}
                    onClick={() => showAnswerSight(sight._id)}
                  >
                    تایید
                  </button>
                  <button
                    className={styles.delete_btn}
                    onClick={() => rejectAnswerSight(sight._id)}
                  >
                    رد
                  </button>
                </td>

                <td>
                  <button
                    className={styles.delete_btn}
                    onClick={() => removedSight(sight._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
