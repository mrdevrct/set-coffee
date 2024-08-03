import Link from "next/link";
import styles from "./ticket.module.css";

const Ticket = ({ _id, title, department, hasAnswer, createdAt }) => {
  return (
    <Link href={`/p-user/tickets/answer/${_id}`} className={styles.ticket}>
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.department}>{department.title}</p>
      </div>
      <div>
        <p className={styles.date}>{new Date(createdAt).toLocaleDateString("fa-IR")}</p>
        <p className={hasAnswer ? styles.answer : styles.no_answer}>
          {hasAnswer ? "پاسخ داده شده " : "پاسخ داده نشده "}
        </p>
        {/* answer */}
      </div>
    </Link>
  );
};

export default Ticket;
