"use client";
import styles from "./articles.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import Article from "./Article";

const Articles = ({ articles }) => {
  return (
    <>
      {articles ? (
        <div className={styles.container}>
          <p className={styles.title}>مقالات ما</p>
          <span className={styles.description}>
            دانستنی های جذاب دنیای قهوه
          </span>
          <main>
            <Swiper
              spaceBetween={30}
              dir="rtl"
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation, Autoplay]}
              className="mySwiper articles_slider"
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                480: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {articles.map((article) => (
                <SwiperSlide key={article._id} className={styles.slide}>
                  <Article {...article} />
                </SwiperSlide>
              ))}
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </Swiper>
          </main>
        </div>
      ) : null}
    </>
  );
};

export default Articles;
