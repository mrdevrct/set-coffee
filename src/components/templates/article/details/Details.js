import Link from "next/link";
import {
  FaAngleLeft,
  FaAngleRight,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import styles from "./details.module.css";
import moment from "moment-jalaali";

const Details = ({ article }) => {
  // تبدیل تاریخ میلادی به شمسی
  const jalaliDate = moment(article.createdAt).format("jYYYY/jMM/jDD");
  const [year, month, day] = jalaliDate.split("/");
  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  const monthName = monthNames[parseInt(month, 10) - 1];

  // تقسیم متن به پاراگراف‌ها
  const paragraphs = article.body
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");
  const images = article.images || [];
  const chunkSize = Math.ceil(paragraphs.length / (images.length + 1));

  // تابع برای تولید محتوا
  const renderContent = () => {
    const content = [];
    let imageIndex = 0;
  
    // اضافه کردن پاراگراف‌ها و تصاویر به صورت متناوب
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      content.push(
        ...paragraphs
          .slice(i, i + chunkSize)
          .map((p, index) => <p key={`p-${i + index}`} className={styles.paragraph}>{p}</p>)
      );
      if (imageIndex < images.length) {
        content.push(
          <div className={styles.img_content} key={`img-${imageIndex}`}>
            <img src={images[imageIndex]} alt="" />
          </div>
        );
        imageIndex++;
      }
    }
  
    return content;
  };
  

  return (
    <>
      <p className={styles.tag}>قهوه</p>
      <p className={styles.title}>{article.title}</p>
      <div className={styles.author}>
        <p>نویسنده</p>
        <img
          src={
            article.user.img ||
            "https://secure.gravatar.com/avatar/665a1a4dc7cc052eaa938253ef413a78?s=32&d=mm&r=g"
          }
          alt=""
        />
        <p>{article.author}</p>
      </div>

      <div className={styles.main_img}>
        <div className={styles.date}>
          <span>{day}</span>
          <span>{monthName}</span>
        </div>
        <img
          src={
            article.cover_image ||
            "https://set-coffee.com/wp-content/uploads/2024/01/coffe.jpg"
          }
          alt=""
        />
      </div>
      <section>{renderContent()}</section>
      <div className={styles.contents}>
        <div className={styles.icons}>
          <Link href={"/"}>
            <FaTelegram />
          </Link>
          <Link href={"/"}>
            <FaLinkedinIn />
          </Link>
          <Link href={"/"}>
            <FaPinterest />
          </Link>
          <Link href={"/"}>
            <FaTwitter />
          </Link>
          <Link href={"/"}>
            <FaFacebookF />
          </Link>
        </div>
        <div className={styles.more_articles}>
          <Link className={styles.link} href={"/articles"}>
            <IoGridOutline />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Details;
