"use client";
import React, { useState } from "react";
import styles from "./addProduct.module.css";
import swal from "sweetalert";
import { ShowSwal } from "@/utils/helper";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [weight, setWeight] = useState("");
  const [suitableFor, setSuitableFor] = useState("");
  const [smell, setSmell] = useState("");
  const [inventory, setInventory] = useState("");
  const [tags, setTags] = useState("");
  const [img, setImg] = useState(null);

  const addProduct = async () => {
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

    if (!img) {
      ShowSwal("فیلد عکس ضروری است!", "error", "فهمیدم");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("shortDesc", shortDesc);
    formData.append("longDesc", longDesc);
    formData.append("weight", weight);
    formData.append("suitableFor", suitableFor);
    formData.append("smell", smell);
    formData.append("inventory", inventory);
    formData.append("tags", tags.split("،")); // Check delimiter
    formData.append("img", img);

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (res.status === 201) {
      swal({
        title: "محصول مورد نظر با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        location.pathname = "/p-admin/products";
      });
    }
  };

  return (
    <section className={styles.discount}>
      <p className={styles.title}>افزودن محصول جدید</p>
      <div className={styles.discount_main}>
        <div>
          <label>نام محصول</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="لطفا نام محصول را وارد کنید"
            type="text"
          />
        </div>
        <div>
          <label>مبلغ محصول</label>
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="لطفا مبلغ محصول را وارد کنید"
            type="text"
          />
        </div>
        <div>
          <label>توضیحات کوتاه</label>
          <textarea
            value={shortDesc}
            onChange={(event) => setShortDesc(event.target.value)}
            placeholder="توضیحات کوتاه محصول"
            type="text"
          />
        </div>
        <div>
          <label>توضیحات بلند</label>
          <textarea
            value={longDesc}
            onChange={(event) => setLongDesc(event.target.value)}
            placeholder="توضیحات بلند محصول"
            type="text"
          />
        </div>
        <div>
          <label>وزن</label>
          <input
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="وزن محصول"
            type="text"
          />
        </div>
        <div>
          <label>مناسب برای:</label>
          <input
            value={suitableFor}
            onChange={(event) => setSuitableFor(event.target.value)}
            placeholder="مناسب برای ..."
            type="text"
          />
        </div>
        <div>
          <label>میزان بو</label>
          <input
            value={smell}
            onChange={(event) => setSmell(event.target.value)}
            placeholder="میزان بو"
            type="text"
          />
        </div>
        <div>
          <label>تگ های محصول</label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="مثال: قهوه،قهوه ترک، قهوه اسپرسو"
            type="text"
          />
        </div>
        <div>
          <label>تصویر محصول</label>
          <input
            onChange={(event) => setImg(event.target.files[0])}
            type="file"
          />
        </div>
        <div>
          <label>تعداد های محصول</label>
          <input
            value={inventory}
            onChange={(event) => setInventory(event.target.value)}
            placeholder="تعداد موجودی محصول را وارد کنید"
            type="number"
          />
        </div>
      </div>
      <button onClick={addProduct}>افزودن</button>
    </section>
  );
}

export default AddProduct;
