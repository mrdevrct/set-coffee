"use client";
import React, { useState } from "react";
import styles from "./addArticle.module.css";
import swal from "sweetalert";
import { ShowSwal } from "@/utils/helper";

function AddArticle() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [cover_image, setCover_image] = useState(null);
  const [images, setImages] = useState([]);

  const addArticle = async () => {
    if (!title.trim()) {
      ShowSwal("لطفا موضوع را وارد کنید","error","فهمیدم")
      return;
    }
    if (!author.trim()) {
      ShowSwal("لطفا نام نویسنده را وارد کنید","error","فهمیدم")
      return;
    }
    if (!body.trim()) {
      ShowSwal("لطفا توضیحات را وارد کنید","error","فهمیدم")
      return;
    }

    if (!cover_image) {
      ShowSwal("لطفا این را وارد کنید","error","فهمیدم")
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("body", body);
    formData.append("cover_image", cover_image);
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const res = await fetch("/api/articles", {
      method: "POST",
      body: formData,
    });

    if (res.status === 201) {
      swal({
        title: "مقاله مورد نظر با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.pathname = "/p-admin/articles";
      });
    }
  };

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  return (
    <section className={styles.discount}>
      <p>افزودن مقاله جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>موضوع</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="لطفا موضوع مقاله را وارد کنید"
            type="text"
          />
        </div>
        <div>
          <label>نام نویسنده مقاله</label>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="لطفا نام نویسنده مقاله را وارد کنید"
            type="text"
          />
        </div>
        <div>
          <label>توضیحات مقاله</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="توضیحات مقاله"
            type="text"
          />
        </div>
        <div>
          <label>لطفا تصویر مقاله را انتخاب کنید</label>
          <input
            type="file"
            onChange={(event) => setCover_image(event.target.files[0])}
          />
        </div>
        <div>
          <label>لطفا تصاویری که میخواهید در مقاله باشند را انتخاب کنید</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>
      </div>
      <button onClick={addArticle}>افزودن</button>
    </section>
  );
}

export default AddArticle;
