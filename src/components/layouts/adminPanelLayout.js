import React from "react";
import styles from "./adminPanelLayout.module.css";
import Topbar from "../modules/p-admin/Topbar";
import Sidebar from "../modules/p-admin/Sidebar";
import { authUser } from "@/utils/isLogin";
import { redirect } from "next/navigation";
import ClientWrapper from "../ClientWrapper";

const Layout = async ({ children }) => {
  const user = await authUser();
  if (user) {
    if (user.role !== "ADMIN") {
      redirect("/p-user");
    }
  } else redirect("/login-register");

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <Sidebar name={user?.name} />
        <ClientWrapper>
          <div className={styles.contents}>
            <Topbar name={user?.name} img={user?.img} />
            {children}
          </div>
        </ClientWrapper>
      </section>
    </div>
  );
};

export default Layout;
