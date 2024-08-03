"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ShowSwal } from "@/utils/helper";
import swal from "sweetalert";
import Link from "next/link";

export default function DataTable({ products, title }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [suitableFor, setSuitableFor] = useState("");
  const [smell, setSmell] = useState("");
  const [inventory, setInventory] = useState("");
  const [tags, setTags] = useState("");
  const [img, setImg] = useState(null);

  const removedProduct = async (productID) => {
    if (!productID) {
      return ShowSwal("شناسه محصول خالی است", "error", "فهمیدم");
    }

    swal({
      title: "آیا از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then(async (result) => {
      if (result) {
        const formData = new FormData();
        formData.append("id", productID);

        const res = await fetch("/api/products", {
          method: "DELETE",
          body: formData,
        });

        if (res.status === 200) {
          swal({
            title: "محصول با موفقیت حذف شد",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.reload();
          });
        } else if (res.status === 404) {
          ShowSwal("محصولی با این شناسه یافت نشد", "error", "فهمیدم");
        } else if (res.status === 400) {
          ShowSwal("شناسه محصول نامعتبر است", "error", "فهمیدم");
        } else {
          ShowSwal("در انجام عملیات مشکلی پیش آمد", "error", "فهمیدم");
        }
      }
    });
  };

  const closeDetails = () => {
    setSelectedProduct(null);
  };

  const openEditModal = (product) => {
    setCurrentProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setWeight(product.weight);
    setShortDesc(product.shortDesc);
    setLongDesc(product.longDesc);
    setSuitableFor(product.suitableFor);
    setSmell(product.smell);
    setInventory(product.inventory);
    setTags(product.tags.join(", "));
    setImg(product.img);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleEditUser = async () => {
    if (!name.trim()) {
      ShowSwal("فیلد نام ضروری است!", "error", "فهمیدم");
      return;
    }

    if (!price) {
      ShowSwal("فیلد قیمت ضروری است!", "error", "فهمیدم");
      return;
    } else if (isNaN(price)) {
      ShowSwal("فیلد قیمت باید عدد باشد!", "error", "فهمیدم");
      return;
    }

    if (!shortDesc.trim()) {
      ShowSwal("فیلد توضیحات کوتاه ضروری است!", "error", "فهمیدم");
      return;
    }

    if (!longDesc.trim()) {
      ShowSwal("فیلد توضیحات بلند ضروری است!", "error", "فهمیدم");
      return;
    }

    if (!weight) {
      ShowSwal("فیلد وزن ضروری است!", "error", "فهمیدم");
      return;
    } else if (isNaN(weight)) {
      ShowSwal("فیلد وزن باید عدد باشد!", "error", "فهمیدم");
      return;
    }

    if (!suitableFor.trim()) {
      ShowSwal("فیلد مناسب برای ضروری است!", "error", "فهمیدم");
      return;
    }

    if (!smell.trim()) {
      ShowSwal("فیلد بو ضروری است!", "error", "فهمیدم");
      return;
    }

    if (!inventory) {
      ShowSwal("فیلد موجودی ضروری است!", "error", "فهمیدم");
      return;
    } else if (isNaN(inventory)) {
      ShowSwal("فیلد موجودی باید عدد باشد!", "error", "فهمیدم");
      return;
    }

    if (!tags.trim()) {
      ShowSwal("فیلد برچسب‌ها ضروری است!", "error", "فهمیدم");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentProductId);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("weight", weight);
    formData.append("shortDesc", shortDesc);
    formData.append("longDesc", longDesc);
    formData.append("suitableFor", suitableFor);
    formData.append("smell", smell);
    formData.append("img", img);
    formData.append("inventory", inventory);
    formData.append(
      "tags",
      tags.split(",").map((tag) => tag.trim())
    );

    const res = await fetch("/api/products", {
      method: "PUT",
      body: formData,
    });

    if (res.status === 200) {
      swal({
        title: "اطلاعات با موفقیت ویرایش شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        closeEditModal();
        location.reload();
      });
    } else if (res.status === 404) {
      ShowSwal("محصولی با این شناسه یافت نشد", "error", "فهمیدم");
    } else if (res.status === 401) {
      ShowSwal("شناسه محصول نامعتبر است", "error", "فهمیدم");
    } else {
      ShowSwal("در انجام عملیات مشکلی پیش آمد!", "error", "فهمیدم");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file); // Save the file directly
    }
  };
  

  return (
    <div>
      <h1 className={styles.title}>
        <span>{title}</span>
        <Link href="/p-admin/products/add-product">ایجاد محصول جدید</Link>
      </h1>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام محصول</th>
              <th>قیمت محصول</th>
              <th>امتیاز</th>
              <th>مشاهده جزئیات</th>
              <th>ویرایش</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString("fa-IR")}</td>
                <td>
                  {new Array(product.score).fill(0).map((_, index) => (
                    <FaStar key={index} />
                  ))}
                  {new Array(5 - product.score).fill(0).map((_, index) => (
                    <FaRegStar key={index} />
                  ))}
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => setSelectedProduct(product)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={(e) => openEditModal(product)}
                  >
                    ویرایش
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete_btn}
                    onClick={() => removedProduct(product._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h2>جزئیات محصول</h2>
              <img
                src={selectedProduct.img}
                className={styles.selectedProduct_img}
              />
              <p>
                <strong>نام:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>قیمت:</strong>{" "}
                {selectedProduct.price.toLocaleString("fa-IR")}
              </p>
              <p>
                <strong>توضیح کوتاه:</strong> {selectedProduct.shortDesc}
              </p>
              <p>
                <strong>توضیح بلند:</strong> {selectedProduct.longDesc}
              </p>
              <p>
                <strong>وزن:</strong> {selectedProduct.weight}
              </p>
              <p>
                <strong>مناسب برای:</strong> {selectedProduct.suitableFor}
              </p>
              <p>
                <strong>بو:</strong> {selectedProduct.smell}
              </p>
              <p>
                <strong>امتیاز:</strong> {selectedProduct.score}
              </p>
              <p>
                <strong>موجودی:</strong> {selectedProduct.inventory}
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
              <h2>ویرایش محصول</h2>
              <div className="image-container">
                <img src={img} alt="" className={styles.selectedProduct_img} />
                <div className="image-overlay">
                  <span>برای انتخاب عکس جدید کلیک کنید</span>

                  <input
                    className="file-input"
                    type="file"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className={styles.edite_inputs}>
                <div>
                  <label>
                    <p>نام:</p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label>
                    <p>قیمت:</p>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                  <label>
                    <p>مورد استفاده برای:</p>
                    <input
                      type="text"
                      value={suitableFor}
                      onChange={(e) => setSuitableFor(e.target.value)}
                    />
                  </label>
                  <label>
                    <p>بو:</p>
                    <input
                      type="text"
                      value={smell}
                      onChange={(e) => setSmell(e.target.value)}
                    />
                  </label>
                  <label>
                    <p>برچسب‌ها:</p>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <p>وزن:</p>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="وزن را به گرم وارد کنید"
                    />
                  </label>
                  <label>
                    <p>تعداد موجودی:</p>
                    <input
                      type="text"
                      value={inventory}
                      onChange={(e) => setInventory(e.target.value)}
                    />
                  </label>
                  <label>
                    توضیحات کوتاه:
                    <textarea
                      type="text"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                    />
                  </label>
                  <label>
                    <p>توضیحات بلند:</p>
                    <textarea
                      type="text"
                      value={longDesc}
                      onChange={(e) => setLongDesc(e.target.value)}
                    />
                  </label>
                </div>
              </div>
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
