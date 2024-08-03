"use client";
import { useEffect, useState } from "react";
import styles from "./order.module.css";
import Link from "next/link";
import stateData from "@/utils/stateData";
import Select from "react-select";
import { ShowSwal } from "@/utils/helper";
import { validateEmail, validatePhone } from "@/utils/auth";

const stateOptions = stateData();

const Order = ({ deliveryCost, allProducts }) => {
  const [cart, setCart] = useState([]);
  const [showZarinPallAlert, setShowZarinPallAlert] = useState(false);
  const [stateSelectedOption, setStateSelectedOption] = useState(null);
  const [citySelectedOption, setCitySelectedOption] = useState(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  // complate validation
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState([]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postal_code, setPostal_code] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [total_price, setTotal_price] = useState("");
  const [discount, setDiscount] = useState("");
  const [note, setNote] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  useEffect(calctotal_price, [cart]);

  function calctotal_price() {
    let price = 0;
    if (cart.length) {
      price = cart.reduce(
        (prev, current) => prev + current.price * current.count,
        0
      );
      setTotal_price(price);
    }
    setTotal_price(price);
  }

  const getCityOptions = () => {
    if (stateSelectedOption) {
      const state = stateOptions.find(
        (state) => state.value === stateSelectedOption.value
      );
      return state ? state.cities : [];
    }
    return [];
  };

  const handleStateChange = (selectedOption) => {
    setStateSelectedOption(selectedOption);
    setCitySelectedOption(null);
    setProvince(selectedOption ? selectedOption.label : "");
  };

  const handleCityChange = (selectedOption) => {
    setCitySelectedOption(selectedOption);
    setCity(selectedOption ? selectedOption.label : ""); // Update city state
  };

  const checkDiscount = async () => {
    const res = await fetch("api/discount/use", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: discount }),
    });

    if (res.status === 404) {
      return ShowSwal("کد تخفیف وارد شده معتبر نیست", "error", "تلاش مجدد");
    } else if (res.status === 409) {
      return ShowSwal("کد تخفیف وارد شده منقضی شده", "error", "تلاش مجدد");
    } else if (res.status === 410) {
      return ShowSwal("این کد تخفیف قبلا استفاده شده", "error", "تلاش مجدد");
    } else if (res.status === 200) {
      const discountCode = await res.json();
      const newPrice = total_price - (total_price * discountCode.percent) / 100;
      setTotal_price(newPrice);
      return ShowSwal("کد تخفیف با موفقیت اعمال شد", "success", "فهمیدم");
    }
  };

  const addOrder = async () => {
    if (!firstname.trim()) {
      ShowSwal("لطفا نام خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (!lastname.trim()) {
      ShowSwal("لطفا نام خانوادگی خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (!province.trim()) {
      ShowSwal("لطفا استان خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (!city.trim()) {
      ShowSwal("لطفا شهر خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (!postal_code.trim()) {
      ShowSwal("لطفا کد پستی خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (postal_code.length > 10) {
      ShowSwal("کد پستی باید ۱۰ رقم باشد", "error", "فهمیدم");
      return;
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        ShowSwal("ایمیل وارد شده معتبر نیست", "error", "فهمیدم");
        return;
      }
    }

    if (!phone.trim()) {
      ShowSwal("لطفا شماره تماس خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (phone.length !== 11) {
      ShowSwal("شماره تماس باید 11 رقم باشد", "error", "فهمیدم");
      return;
    }

    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      ShowSwal("شماره تماس وارد شده معتبر نیست", "error", "فهمیدم");
      return;
    }

    if (!address.trim()) {
      ShowSwal("لطفا آدرس خود را وارد کنید", "error", "فهمیدم");
      return;
    }

    if (!payment_method.trim()) {
      ShowSwal("لطفا روش پرداخت را انتخاب کنید", "error", "فهمیدم");
      return;
    }

    const order = {
      firstname,
      lastname,
      company,
      province,
      city,
      postal_code,
      email,
      phone,
      address,
      total_price: total_price + deliveryCost,
      payment_method,
      note,
      product: cart,
    };

    if (!acceptRules) {
      ShowSwal(
        "لطفا قوانین سایت را مطالعه کرده و تیک پذیرش قوانین را بزنید",
        "error",
        "فهمیدم"
      );
      return;
    }

    const invalidProduct = cart.find((item) => {
      const product = allProducts.find((product) => product._id === item.id);
      return product && item.count > product.inventory;
    });

    if (invalidProduct) {
      ShowSwal("تعداد محصول بیش از تعداد موجودی است", "error", "فهمیدم");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (res.status === 201) {
      const data = await res.json();
      swal({
        title: "اطلاعات با موفقیت ثبت شد تکمیل کردن خرید",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        const orderID = data.orderId;
        location.pathname = `/complate-order/${orderID}`;
      });
    } else if (res.status === 412) {
      return ShowSwal("محصولی یافت نشد", "error", "تلاش مجدد");
    } else if (res.status === 413) {
      return ShowSwal(
        "موجودی محصول تمام شده یا کم می باشد",
        "error",
        "تلاش مجدد"
      );
    } else {
      swal({
        title: "خطای سمت سرور رخ داد",
        icon: "error",
        buttons: "فهمیدم",
      });
    }
  };

  return (
    <>
      <div className={styles.order}>
        <p className={styles.title}>سفارش شما</p>
        <main className={styles.main}>
          <div>
            <p>جمع جزء</p>
            <p>محصول</p>
          </div>
          <div className={styles.product}>
            <div className={styles.product_item}>
              {cart.map((item, index) => (
                <div key={index}>
                  <p>{item.price.toLocaleString("fa-IR")} تومان</p>
                  <p className={styles.product_name}>
                    {item.name} × {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p>{total_price.toLocaleString("fa-IR")} تومان</p>
            <p>جمع جزء</p>
          </div>
          <div>
            <p>
              پیک : <strong> {deliveryCost.toLocaleString("fa-IR")}</strong>
            </p>
            <p>حمل و نقل</p>
          </div>
          <div>
            <div>
              <h2 className={styles.price}>
                {(total_price + deliveryCost).toLocaleString("fa-IR")} تومان
              </h2>
              <p>
                (شامل <strong>16,927</strong> تومان ارزش افزوده)
              </p>
            </div>
            <h3>مجموع</h3>
          </div>
        </main>
        <div className={styles.transaction}>
          <div>
            <input
              onClick={() => setShowZarinPallAlert(false)}
              type="radio"
              name="payment_method"
              value="melli"
              onChange={(e) => setPayment_method(e.target.value)}
            />
            <label> بانک ملی</label>
            <img
              width={24}
              height={40}
              src="https://set-coffee.com/wp-content/plugins/WooCommerce-melli/images/logo.png"
              alt="بانک ملی"
            ></img>
          </div>
          <div>
            <input
              onClick={() => setShowZarinPallAlert(true)}
              type="radio"
              name="payment_method"
              value="zarinpal"
              onChange={(e) => setPayment_method(e.target.value)}
            />
            <label>پرداخت امن زرین پال </label>
            <img
              width={40}
              height={40}
              src="https://set-coffee.com/wp-content/plugins/zarinpal-woocommerce-payment-gateway/assets/images/logo.png"
              alt="زرین پال"
            ></img>
          </div>
          {showZarinPallAlert && (
            <div className={styles.paymentBox}>
              <p>
                پرداخت امن به وسیله کلیه کارت های عضو شتاب از طریق درگاه زرین
                پال
              </p>
            </div>
          )}
          <div className={styles.warning}>
            <p>
              اطلاعات شخصی شما برای پردازش سفارش و پشتیبانی از تجربه شما در این
              وبسایت و برای اهداف دیگری که در{" "}
              <strong>سیاست حفظ حریم خصوصی</strong> توضیح داده شده است استفاده
              می‌شود.
            </p>
          </div>
          <div className={styles.accept_rules}>
            <input
              type="checkbox"
              name=""
              id=""
              value={acceptRules}
              onChange={(e) => setAcceptRules(e.target.checked)}
            />
            <p>
              {" "}
              من<strong> شرایط و مقررات</strong> سایت را خوانده ام و آن را می
              پذیرم. <span>*</span>
            </p>
          </div>
          <button className={styles.submit} onClick={addOrder}>
            ثبت سفارش
          </button>{" "}
        </div>
      </div>

      <div className={styles.details}>
        <section className={styles.discount}>
          <div>
            <p>کد تخفیف دارید؟</p>
            <span onClick={() => setShowDiscountForm(true)}>
              برای نوشتن کد اینجا کلیک کنید
            </span>
          </div>
          {showDiscountForm && (
            <div className={styles.discount_container}>
              <p>اگر کد تخفیف دارید لطفا در باکس زیر بنویسید</p>
              <div>
                <input
                  type="text"
                  placeholder="کد تخفیف"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <button onClick={checkDiscount}>اعمال کوپن</button>
              </div>
            </div>
          )}
        </section>

        <p className={styles.details_title}>جزئیات صورتحساب</p>
        <form className={styles.form}>
          <div className={styles.groups}>
            <div className={styles.group}>
              <label>
                نام خانوادگی <span>*</span>
              </label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <label>
                نام <span>*</span>
              </label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.group}>
            <label>نام شرکت (اختیاری)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label>
              استان<span>*</span>
            </label>
            <Select
              defaultValue={stateSelectedOption}
              onChange={handleStateChange}
              isClearable={true}
              placeholder={""}
              isRtl={true}
              isSearchable={true}
              options={stateOptions}
            />
          </div>
          <div className={styles.group}>
            <label>
              شهر<span>*</span>
            </label>
            <Select
              defaultValue={citySelectedOption}
              onChange={handleCityChange}
              isDisabled={!stateSelectedOption}
              isClearable={true}
              isRtl={true}
              isSearchable={true}
              options={getCityOptions()}
              placeholder={""}
            />
          </div>
          <div className={styles.group}>
            <label>
              آدرس <span>*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label>
              کدپستی (بدون فاصله)<span>*</span>
            </label>
            <input
              type="text"
              value={postal_code}
              onChange={(e) => setPostal_code(e.target.value)}
              maxLength={10} // This won't affect the length, but you can keep it for future reference
            />
          </div>
          <div className={styles.group}>
            <label>
              شماره موبایل <span>*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>

          <div className={styles.group}>
            <label>
              ایمیل <p>(اختیاری)</p>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.destination}>
            <label>توضیحات سفارش (اختیاری) </label>
            <textarea
              cols="30"
              rows="8"
              placeholder="اگر توضیحی در مورد سفارش خود دارید در اینجا ثبت کنید"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
};

export default Order;
