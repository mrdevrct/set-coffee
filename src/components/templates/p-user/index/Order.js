import styles from "./order.module.css";

const Order = ({ total_price, createdAt, status, product }) => {
  const orderDate = new Date(createdAt);
  const formattedDate = orderDate.toLocaleDateString("fa-IR");
  const formattedTime = orderDate.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.card}>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            {product.map((pr, i) => (
              <img src={pr.img} alt={pr.name} key={i} />
            ))}
          </div>
          <ul>
            {product.map((pr, i) => (
              <li key={i}>
                {pr.name} * {pr.quantity}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.delete_btn}>
          {status === "shipped"
            ? "تحویل داده شده"
            : status === "processing"
            ? "در حال بررسی"
            : status === "pending"
            ? "منتظر پرداخت"
            : status === "canceled"
            ? "لغو شده"
            : null}
        </p>
      </div>
      <div>
        <p>{`${formattedTime} - ${formattedDate}`}</p>
        <p className={styles.price}>
          {total_price.toLocaleString()} هزار تومان
        </p>
      </div>
    </div>
  );
};

export default Order;
