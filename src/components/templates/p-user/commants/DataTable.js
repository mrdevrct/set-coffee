"use client";
import React, { useState } from "react";
import styles from "@/styles/p-user/dataTable.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ShowSwal } from "@/utils/helper";

export default function DataTable({ comments, title }) {
  const [currentAnswers, setCurrentAnswers] = useState("");

  const showCommentBody = (commentBody) => {
    ShowSwal(commentBody, undefined, "اوکی");
  };

  const showAnswerComment = (commentID) => {
    const answers = comments.filter((comment) => comment.mainComment === commentID);
    if (answers.length > 0) {
      const answerBodies = answers.map((answer) => answer.body).join("\n\n");
      setCurrentAnswers(answerBodies);
      ShowSwal(answerBodies, undefined, "اوکی");
    } else {
      ShowSwal("پاسخی برای این کامنت وجود ندارد", "warning", "اوکی");
    }
  };

  const mainComments = comments.filter((comment) => !comment.isAnswer);

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
              <th>تاریخ</th>
              <th>محصول</th>
              <th>امتیاز</th>
              <th>مشاهده</th>
              <th>وضعیت</th>
              <th>مشاهد پاسخ</th>
            </tr>
          </thead>
          <tbody>
            {mainComments.map((comment, index) => (
                <tr key={comment._id}>
                  <th>{index + 1}</th>
                  <th>{new Date(comment.date).toLocaleString("fa-IR")}</th>
                  <th>{comment.productID?.name}</th>
                  <th>
                    {new Array(comment.score).fill(0).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    {new Array(5 - comment.score).fill(0).map((_, i) => (
                      <FaRegStar key={i} />
                    ))}
                  </th>
                  <th>
                    <button
                      type="button"
                      onClick={() => showCommentBody(comment.body)}
                      className={styles.btn}
                    >
                      مشاهده
                    </button>
                  </th>
                  <th>
                    <button type="button" className={styles.no_check}>
                      {comment.isAccept ? "تایید شده" : "تایید نشده"}
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      onClick={() => showAnswerComment(comment._id)}
                      className={styles.btn}
                    >
                      مشاهد پاسخ
                    </button>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
