import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
type Props = {
    showBelow: number
}

const Scroll = ({ showBelow }: Props) => {

    // To determine wether or not should we show the (scrollToTop) button
    const [show, setShow] = useState<boolean>(showBelow ? false : true);
    // If no number provided in the `showBelow` property, then set the `show` state to always true

    const handleScroll = () => {
        if (window.scrollY > showBelow) {
            if (!show) setShow(true);
        }
        else {
            if (show) setShow(false);
        }
    }

    useEffect(() => {
        if (showBelow) {
            window.addEventListener("scroll", handleScroll);
            // cleanup function 👇
            return () => window.removeEventListener("scroll", handleScroll);
        }
    });


    const handleClick = () => {
        window["scrollTo"]({ top: 0, behavior: "smooth" });
    }

    return (
        <div>
            {show && (
                    <IconButton
                        onClick={handleClick}
                        sx={{
                            zIndex: 2,
                            position: "fixed",
                            bottom: "2vh",
                            right: "3%",
                            backgroundColor: "#DCDCDC",
                            color: "black",
                            "&:hover, &.Mui-focusVisible": {
                                transition: "0.3s",
                                color: "#DCDCDC",
                                // backgroundColor: "#DCDCDC",
                                backgroundColor: "#397BA6",
                            }
                        }}
                    >
                        <ExpandLessIcon />
                    </IconButton>
                )}
        </div>
    )
}

export default Scroll