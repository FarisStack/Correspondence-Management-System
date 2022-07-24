import React from "react";
import classes from "./Slider.module.css";

function Arrows({ goToPrevSlide, goToNextSlide }) {
  return (
    <div className={classes["arrows"]}>
      <span className={classes["prev"]} onClick={goToPrevSlide}>
        &#10094;
      </span>
      <span className={classes["next"]} onClick={goToNextSlide}>
        &#10095;
      </span>
    </div>
  );
}

export default Arrows;
