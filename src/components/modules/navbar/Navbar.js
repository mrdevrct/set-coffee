"use client";
import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Cart from "./Cart";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { LiaHomeSolid } from "react-icons/lia";
import { BsShop } from "react-icons/bs";
import { MdOutlineArticle } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsFiles } from "react-icons/bs";
import { TbShoppingCartX } from "react-icons/tb";

const Navbar = ({ isLogin, isAdmin, userID, products }) => {
  const [fixTop, setFixTop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cart, setCart] = useState(0);
  const [wish, setWish] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [navigation, setNavigation] = useState(false);
  const [navigationDropDown, setNavigationDropDown] = useState(false);
  const [cartPage, setCartPage] = useState(false);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fixNabarToTop = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 105) {
        setFixTop(true);
      } else {
        setFixTop(false);
      }
    };

    window.addEventListener("scroll", fixNabarToTop);

    return () => window.removeEventListener("scroll", fixNabarToTop);
  }, []);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    if (cartItems) {
      const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
      setCart(totalCount);
    } else {
      setCart(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const getWishlist = async () => {
      if (userID) {
        try {
          const res = await fetch("/api/wishlist");
          if (res.status === 200) {
            const data = await res.json();
            const wishs = data.filter((wishlist) => wishlist.user === userID);
            setWish(wishs.length);
          } else {
            setWish(0);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          setWish(0);
        }
      }
    };

    getWishlist();
  }, [isLogin, userID]);

  const openNavigation = () => {
    setOverlay(true);
    setNavigation(true);
    setCartPage(false);
  };

  const closeNavigation = () => {
    setOverlay(false);
    setNavigation(false);
    setCartPage(false);
  };

  const openCart = () => {
    setOverlay(true);
    setCartPage(true);
    setNavigation(false);
  };

  const closeCart = () => {
    setOverlay(false);
    setCartPage(false);
    setNavigation(false);
  };

  const closeOverlay = () => {
    setOverlay(false);
    setCartPage(false);
    setNavigation(false);
  };

  return (
    isClient && (
      <>
        <header className={fixTop ? styles.navbar_fixed : styles.navbar}>
          <main>
            <div>
              <Link href="/">
                <img src="/images/logo.png" alt="setcoffee logo" />
              </Link>
            </div>

            <ul className={styles.links}>
              <li>
                <Link href="/">صفحه اصلی</Link>
              </li>
              <li>
                <Link href="/category">فروشگاه</Link>
              </li>
              <li>
                <Link href="/articles">مقالات</Link>
              </li>
              <li>
                <Link href="/contact-us">تماس با ما</Link>
              </li>
              <li>
                <Link href="/about-us">درباره ما</Link>
              </li>
              <li>
                <Link href="/rules">قوانین</Link>
              </li>
              {isLogin ? (
                <div className={styles.dropdown}>
                  <Link href="/p-user">
                    <IoIosArrowDown className={styles.dropdown_icons} />
                    حساب کاربری
                  </Link>
                  <div className={styles.dropdown_content}>
                    <Link href="/p-user/orders">سفارشات</Link>
                    <Link href="/p-user/tickets">تیکت های پشتیبانی</Link>
                    <Link href="/p-user/comments">کامنت ها</Link>
                    <Link href="/p-user/wishlist">علاقه مندی ها</Link>
                    <Link href="/p-user/sight">دیدگاه ها</Link>
                    <Link href="/p-user/account-details">جزئیات اکانت</Link>
                    {isAdmin && <Link href="/p-admin/">پنل مدیریت</Link>}
                  </div>
                </div>
              ) : (
                <li>
                  <Link href="/login-register">ورود | عضویت</Link>
                </li>
              )}
            </ul>

            <div className={styles.navbar_icons}>
              <Link href="/cart">
                <FaShoppingCart />
                <span>{cart}</span>
              </Link>

              <Link href="/wishlist">
                <FaRegHeart />
                <span>{wish}</span>
              </Link>
            </div>
          </main>
        </header>

        <div className={styles.nav_mobile}>
          <div className={styles.count_cart}>
            <FiShoppingCart onClick={openCart} />
            <span>{cart}</span>
          </div>
          {cartPage && (
            <div className={styles.cartPage}>
              <div className={styles.cart_header}>
                <h3>سبد خرید</h3>
                <IoMdClose onClick={closeCart} />
              </div>
              {cart ? (
                <>
                  <div className={styles.cartPageContent}>
                    <Cart allProduct={products} setTotalPrice={setTotalPrice} />
                  </div>

                  <div className={styles.cart_footer}>
                    <div className={styles.cart_totalPrice}>
                      مجموع کل: <p>{totalPrice.toLocaleString("fa-IR")}</p>
                    </div>
                    <a href="/cart">مشاهده سبد خرید</a>
                    <a href="/checkout">ادامه جهت تسویه</a>
                  </div>
                </>
              ) : (
                <div className={styles.cart_empty} data-aos="fade-up">
                  <TbShoppingCartX />
                  <p>سبد خرید شما در حال حاضر خالی است.</p>
                  <span>
                    قبل از تسویه حساب، باید چند محصول را به سبد خرید خود اضافه
                    کنید.
                  </span>
                  <span>
                    در صفحه "فروشگاه"، محصولات جالب زیادی خواهید یافت.
                  </span>
                  <div>
                    <Link href="/category">بازگشت به فروشگاه</Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="setcoffee logo"
                className={styles.img_mobile}
              />
            </Link>
          </div>

          <div>
            <AiOutlineMenu onClick={openNavigation} />
          </div>
          {navigation && (
            <div className={styles.navigation}>
              <div className={styles.navigation_header}>
                <div>
                  <img src="/images/logo.png" alt="" />
                </div>
                <div>
                  <IoMdClose onClick={closeNavigation} />
                </div>
              </div>

              <div className={styles.navigation_main}>
                <Link href="/">
                  <LiaHomeSolid />
                  صفحه اصلی
                </Link>
                <Link href="/category">
                  <BsShop />
                  فروشگاه
                </Link>
                <Link href="/articles">
                  <BsFiles />
                  مقالات
                </Link>
                <Link href="/contact-us">
                  <BsTelephone />
                  تماس با ما
                </Link>
                <Link href="/about-us">
                  <HiOutlineUsers />
                  درباره ما
                </Link>
                <Link href="/rules">
                  <MdOutlineArticle />
                  قوانین
                </Link>
              </div>
              <div className={styles.navigation_footer}>
                {isLogin ? (
                  <>
                    <div
                      className={styles.navigation_dropdown}
                      onClick={() => setNavigationDropDown(!navigationDropDown)}
                    >
                      <IoIosArrowDown
                        className={styles.navigation_icon}
                        style={{
                          transform: navigationDropDown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                      حساب کاربری
                    </div>
                    {navigationDropDown && (
                      <div className={styles.navigation_dropdown_content}>
                        <Link href="/p-user">داشبورد</Link>
                        <Link href="/p-user/orders">سفارشات</Link>
                        <Link href="/p-user/tickets">تیکت های پشتیبانی</Link>
                        <Link href="/p-user/comments">کامنت ها</Link>
                        <Link href="/p-user/wishlist">علاقه مندی ها</Link>
                        <Link href="/p-user/sight">دیدگاه ها</Link>
                        <Link href="/p-user/account-details">جزئیات اکانت</Link>
                        {isAdmin && <Link href="/p-admin/">پنل مدیریت</Link>}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href="/login-register">ورود | عضویت</Link>
                )}
              </div>
            </div>
          )}
        </div>

        {overlay && (
          <div className={styles.overlay} onClick={closeOverlay}></div>
        )}
      </>
    )
  );
};

export default Navbar;
