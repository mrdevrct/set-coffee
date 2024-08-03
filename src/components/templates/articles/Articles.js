"use client";
import React, { useState } from "react";
import Pagination from "./pagination/Pagination";
import Box from "@/components/templates/articles/card/Card";
import styles from "@/styles/articles.module.css";

function Articles({ articles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className={styles.container}>
      <div className={styles.articles}>
        {currentArticles.map((article) => (
          <Box key={article._id} {...article} />
        ))}
      </div>
      <Pagination
        totalArticles={articles.length}
        articlesPerPage={articlesPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

export default Articles;
