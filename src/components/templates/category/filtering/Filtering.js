"use client";
import styles from "./filtering.module.css";
import MultiRangeSlider from "../multiRange/MultiRangeSlider";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import Card from "../bestProducts/Card";

const Filtering = ({
  onPriceFilter,
  onRatingFilter,
  bestProducts,
  openMenuFilter,
  toggleMenuFiltering,
  setOpenMenuFilter
}) => {
  const [minValue, setMinValue] = useState(140000); // حداقل قیمت اولیه
  const [maxValue, setMaxValue] = useState(6790000); // حداکثر قیمت اولیه
  const [selectedRating, setSelectedRating] = useState(null); // امتیاز انتخاب شده

  const priceFilterHandler = () => {
    onPriceFilter(minValue, maxValue);
    setOpenMenuFilter(false)
  };

  const ratingFilterHandler = (rating) => {
    setSelectedRating(rating);
    onRatingFilter(rating);
    setOpenMenuFilter(false)
  };

  const deleteFilterHandler = ()=>{
    location.reload()
  }

  return (
    <>
      <div className={styles.filtering}>
        <div className={styles.price_filtering}>
          <p>فیلتر بر اساس قیمت:</p>
          <div>
            <MultiRangeSlider
              min={140000}
              max={10000000}
              onChange={({ min, max }) => {
                setMaxValue(max);
                setMinValue(min);
              }}
            />
            <button className={styles.filter_btn} onClick={priceFilterHandler}>
              فیلتر
            </button>
          </div>
        </div>
        <div className={styles.star_filtering}>
          <p className={styles.title}>انتخاب بر اساس امتیاز</p>
          <section>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} onClick={() => ratingFilterHandler(rating)}>
                <div>
                  {[...Array(5)].map((star, index) => {
                    return index < rating ? (
                      <FaStar key={index} />
                    ) : (
                      <FaRegStar key={index} />
                    );
                  })}
                </div>
                <span>{rating} ستاره</span>
              </div>
            ))}
          </section>
        </div>

        <div className={styles.best_products}>
          <p className={styles.title}>برترین محصولات</p>
          <section>
            {bestProducts
              ? bestProducts
                  .filter((product) => product.score > 4)
                  .slice(0, 4) // نمایش فقط چهار محصول با امتیاز بالاتر از 4
                  .map((product) => <Card key={product._id} {...product} />)
              : null}
          </section>
        </div>
      </div>

      {openMenuFilter && (
        <div className={styles.mobilefilter}>
          <div className={styles.price_filtering}>
            <p>فیلتر بر اساس قیمت:</p>
            <div className={styles.range}>
              <MultiRangeSlider
                min={140000}
                max={10000000}
                onChange={({ min, max }) => {
                  setMaxValue(max);
                  setMinValue(min);
                }}
              />
              <button
                className={styles.filter_btn}
                onClick={priceFilterHandler}
              >
                فیلتر
              </button>
            </div>
          </div>
          <div className={styles.star_filtering}>
            <p className={styles.title}>انتخاب بر اساس امتیاز</p>
            <section>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} onClick={() => ratingFilterHandler(rating)}>
                  <div>
                    {[...Array(5)].map((star, index) => {
                      return index < rating ? (
                        <FaStar key={index} />
                      ) : (
                        <FaRegStar key={index} />
                      );
                    })}
                  </div>
                  <span>{rating} ستاره</span>
                </div>
              ))}
            </section>
          </div>
          <div className={styles.filter_footer}>
            <button className={styles.close_btn} onClick={toggleMenuFiltering}>
              بستن
            </button>
            <button
              className={styles.reset_btn}
              onClick={deleteFilterHandler}
            >
              حذف فیلتر
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Filtering;
