"use client";
import React from "react";
import moment from "moment-jalaali";
import { FaRegStar, FaStar } from "react-icons/fa";
import styles from "./comment.module.css";

const Comment = ({
  username,
  date,
  score,
  isAnswer,
  body,
  role,
  userID,
  replay,
}) => {
  moment.loadPersian({ usePersianDigits: true });
  const jalaaliDate = moment(date).format("jD jMMMM jYYYY");

  return (
    <>
      <section className={styles.comment_mobile}>
        <div className={styles.details}>
          <img
            src={userID.img || "/images/user-icon.png"}
            className={styles.avatar}
            alt=""
          />
          <div className={styles.user_details}>
            <strong>{!isAnswer ? username : userID.name}</strong>
            <span>{jalaaliDate}</span>
            <div className={styles.stars} dir="ltr">
              {new Array(score).fill(0).map((item, index) => (
                <FaStar key={index} />
              ))}
              {new Array(5 - score).fill(0).map((item, index) => (
                <FaRegStar key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <p>{body}</p>
          {role !== "USER" && replay && replay.length > 0 && (
            <p className={styles.replay}>
              {username}:{replay}
            </p>
          )}
        </div>
      </section>

      <section className={styles.comment}>
        <div>
          <img
            src={userID.img || "/images/shahin.jpg"}
            className={styles.avatar}
            alt=""
          />
        </div>
        <div className={styles.details_comment}>
          <div className={styles.userInfo}>
            {" "}
            <strong>{!isAnswer ? username : userID.name}</strong>
            <span>{jalaaliDate}</span>
            <div className={styles.stars} dir="ltr">
              {new Array(score).fill(0).map((item, index) => (
                <FaStar key={index} />
              ))}
              {new Array(5 - score).fill(0).map((item, index) => (
                <FaRegStar key={index} />
              ))}
            </div>
          </div>
          <span style={{ fontSize: "12px", margin: "10px 0" }}>
            {role === "USER" ? "کاربر" : "مدیر"}
          </span>
          <h5>{body}</h5>
          {role !== "USER" && replay && replay.length > 0 && (
            <p className={styles.replay}>
              {username}:{replay}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Comment;

{
  /* <section className={styles.comment}>
  <div className={styles.details_mobile}>
    <img
      src={userID.img || "/images/shahin.jpg"}
      className={styles.avatar}
      alt=""
    />
    <div className={styles.user_info}>
      <strong>{!isAnswer ? username : userID.name}</strong>
      <p>{jalaaliDate}</p>
      <div className={styles.stars} dir="ltr">
        {new Array(score).fill(0).map((item, index) => (
          <FaStar key={index} />
        ))}
        {new Array(5 - score).fill(0).map((item, index) => (
          <FaRegStar key={index} />
        ))}
      </div>
    </div>
  </div>
  <div>
    <div className={styles.main_details}>
      <div className={styles.user_info}>
        <strong>{!isAnswer ? username : userID.name}</strong>
        <p>{jalaaliDate}</p>
      </div>
      <div className={styles.stars} dir="ltr">
        {new Array(score).fill(0).map((item, index) => (
          <FaStar key={index} />
        ))}
        {new Array(5 - score).fill(0).map((item, index) => (
          <FaRegStar key={index} />
        ))}
      </div>
    </div>
    <div>
      <p style={{ fontSize: "12px", marginBottom: "10px" }}>
        {role === "USER" ? "کاربر" : "مدیر"}
      </p>
      <p>{body}</p>
      {role !== "USER" && replay && replay.length > 0 && (
        <p className={styles.replay}>
          {username}:{replay}
        </p>
      )}
    </div>
  </div>
</section>; */
}
