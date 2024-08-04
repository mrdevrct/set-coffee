import React from "react";
import styles from "./sights.module.css";

function Sights({ sights }) {
  return (
    <div className={styles.contents}>
      <p className={styles.title}>دیدگاه ها</p>
      {sights
        .filter((sight) => sight.isAccept)
        .map((sight) => (
          <div key={sight._id} className={styles.comment}>
            <img
              src={sight.user.img || "/images/user-icon.png"}
              alt="User"
              className={styles.userImage}
            />
            <div className={styles.commentDetails}>
              <div className={styles.userInfo}>
                <p className={styles.role}>
                  {!sight.isAnswer ? "کاربر" : "مدیر"}
                </p>
                <p className={styles.username}>{sight.username}</p>
              </div>
              <p className={styles.date}>
                {new Date(sight.createdAt).toLocaleDateString("fa-IR")}
              </p>
              <p className={styles.message}>{sight.body}</p>
              {sight.replay && (
                <div className={styles.replay}>
                  <p className={styles.replayUser} style={{ direction: "rtl" }}>
                    <span>{sight.replay.username} : </span>
                    {sight.replay.body}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Sights;
