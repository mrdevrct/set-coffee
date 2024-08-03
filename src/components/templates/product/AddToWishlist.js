"use client";
import { ShowSwal } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";

function AddToWishlist({ productID }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const data = await res.json();
        setUser({ ...data });
      }
    };

    authUser();
  }, []);

  const addToWishlist = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      return ShowSwal(
        "برای اضافه کردن به علاقه مندی‌ها لطفا ابتدا لاگین کنید",
        "error",
        "فهمیدم"
      );
    }

    const wish = {
      user: user._id,
      product: productID,
    };

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wish),
    });

    if (res.status === 201) {
      ShowSwal("محصول مورد نظر به علاقه‌مندی‌ها اضافه شد", "success", "فهمیدم");
    } else if (res.status === 409) {
      return ShowSwal(
        "این محصول قبلا در لیست علاقه‌مندی‌ها اضافه شده است",
        "error",
        "فهمیدم"
      );
    }
  };

  return (
    <div onClick={addToWishlist}>
      <CiHeart />
      <a href="/">افزودن به علاقه مندی ها</a>
    </div>
  );
}

export default AddToWishlist;
