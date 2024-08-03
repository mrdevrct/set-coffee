"use client";
import React, { useState } from "react";
import styles from "@/styles/p-user/dataTable.module.css";
import { ShowSwal } from "@/utils/helper";

export default function DataTable({ sights, header }) {
  const [currentAnswers, setCurrentAnswers] = useState("");

  const showSightBody = (sightBody) => {
    ShowSwal(sightBody, undefined, "اوکی");
  };

  const showAnswerSight = (sightID) => {
    const answers = sights.filter((sight) => sight.mainSight === sightID);
    if (answers.length > 0) {
      const answerBodies = answers.map((answer) => answer.body).join("\n\n");
      setCurrentAnswers(answerBodies);
      ShowSwal(answerBodies, undefined, "اوکی");
    } else {
      ShowSwal("پاسخی برای این دیدگاه‌ وجود ندارد", "warning", "اوکی");
    }
  };

  // فیلتر کردن دیدگاه‌ها تا تنها دیدگاه‌های اصلی نمایش داده شوند
  const mainSights = sights.filter((sight) => !sight.isAnswer);

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
              <th>نام کاربر</th>
              <th>مقاله</th>
              <th>شرکت</th>
              <th>تاریخ</th>
              <th>مشاهده</th>
              <th>وضعیت</th>
              <th>مشاهد پاسخ</th>
            </tr>
          </thead>
          <tbody>
            {mainSights.map((sight, index) => (
              <tr key={sight._id}>
                <td>{index + 1}</td>
                <td>{sight.username}</td>
                <th>{sight.articleID?.title}</th>
                <td>{sight.company ? sight.company : "وجود ندارد"}</td>
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
                  <button className={styles.edit_btn}>
                    {sight.hasAnswer ? "پاسخ داده شده" : "پاسخ داده نشده"}
                  </button>
                </td>

                <td>
                  <button
                    className={styles.delete_btn}
                    onClick={() => showAnswerSight(sight._id)}
                  >
                    مشاهد پاسخ
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
