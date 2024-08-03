"use client";
import { IoMdStar } from "react-icons/io";
import styles from "./commentForm.module.css";
import { useEffect, useState } from "react";
import { ShowSwal } from "@/utils/helper";
import { validateEmail } from "@/utils/auth";

const CommentForm = ({ productID }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [score, setScore] = useState(5);
  const [user, setUser] = useState({});
  const [isSaveUserInfo, setIsSaveUserInfo] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const data = await res.json();
        setUser({ ...data });
      }
    };

    authUser();
  }, []);

  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {      
      setUsername(userInfo.username || "")
      setEmail(userInfo.email || "")
    }
  },[])

  const setCommentScore = (score) => {
    setScore(score);
    ShowSwal("امتیاز شما با موفقیت ثبت شد", "success", "قهمیدم");
  };

  const sendComment = async () => {
    if (!user) {
      return ShowSwal(
        "لطفا برای ثبت کامنت ابتدا وارد حساب خود شوید",
        "error",
        "فهمیدم"
      );
    }

    if (!username.trim() || !body.trim()) {
      return ShowSwal("لطفا تمامی فیلد ها را پر کنید ", "error", "فهمیدم");
    }

    if (!email.trim()) {
      return ShowSwal("لطفا ایمیل خود را وارد کنید", "error", "فهمیدم");
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return ShowSwal("ایمیل وارد شده معتبر نمی باشد", "error", "فهمیدم");
    }

    if (isSaveUserInfo) {
      const userInfo = {
        username ,
        email
      }  

      localStorage.setItem("userInfo",JSON.stringify(userInfo))
    }

    const newComment = {
      userID: user._id,
      username,
      email,
      body,
      score,
      productID,
    };

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    if (res.status === 201) {
      ShowSwal("کامنت پس از تایید مدیریت نمایش داده می شود", "success", "فهمیدم ");
      setUsername("");
      setEmail("");
      setBody("");
      setScore("");
    } else if (res.status === 404) {
      return ShowSwal(
        "لطفا برای ثبت کامنت ابتدا وارد حساب خود شوید",
        "error",
        "فهمیدم"
      );
    } else if (res.status === 500) {
      return ShowSwal(
        "مشکل در سرور داخلی به وجود امده بعدا تلاش کنید",
        "error",
        "فهمیدم"
      );
    }
  };

  return (
    <div className={styles.form}>
      <p className={styles.title}>دیدگاه خود را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span style={{ color: "red" }}>*</span>
      </p>
      <div className={styles.rate}>
        <p>امتیاز شما :</p>
        <div>
          <IoMdStar onClick={() => setCommentScore(5)} />
          <IoMdStar onClick={() => setCommentScore(4)} />
          <IoMdStar onClick={() => setCommentScore(3)} />
          <IoMdStar onClick={() => setCommentScore(2)} />
          <IoMdStar onClick={() => setCommentScore(1)} />
        </div>
      </div>
      <div className={styles.group}>
        <label htmlFor="">
          دیدگاه شما
          <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          cols="45"
          rows="8"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required=""
          placeholder=""
        ></textarea>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label htmlFor="">
            نام
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">
            ایمیل
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          value={isSaveUserInfo}
          onChange={(e) => setIsSaveUserInfo((prev) => !prev)}
        />
        <p>
          {" "}
          ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی
          می‌نویسم.
        </p>
      </div>
      <button onClick={sendComment}>ثبت</button>
    </div>
  );
};

export default CommentForm;
