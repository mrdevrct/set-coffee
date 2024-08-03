"use client";
import styles from "./sidebar.module.css";
import { ImReply } from "react-icons/im";
import { FaComments, FaHeart, FaShoppingBag, FaUsers } from "react-icons/fa";
import { MdSms, MdLogout } from "react-icons/md";
import { SiFuturelearn } from "react-icons/si";
import { TbListDetails } from "react-icons/tb";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "@/lib/redux/store/menuSlice";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

const Sidebar = ({ name }) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = (url, event) => {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد
    dispatch(closeMenu());
    router.push(url);
  };

  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/auth/signout", {
          method: "POST",
        });

        if (res.status === 200) {
          swal({
            title: "با موفقیت از حساب خارج شدید",
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
        <p>خوش اومدی {name} عزیز</p>
        <IoMdClose className={styles.sidebar_closeBtn} onClick={closeSidbar} />
      </div>
      <ul className={styles.sidebar_main}>
        <li className={path === "/p-user" ? styles.sidebar_link_active : ""}>
          <a
            href="/p-user"
            onClick={(event) => handleLinkClick("/p-user", event)}
          >
            <ImReply />
            پیشخوان
          </a>
        </li>
        <li
          className={
            path === "/p-user/orders" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-user/orders"
            onClick={(event) => handleLinkClick("/p-user/orders", event)}
          >
            <FaShoppingBag />
            سفارش ها
          </a>
        </li>
        <li
          className={
            path === "/p-user/tickets" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-user/tickets"
            onClick={(event) => handleLinkClick("/p-user/tickets", event)}
          >
            <MdSms />
            تیکت های پشتیبانی
          </a>
        </li>
        <li
          className={
            path === "/p-user/comments" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-user/comments"
            onClick={(event) => handleLinkClick("/p-user/comments", event)}
          >
            <FaComments />
            کامنت ها
          </a>
        </li>
        <li
          className={
            path === "/p-user/wishlist" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-user/wishlist"
            onClick={(event) => handleLinkClick("/p-user/wishlist", event)}
          >
            <FaHeart />
            علاقه مندی
          </a>
        </li>
        <li
          className={path === "/p-user/sight" ? styles.sidebar_link_active : ""}
        >
          <a
            href="/p-user/sight"
            onClick={(event) => handleLinkClick("/p-user/sight", event)}
          >
            <SiFuturelearn />
            دیدگاه ها
          </a>
        </li>
        <li
          className={
            path === "/p-user/account-details" ? styles.sidebar_link_active : ""
          }
        >
          <a
            href="/p-user/account-details"
            onClick={(event) =>
              handleLinkClick("/p-user/account-details", event)
            }
          >
            <TbListDetails />
            جزئیات اکانت
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
