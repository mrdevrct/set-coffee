"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import styles from "@/styles/p-user/sendTickets.module.css";
import { ShowSwal } from "@/utils/helper";

function SendTicket() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [departmentID, setDepartmentID] = useState(-1);
  const [subDepartmentID, setSubDepartmentID] = useState(-1);
  const [priority, setPriority] = useState(-1);

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments([...data]);
    };

    getDepartments();
  }, []);

  useEffect(() => {
    const getSubDepartments = async () => {
      const res = await fetch(`/api/departments/sub/${departmentID}`);

      if (res.status === 200) {
        const data = await res.json();
        setSubDepartments([...data]);
      }
    };

    getSubDepartments();
  }, [departmentID]);

  const sendTicket = async () => {
    // validation
    if (!title.trim()) {
      return ShowSwal("عنوان تیکت نباید خالی باشد.", "error", "فهمیدم");
    }

    if (!body.trim()) {
      return ShowSwal("محتوای تیکت نباید خالی باشد.", "error", "فهمیدم");
    }

    if (departmentID === -1) {
      return ShowSwal("لطفاً دپارتمان را انتخاب نمایید.", "error", "فهمیدم");
    }

    if (subDepartmentID === -1) {
      return ShowSwal("لطفاً نوع تیکت را انتخاب نمایید.", "error", "فهمیدم");
    }

    if (priority === -1) {
      return ShowSwal(
        "لطفاً سطح اولویت تیکت را انتخاب نمایید.",
        "error",
        "فهمیدم"
      );
    }

    const ticket = {
      title,
      body,
      department: departmentID,
      subDepartment: subDepartmentID,
      priority,
    };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });

    if (res.status === 201) {
      swal({
        title: "تیکت با موفقیت ثبت شد ",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.replace("/p-user/tickets")
      });
    } else {
      ShowSwal("مشکلی در ثبت تیکت پیش امد بعدا تلاش کنید", "error", "فهمیدم");
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span>ارسال تیکت جدید</span>
        <Link href="/p-user/tickets"> همه تیکت ها</Link>
      </h1>

      <div className={styles.content}>
        <div className={styles.group}>
          <label>دپارتمان را انتخاب کنید:</label>
          <select onChange={(e) => setDepartmentID(e.target.value)}>
            <option value={-1}>لطفا دپارتمان را انتخاب نمایید.</option>
            {departments.map((department) => (
              <option value={department._id} key={department._id}>
                {department.title}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label>نوع تیکت را انتخاب کنید:</label>
          <select onChange={(e) => setSubDepartmentID(e.target.value)}>
            <option>لطفا یک مورد را انتخاب نمایید.</option>

            {subDepartments.map((subDeprt) => (
              <option value={subDeprt._id} key={subDeprt._id}>
                {subDeprt.title}{" "}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label>عنوان تیکت را وارد کنید:</label>
          <input
            placeholder="عنوان..."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label>سطح اولویت تیکت را انتخاب کنید:</label>
          <select onChange={(e) => setPriority(e.target.value)}>
            <option value={-1}>لطفا یک مورد را انتخاب نمایید.</option>
            <option value={1}>کم</option>
            <option value={2}>متوسط</option>
            <option value={3}>بالا</option>
          </select>
        </div>
      </div>
      <div className={styles.group}>
        <label>محتوای تیکت را وارد نمایید:</label>
        <textarea
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      {/* <div className={styles.uploader}>
        <span>حداکثر اندازه: 6 مگابایت</span>
        <span>فرمت‌های مجاز: jpg, png.jpeg, rar, zip</span>
        <input type="file" />
      </div> */}

      <button className={styles.btn} onClick={sendTicket}>
        <IoIosSend />
        ارسال تیکت
      </button>
    </main>
  );
}

export default SendTicket;
