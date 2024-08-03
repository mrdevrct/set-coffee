"use client";
import styles from "./products.module.css";
import { MdOutlineClose, MdOutlineGridView } from "react-icons/md";
import { BiSolidGrid } from "react-icons/bi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import Product from "@/components/modules/product/Product";
import Pagination from "@/components/modules/pagination/Pagination";
import { useState, useEffect } from "react";
import Filtering from "../filtering/Filtering";
import { HiArrowsUpDown } from "react-icons/hi2";
import { IoIosMenu } from "react-icons/io";

const Products = ({ products, sortBylastProduct, wishlist, wishs }) => {
  const [allProduct, setAllProduct] = useState([...products]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // تعداد محصولات در هر صفحه
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [columns, setColumns] = useState(2);
  const [showMenuMobileSort, setShowMenuMobileSort] = useState(false);
  const [openMenuFilter, setOpenMenuFilter] = useState(false);

  useEffect(() => {
    updateDisplayedProducts();
  }, [allProduct, currentPage]);

  const updateDisplayedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(allProduct.slice(startIndex, endIndex));
  };

  const sortByHighPrice = () => {
    const sortedProducts = [...allProduct].sort((a, b) => b.price - a.price);
    setAllProduct(sortedProducts);
  };

  const sortByLowPrice = () => {
    const sortedProducts = [...allProduct].sort((a, b) => a.price - b.price);
    setAllProduct(sortedProducts);
  };

  const sortByScore = () => {
    const sortedProducts = [...allProduct].sort((a, b) => b.score - a.score);
    setAllProduct(sortedProducts);
  };

  const sortByWishList = () => {
    const productWishlistCount = {};
    wishlist.forEach(({ product }) => {
      productWishlistCount[product._id] =
        (productWishlistCount[product._id] || 0) + 1;
    });

    const sortedProducts = [...allProduct].sort(
      (a, b) =>
        (productWishlistCount[b._id] || 0) - (productWishlistCount[a._id] || 0)
    );

    setAllProduct(sortedProducts);
  };

  const handleSortChange = async (e) => {
    const { value } = e.target;
    if (value === "expensive") {
      sortByHighPrice();
      setShowMenuMobileSort(false);
    } else if (value === "Inexpensive") {
      sortByLowPrice();
      setShowMenuMobileSort(false);
    } else if (value === "default") {
      setAllProduct([...products]);
      setShowMenuMobileSort(false);
    } else if (value === "last_products") {
      setAllProduct([...sortBylastProduct]);
      setShowMenuMobileSort(false);
    } else if (value === "rating") {
      sortByScore();
      setShowMenuMobileSort(false);
    } else if (value === "popularity") {
      sortByWishList();
      setShowMenuMobileSort(false);
    } else {
      setAllProduct([...products]);
      setShowMenuMobileSort(false);
    }
  };

  const filterByPrice = (minPrice, maxPrice) => {
    const filteredProducts = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    setAllProduct(filteredProducts);
    setCurrentPage(1); // بازنشانی به صفحه اول
  };

  const filterByRating = (rating) => {
    const filteredProducts = products.filter(
      (product) => Math.floor(product.score) === rating
    );
    setAllProduct(filteredProducts);
    setCurrentPage(1); // بازنشانی به صفحه اول
  };

  const isProductInWishlist = (productId) => {
    return wishs.some(
      (wish) => wish.product.toString() === productId.toString()
    );
  };

  const toggleMenuSorting = () => {
    setShowMenuMobileSort(!showMenuMobileSort);
    setOpenMenuFilter(false);
  };

  const toggleMenuFiltering = () => {
    setOpenMenuFilter(!openMenuFilter);
    setShowMenuMobileSort(false);
  };

  return (
    <>
      <div className={styles.products}>
        <div className={styles.filtering}>
          <div className={styles.view}>
            <TfiLayoutGrid4Alt
              onClick={(e) => setColumns(3)}
              className={columns === 3 ? styles.active : null}
            />
            <BiSolidGrid
              onClick={(e) => setColumns(2)}
              className={columns === 2 ? styles.active : null}
            />
            <MdOutlineGridView
              onClick={(e) => setColumns(1)}
              className={columns === 1 ? styles.active : null}
            />
          </div>
          <select name="orderby" onChange={handleSortChange}>
            <option value="default">مرتب‌سازی پیش‌فرض</option>
            <option value="popularity">مرتب‌سازی بر اساس محبوبیت</option>
            <option value="rating">مرتب‌سازی بر اساس امتیاز</option>
            <option value="last_products">مرتب‌سازی بر اساس آخرین</option>
            <option value="Inexpensive">مرتب‌سازی بر اساس ارزانترین</option>
            <option value="expensive">مرتب‌سازی بر اساس گرانترین</option>
          </select>
        </div>

        <div className={styles.mobile_filtering}>
          <div className={styles.mobile_view} onClick={toggleMenuFiltering}>
            <IoIosMenu />
            نمایش فیلتر
          </div>
          <div className={styles.mobile_sort}>
            <HiArrowsUpDown onClick={toggleMenuSorting} />
            {showMenuMobileSort && (
              <div className={showMenuMobileSort && styles.mobile_menuSort}>
                <select name="orderby" onChange={handleSortChange}>
                  <option value={-1}>یک گزینه انتخاب کنید</option>
                  <option value="default">مرتب‌سازی پیش‌فرض</option>
                  <option value="popularity">مرتب‌سازی بر اساس محبوبیت</option>
                  <option value="rating">مرتب‌سازی بر اساس امتیاز</option>
                  <option value="last_products">مرتب‌سازی بر اساس آخرین</option>
                  <option value="Inexpensive">
                    مرتب‌سازی بر اساس ارزانترین
                  </option>
                  <option value="expensive">مرتب‌سازی بر اساس گرانترین</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <main
          className={
            columns === 1
              ? styles.main_1
              : columns === 2
              ? styles.main_2
              : columns === 3
              ? styles.main_3
              : null
          }
          dir="rtl"
        >
          {displayedProducts.map((product) => (
            <Product
              key={product._id}
              allProducts={products}
              isWish={isProductInWishlist(product._id)}
              {...product}
            />
          ))}
        </main>
        <Pagination
          totalProducts={allProduct.length}
          productsPerPage={productsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      <Filtering
        onPriceFilter={filterByPrice}
        onRatingFilter={filterByRating}
        bestProducts={products}
        openMenuFilter={openMenuFilter}
        toggleMenuFiltering={toggleMenuFiltering}
        setOpenMenuFilter={setOpenMenuFilter}
      />
    </>
  );
};

export default Products;
