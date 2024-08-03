"use client"
import Login from "@/components/templates/login-register/login/Login";
import Register from "@/components/templates/login-register/register/Register";
import styles from "@/styles/login-register.module.css";
import React, { useState } from "react";
import { authTypes } from "@/utils/constans";

function page() {
  const [authType, setAuthType] = useState(authTypes.LOGIN);

  const showRegisterForm = ()=> setAuthType(authTypes.REGISTER)
  const showloginForm = ()=> setAuthType(authTypes.LOGIN)


  return (
    
    <div className={styles.login_register}>
      <div className={styles.form_bg} data-aos="fade-up">
        {authType === authTypes.LOGIN ? (
          <Login showRegisterForm={showRegisterForm} />
        ) : (
          <Register showloginForm={showloginForm} />
        )}
      </div>
      <section>
        <img
          src="https://neurosciencenews.com/files/2023/06/coffee-brain-caffeine-neuroscincces.jpg"
          alt=""
        />
      </section>
    </div>
  );
}

export default page;
