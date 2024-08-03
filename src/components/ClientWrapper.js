"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./clientWrapper.module.css"; 

const ClientWrapper = ({ children }) => {
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    setMenuOpen(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!contentLoaded) {
      // فرض کنیم محتوا در حال بارگذاری است
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 300); // این زمان را می‌توانید با توجه به نیاز تغییر دهید

      return () => clearTimeout(timer);
    }
  }, [contentLoaded]);

  useEffect(() => {
    if (contentLoaded) {
      setLoading(false);
    }
  }, [contentLoaded]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (menuOpen) {
    return null;
  }

  return <>{children}</>;
};

export default ClientWrapper;
