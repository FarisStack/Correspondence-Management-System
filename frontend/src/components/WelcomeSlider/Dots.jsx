import React from "react";
import classes from "./Slider.module.css";

function Dots({ activeIndex, onclick, sliderImage }) {
  return (
    <div className={classes["all-dots"]}>
      {sliderImage.map((slide, index) => (
        <span
          key={index}
          className={`${activeIndex === index
            ? `${classes["dot"]} ${classes["active-dot"]}`
            : classes["dot"]}`
          }
          onClick={() => onclick(index)}
        ></span>
      ))}
    </div>
  );
}

export default Dots;
