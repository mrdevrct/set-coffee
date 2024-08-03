"use client"
import { HiOutlineMenu } from "react-icons/hi";
import styles from "./topbar.module.css";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/lib/redux/store/menuSlice";

const Topbar = ({ name, img }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.profile}>
          <div>
            <p>{name || "کاربر ست کافی"}</p>
            <span>ادمین</span>
          </div>
          <img src={img || "/images/shahin.jpg"} alt="" />
        </div>

        <h1 style={{ marginTop: "10px" }}>پنل مدیریت</h1>

        <div
          className={styles.menuMobile}
          onClick={() => dispatch(toggleMenu())}
        >
          منو
          <HiOutlineMenu />
        </div>

        {/* <section>
          <div className={styles.searchBox}>
            <input type="text" placeholder="جستجو کنید" />
            <div>
              <IoIosSearch />
            </div>
          </div>
          <div className={styles.notification}>
            <IoIosNotifications />
            <span>2</span>
          </div>
        </section> */}
      </div>
    </>
  );
};

export default Topbar;
