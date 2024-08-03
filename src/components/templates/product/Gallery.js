"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";
import styles from "./gallery.module.css"

const Gallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <section className={styles.main}>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 gallery-slider"
      >
        <SwiperSlide>
          <img src={product?.img} key={Math.random()}/>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Gallery;
