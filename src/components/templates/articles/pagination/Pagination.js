import styles from "./pagination.module.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Pagination = ({
  totalArticles,
  articlesPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className={styles.pagination}>
      <ul>
        <MdChevronRight onClick={() => handlePageChange(currentPage - 1)} />
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={currentPage === index + 1 ? styles.active : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </li>
        ))}
        <MdChevronLeft onClick={() => handlePageChange(currentPage + 1)} />
      </ul>
    </div>
  );
};

export default Pagination;
