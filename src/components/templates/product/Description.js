"use client"
import React from "react";
import styles from "./description.module.css"

const Description = ({ product }) => {
  return (
    <div className={styles.description}>
      <p>توضیحات :</p>
      <hr />
      <h3>{product.name}</h3>
      <p>{product.longDesc}</p>
    </div>
  );
};

export default Description;
