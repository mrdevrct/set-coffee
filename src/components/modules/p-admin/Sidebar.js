"use client";
import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import { FaComments, FaHeart, FaShoppingBag, FaUsers } from "react-icons/fa";
import { MdArticle, MdOutlineAttachMoney } from "react-icons/md";
import { SiFuturelearn } from "react-icons/si";
import { MdSms, MdLogout } from "react-icons/md";
import { usePathname } from "next/navigation";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { closeMenu } from "@/lib/redux/store/menuSlice";

const Sidebar = ({ name }) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);
  const [isMobile, setIsMobile] = useState(false);

  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/auth/signout", { method: "POST" });
        if (res.status === 200) {
          swal({
            title: "با موفقیت از حساب خود خارج شدید",
            icon: "success",
            buttons: "فهمیدم",
          }).then(() => {
            location.replace("/");
          });
        }
      }
    });
  };

  const closeSidbar = () => {
    dispatch(closeMenu());
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebar_open : ""} ${
        isOpen && isMobile ? styles.sidebar_full : ""
      }`}
    >
      <div className={styles.sidebar_header}>
        <p>خوش اومدی {name || "کاربر ست کافی"} عزیز</p>
        <IoMdClose className={styles.sidebar_closeBtn} onClick={closeSidbar} />
      </div>
      <ul className={styles.sidebar_main}>
        <li className={path === "/p-admin" ? styles.sidebar_link_active : ""}>
          <a
            href="/p-admin"
            onClick={(event) => handleLinkClick("/p-admin", event)}
          >
            <ImReply />
            پیشخوان
          </a>
        </li>
        <li
          className={
            path === "/p-admin/orders" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/orders"
            onClick={(event) => handleLinkClick("/p-admin/orders", event)}
          >
            <FaShoppingBag />
            سفارشات
          </a>
        </li>
        <li
          className={
            path === "/p-admin/products" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/products"
            onClick={(event) => handleLinkClick("/p-admin/products", event)}
          >
            <FaShoppingBag />
            محصولات
          </a>
        </li>
        <li
          className={
            path === "/p-admin/users" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/users"
            onClick={(event) => handleLinkClick("/p-admin/users", event)}
          >
            <FaUsers />
            کاربران
          </a>
        </li>
        <li
          className={
            path === "/p-admin/comments" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/comments"
            onClick={(event) => handleLinkClick("/p-admin/comments", event)}
          >
            <FaComments />
            کامنت ها
          </a>
        </li>
        <li
          className={
            path === "/p-admin/tickets" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/tickets"
            onClick={(event) => handleLinkClick("/p-admin/tickets", event)}
          >
            <MdSms />
            تیکت ها
          </a>
        </li>
        <li
          className={
            path === "/p-admin/articles" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/articles"
            onClick={(event) => handleLinkClick("/p-admin/articles", event)}
          >
            <MdArticle />
            مقالات
          </a>
        </li>
        <li
          className={
            path === "/p-admin/sights" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/sights"
            onClick={(event) => handleLinkClick("/p-admin/sights", event)}
          >
            <SiFuturelearn />
            دیدگاه ها
          </a>
        </li>
        <li
          className={
            path === "/p-admin/discounts" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-admin/discounts"
            onClick={(event) => handleLinkClick("/p-admin/discounts", event)}
          >
            <MdOutlineAttachMoney />
            تخفیفات
          </a>
        </li>
        <li className={path === "/" ? styles.sidebar_link_active : ""}>
          <a href="/" onClick={(event) => handleLinkClick("/", event)}>
            <ImReply />
            برگشت به صفحه فروشگاه
          </a>
        </li>
      </ul>

      <div className={styles.logout} onClick={logoutHandler}>
        <MdLogout />
        خروج
      </div>
    </aside>
  );
};

export default Sidebar;
