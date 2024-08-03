import styles from "./answer.module.css";

const Answer = ({ type, body, createdAt, user , answer}) => {
  return (
    <section
      className={type === "user" ? styles.userTicket : styles.adminticket}
    >
      <div className={styles.ticket_main}>
        <p>{new Date(createdAt).toLocaleDateString("fa-IR")} </p>
        <div>
          <div>
            <p>{user.name}</p>
            <span>{type === "user" ? "کاربر" : "ادمین"}</span>
          </div>
          <img src={user.img || "/images/shahin.jpg"} alt="" />
        </div>
      </div>
      <div className={styles.ticket_text}>
        <p>{type === "user" ? body : answer}</p>
      </div>
    </section>
  );
};

export default Answer;
