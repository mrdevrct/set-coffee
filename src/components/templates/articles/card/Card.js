import Link from "next/link";
import styles from "./card.module.css";

const Card = ({ _id, title, cover_image, body }) => {
  return (
    <div className={styles.card}>
      <Link href={`/article/${_id}`}>
        <img
          src={
            cover_image ||
            "https://set-coffee.com/wp-content/uploads/2023/04/31810-Coffee.jpg"
          }
          alt=""
        />
      </Link>
      <Link href={`/article/${_id}`} className={styles.title}>
        {title}
      </Link>
      <p className={styles.description}>{body}</p>
      <Link href={`/article/${_id}`}>ادامه مطلب</Link>
    </div>
  );
};

export default Card;
