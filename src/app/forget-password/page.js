import React from "react";
import ForgotPasswords from "@/components/templates/forgot-password/ForgotPassword";
import styles from "@/styles/login-register.module.css";

const ForgotPassword = () => {
  return (
    <>
      <div className={styles.login_register}>
        <div className={styles.form_bg} data-aos="fade-up">
          <ForgotPasswords />
        </div>
        <section>
          <img
            src="https://neurosciencenews.com/files/2023/06/coffee-brain-caffeine-neuroscincces.jpg"
            alt=""
          />
        </section>
      </div>
    </>
  );
};

export default ForgotPassword;

export const metadata = {
  title: "بازاریابی رمز عبور  | فروشگاه اینترنتی قهوه ست",
}