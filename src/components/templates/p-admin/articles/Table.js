"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import Link from "next/link";
import swal from "sweetalert";

export default function DataTable({ articles, header }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [cover_image, setCover_image] = useState(null);
  const [images, setImages] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState("");

  const removedArticle = async (articleId) => {
    swal({
      title: "آیا از حذف مقاله اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/articles", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        });

        if (res.status === 200) {
          swal({
            title: "مقاله با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        }
      }
    });
  };

  const closeDetails = () => {
    setSelectedArticle(null);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (article) => {
    setCurrentArticleId(article._id);
    setTitle(article.title);
    setAuthor(article.author);
    setBody(article.body);
    setCover_image(article.cover_image);
    setImages(article.images);

    setIsModalOpen(true);
  };

  const uploadImagesArticle = (event) => {
    setImages([...event.target.files]);
  };

  const updatedArticle = async () => {
    const formData = new FormData();
    formData.append("id", currentArticleId);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("body", body);
    if (cover_image instanceof File) {
      formData.append("cover_image", cover_image);
    } else {
      formData.append("cover_image_url", cover_image);
    }
    images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images`, image);
      } else {
        formData.append(`existing_images`, image);
      }
    });

    const res = await fetch("/api/articles", {
      method: "PUT",
      body: formData,
    });

    if (res.status === 200) {
      swal({
        title: "مقاله مورد نظر با موفقیت ویرایش شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.pathname = "/p-admin/articles";
      });
    }
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{header}</span>
          <Link href="/p-admin/articles/add-article">ایجاد مقاله جدید</Link>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نویسنده</th>
              <th>موضوع</th>
              <th>مشاهده</th>
              <th>ویرایش</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr key={article._id}>
                <td>{index + 1}</td>
                <td>{article.author}</td>
                <td>{article.title}</td>
                <td>
                  <button
                    className={styles.edit_btn}
                    onClick={() => setSelectedArticle(article)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button
                    className={styles.edit_btn}
                    onClick={() => openEditModal(article)}
                  >
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    className={styles.delete_btn}
                    onClick={() => removedArticle(article._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedArticle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h2>جزئیات مقاله</h2>
              <img
                src={selectedArticle.cover_image}
                className={styles.selectedArticle_img}
                alt="cover"
              />
              <div>
                {selectedArticle.images.map((image, i) => (
                  <img
                    src={image}
                    key={i}
                    className={styles.selectedArticle_images}
                  />
                ))}
              </div>
              <p>
                <strong>موضوع:</strong> {selectedArticle.title}
              </p>
              <p>
                <strong>نویسنده:</strong> {selectedArticle.author}
              </p>
              <p>
                <strong>توضیحات:</strong> {selectedArticle.body}
              </p>
              <button
                type="button"
                className={styles.delete_btn}
                onClick={closeDetails}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h2>ویرایش مقاله</h2>
              <div className="image-container">
                <img
                  src={cover_image}
                  alt=""
                  className={styles.selectedArticle_img}
                />
                <div className="image-overlay">
                  <span>برای انتخاب عکس جدید کلیک کنید</span>

                  <input
                    className="file-input"
                    type="file"
                    onChange={(e) => setCover_image(e.target.files[0])}
                  />
                </div>
              </div>
              <div>
                <label>
                  <p>موضوع:</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label>
                  <p>نویسنده:</p>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </label>
                <label>
                  <p> توضیحات:</p>
                  <textarea
                    type="text"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
              </div>
              <div style={{ display: "flex" }}>
                {images.map((image, i) => (
                  <img src={image} className={styles.order_images} key={i} />
                ))}
              </div>
              <div>
                <input type="file" multiple onChange={uploadImagesArticle} />
              </div>
              <div className={styles.modal_buttons}>
                <button type="button" onClick={updatedArticle}>
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
