import React from "react";
import classes from "./Slider.module.css";

function SliderContent({ activeIndex, sliderImages }) {
  return (

    <section className={classes["section"]}>
      {sliderImages.map((slide, index) => (
        <div
          key={index}
          className={index === activeIndex ? classes["slides active"] : classes["inactive"]}
        >
          <img className={classes["slide-image"]} src={slide.urls} alt="" />
          <h2 className={classes["slide-title"]}>{slide.title}</h2>
          <h3 className={classes["slide-text"]}>{slide.description}</h3>
        </div>
      ))}
    </section>
  );
}

export default SliderContent;
