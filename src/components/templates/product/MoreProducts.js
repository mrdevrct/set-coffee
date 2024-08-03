"use client";
import Product from "@/components/modules/product/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const MoreProducts = ({ relatedProducts }) => {
  return (
    <div data-aos="fade-right" style={{ marginTop: "60px" }}>
      <section>
        <h2>محصولات مرتبط</h2>
        <div
          style={{
            height: "2px",
            width: "70px",
            background: "black",
            marginTop: "10px",
          }}
        ></div>
      </section>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        dir="rtl"
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product._id} style={{ padding: "0 10px" }}>
            <Product {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MoreProducts;
