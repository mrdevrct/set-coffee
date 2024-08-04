"use client";
import { useState, useEffect } from "react";
import styles from "./topbar.module.css";
import Modal from "./Modal";
import { HiOutlineMenu } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/lib/redux/store/menuSlice";

const Topbar = ({ name, img }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const hideModal = () => setShowModal(false);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.profile}>
          <div>
            <p>{name || "کاربر ست کافی"}</p>
            <span>کاربر</span>
          </div>
          <img src={img || "/images/user-icon.png"} alt="" />
        </div>

        <h1>پنل کاربری</h1>

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
          <div
            onClick={() => setShowNotifications(true)}
            className={styles.notification}
          >
            <IoIosNotifications />
            <span>0</span>
          </div>
        </section> */}
      </div>

      {showNotifications && (
        <div>
          <div
            onClick={() => setShowNotifications(false)}
            className={styles.notifications_overlay}
          ></div>
          <section className={styles.notifications_box}>
            <div>
              <p
                onClick={() => {
                  setShowNotifications(false);
                  setShowModal(true);
                }}
              >
                سلام ادمین محترم
              </p>
              <button onClick={() => setShowNotifications(false)}>دیدم</button>
            </div>
            <div>
              <p
                onClick={() => {
                  setShowNotifications(false);
                  setShowModal(true);
                }}
              >
                سلام ادمین محترم
              </p>
              <button onClick={() => setShowNotifications(false)}>دیدم</button>
            </div>

            {/* if we dont have any notif we show : */}
            {/* <div>
              <span>پیامی وجود ندارد</span>
              <IoClose onClick={() => setShowNotifications(false)}/>
            </div> */}
          </section>
        </div>
      )}
      {showModal && (
        <Modal title="از واحد پشتیبانی" hideModal={hideModal}>
          <p className={styles.modal_text}>عالی هستی ادمین عزیز</p>
        </Modal>
      )}
    </>
  );
};

export default Topbar;
