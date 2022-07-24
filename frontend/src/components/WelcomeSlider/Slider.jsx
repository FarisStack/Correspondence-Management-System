import React, { useEffect, useState } from "react";

// ------- Components --------------------------------
import SliderContent from "./SliderContent";
import Dots from "./Dots";
import Arrows from "./Arrows";
import WelcomeDrawer from "./WelcomeDrawer";

import sliderImages from "./sliderImages";
import classes from "./Slider.module.css";

// const len = sliderImages.length - 1;
const len = sliderImages.length;

function Slider(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // setActiveIndex(activeIndex === len ? 0 : activeIndex + 1);
      setActiveIndex((activeIndex + 1) % len);
      console.log("activeIndex: ", (activeIndex + 1) % len);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <>
      <WelcomeDrawer />

      <div className={classes["slider-container"]}>
        <SliderContent activeIndex={activeIndex} sliderImages={sliderImages} />

        <Arrows
          goToPrevSlide={() =>
            setActiveIndex(activeIndex == 0 ? (len - 1) : (activeIndex - 1) % len)
          }
          goToNextSlide={() =>
            setActiveIndex((activeIndex + 1) % len)
          }
        />

        <Dots
          activeIndex={activeIndex}
          sliderImage={sliderImages}
          onclick={(clickedDotIndex) => setActiveIndex(clickedDotIndex)}
        />


        <div className={classes["sliderr"]}></div>
      </div>
    </>
  );
}

export default Slider;
