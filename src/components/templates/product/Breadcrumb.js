import React from "react";
import styles from "./breadcrumb.module.css";

const Breadcrumb = ({ title }) => {
  return (
    <section className={styles.breadcrumbContainer}>
      <div className={styles.breadcrumb}>
        <a href="/">خانه </a>
        <span>/</span>
        <a href="/">همه موارد </a>
        <span>/</span>
        <p>{title}</p>
      </div>
    </section>
  );
};

export default Breadcrumb;
