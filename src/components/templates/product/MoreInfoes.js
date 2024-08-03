"use client"
import React from "react";
import styles from "./moreInfoes.module.css"

const MoreInfoes = ({ product }) => {
  return (
    <div>
      <p>اطلاعات بیشتر :</p>
      <hr />
      <main>
        <div className={styles.moreinfo_rows}>
          <p>وزن</p>
          <p>{product.weight} گرم</p>
        </div>
        <div className={styles.moreinfo_rows}>
          <p>مناسب برای</p>
          <p>{product.suitableFor}</p>
        </div>
        <div className={styles.moreinfo_rows}>
          <p>میزان بو</p>
          <p>{product.smell}</p>
        </div>
      </main>
    </div>
  );
};

export default MoreInfoes;
