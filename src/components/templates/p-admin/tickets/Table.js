"use client";
import React from "react";
import styles from "./table.module.css";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePhone } from "@/utils/auth";
import swal from "sweetalert";

export default function DataTable({ tickets, title, isBanned }) {
  // Show Ticket message
  const showTicketBody = (body) => {
    ShowSwal(body, undefined, "بستن");
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

  const answerToTicket = async (ticket) => {
    swal({
      title: "لطفا پاسخ مورد نظر را وارد کنید : ",
      content: "input",
      buttons: "ثبت پاسخ",
    }).then(async (answer) => {
      if (answer) {
        const answerTicket = {
          ...ticket,
          body: answer,
          ticketID: ticket._id,
        };

        const res = await fetch("/api/tickets/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answerTicket),
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
          ShowSwal("در ثبت پاسخ در سرور به مشکل خورد", "error", "فهمیدم");
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
              <th>عنوان</th>
              <th>دپارتمان</th>
              <th>اولویت</th>
              <th>مشاهده</th>
              <th>پاسخ</th>
              <th>بن</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td className={ticket.hasAnswer ? styles.green : styles.red}>
                  {index + 1}
                </td>
                <td>{ticket.user.name}</td>
                <td>{ticket.title}</td>
                <td>{ticket.department.title}</td>
                <td>
                  {ticket.priority === 3
                    ? "بالا"
                    : ticket.priority === 2
                    ? "متوسط"
                    : ticket.priority === 1
                    ? "پایین"
                    : null}
                </td>

                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => showTicketBody(ticket.body)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => answerToTicket(ticket)}
                  >
                    پاسخ
                  </button>
                </td>
                <td>
                  {isUserBanned(ticket.user.email, ticket.user.phone) ? (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() =>
                        unbanUser(ticket.user.email, ticket.user.phone)
                      }
                    >
                      ان بن
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.delete_btn}
                      onClick={() =>
                        banUser(ticket.user.email, ticket.user.phone)
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
