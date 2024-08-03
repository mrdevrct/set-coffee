"use client";
import Link from "next/link";
import styles from "./table.module.css";
import totalStyles from "./totals.module.css";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import stateData from "@/utils/stateData";
import Select from "react-select";
import { ShowSwal } from "@/utils/helper";
import { TbShoppingCartX } from "react-icons/tb";

const stateOptions = stateData();

const Table = ({ isLogin, deliveryCost, products }) => {
  const [cart, setCart] = useState([]);
  const [stateSelectedOption, setStateSelectedOption] = useState(null);
  const [citySelectedOption, setCitySelectedOption] = useState(null);
  const [changeAddress, setChangeAddress] = useState(false);
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  useEffect(calcTotalPrice, [cart]);

  function calcTotalPrice() {
    let price = 0;

    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0
      );
      setTotalPrice(price);
    }

    setTotalPrice(price);
  }

  // update cart
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // city and state
  const handleStateChange = (selectedOption) => {
    setStateSelectedOption(selectedOption);
    setCitySelectedOption(null); // Reset city selection when state changes
  };

  // get city
  const getCityOptions = () => {
    if (stateSelectedOption) {
      const state = stateOptions.find(
        (state) => state.value === stateSelectedOption.value
      );
      return state ? state.cities : [];
    }
    return [];
  };

  const incrementItem = (id) => {
    const product = products.find((item) => item._id === id);
    const cartItem = cart.find((item) => item.id === id);

    if (cartItem.count < product.inventory) {
      const updatedCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
      updateCart(updatedCart);
    } else {
      ShowSwal("تعداد انتخابی از موجودی بیشتر است", "error", "فهمیدم");
    }
  };

  const decrementItem = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.count > 1) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  // removed items
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const handlerComplatedCart = () => {
    if (!isLogin) {
      ShowSwal("لطفا برای تکمیل خرید ابتدا لاگین کنید", "error", "فهمیدم");
      return;
    } else {
      location.pathname = "/checkout";
    }
  };

  return (
    <>
      {cart.length ? (
        <main className={styles.cart} data-aos="fade-up">
          <div className={styles.tabel_container}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>جمع جزء</th>
                  <th>تعداد</th>
                  <th>قیمت</th>
                  <th>محصول</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{(item.count * item.price).toLocaleString()} تومان</td>
                    <td className={styles.counter}>
                      <div>
                        <span onClick={() => decrementItem(item.id)}>-</span>
                        <p>{item.count}</p>
                        <span onClick={() => incrementItem(item.id)}>+</span>
                      </div>
                    </td>
                    <td className={styles.price}>
                      {item.price.toLocaleString()} تومان
                    </td>
                    <td className={styles.product}>
                      <img src={item.img} alt={item.name} />
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </td>

                    <td>
                      <IoMdClose
                        className={styles.delete_icon}
                        onClick={() => removeItem(item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <section>
              <button
                className={styles.update_btn}
                onClick={() => location.reload()}
              >
                {" "}
                بروزرسانی سبد خرید
              </button>
              {/* <div>
                <button className={styles.set_off_btn} onClick={checkDiscount}>
                  اعمال کوپن
                </button>
                <input
                  type="text"
                  placeholder="کد تخفیف"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div> */}
            </section>
          </div>

          <div className={styles.cartItem_mobile}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItem_cover}>
                  <a href={`/product/${item.id}`}>
                    <img src={item.img} alt="" />
                  </a>
                  <span>
                    <IoMdClose onClick={() => removeItem(item.id)} />
                  </span>
                </div>
                <div className={styles.cartItem_details}>
                  <a href={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </a>
                  <p>{item.price.toLocaleString("fa-IR")} تومان</p>

                  <div className={styles.cartItem_footer}>
                    <div className={styles.counter_item}>
                      <span onClick={() => incrementItem(item.id)}>+</span>
                      {item.count}
                      <span onClick={() => decrementItem(item.id)}>-</span>
                    </div>
                    <div className={styles.cartItem_totalPrice}>
                      <span>جمع جزء : </span>
                      <p>
                        {(item.price * item.count).toLocaleString("fa-IR")}{" "}
                        تومان
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={totalStyles.totals}>
            <p className={totalStyles.totals_title}>جمع کل سبد خرید</p>

            <div className={totalStyles.subtotal}>
              <p>جمع جزء </p>
              <p>{totalPrice.toLocaleString()} تومان</p>
            </div>

            <p className={totalStyles.motor}>
              {" "}
              پیک : <strong> {deliveryCost.toLocaleString("fa-IR")} </strong>
            </p>
            <div className={totalStyles.address}>
              <p>حمل و نقل </p>
              <span>حمل و نقل به تهران (فقط شهر تهران).</span>
            </div>
            <p
              onClick={() => setChangeAddress((prev) => !prev)}
              className={totalStyles.change_address}
            >
              تغییر آدرس
            </p>
            {changeAddress && (
              <div className={totalStyles.address_details}>
                <Select
                  defaultValue={stateSelectedOption}
                  onChange={handleStateChange}
                  isClearable={true}
                  placeholder={"استان"}
                  isRtl={true}
                  isSearchable={true}
                  options={stateOptions}
                />
                <Select
                  defaultValue={citySelectedOption}
                  onChange={setCitySelectedOption}
                  isClearable={true}
                  placeholder={"شهر"}
                  isRtl={true}
                  isSearchable={true}
                  options={getCityOptions()}
                  isDisabled={!stateSelectedOption}
                />
                <input type="number" placeholder="کد پستی" />
                <button onClick={() => setChangeAddress(false)}>
                  بروزرسانی
                </button>
              </div>
            )}

            <div className={totalStyles.total}>
              <p>مجموع</p>
              <p>{(totalPrice + deliveryCost).toLocaleString("fa-IR")} تومان</p>
            </div>
            <button
              className={totalStyles.checkout_btn}
              onClick={handlerComplatedCart}
            >
              ادامه جهت تصویه حساب
            </button>
          </div>
        </main>
      ) : (
        <div className={styles.cart_empty} data-aos="fade-up">
          <TbShoppingCartX />
          <p>سبد خرید شما در حال حاضر خالی است.</p>
          <span>
            قبل از تسویه حساب، باید چند محصول را به سبد خرید خود اضافه کنید.
          </span>
          <span>در صفحه "فروشگاه"، محصولات جالب زیادی خواهید یافت.</span>
          <div>
            <Link href="/category">بازگشت به فروشگاه</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
