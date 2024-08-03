import React from "react";
import styles from "./userPanelLayout.module.css";
import Sidebar from "@/components/modules/p-user/Sidebar";
import Topbar from "@/components/modules/p-user/Topbar";
import { authUser } from "@/utils/isLogin";
import { redirect } from "next/navigation";
import ClientWrapper from "@/components/ClientWrapper";

const Layout = async ({ children }) => {
  const user = await authUser();

  if (!user) {
    redirect("/login-register");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <Sidebar name={user?.name}/>
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
