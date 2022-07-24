import Paper from '@mui/material/Paper';
import React, { useState, useRef, useEffect, MutableRefObject, LegacyRef } from 'react'
// --------------------- CSS ------------------
import classes from "./css/Collapsible.module.css";

type Props = {
    label: string;
    children: any;
}

const Collapsible = ({ label, children }: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [contentParentHeight, setContentParentHeight] = useState<number>(200);

    const parentRef = useRef<HTMLDivElement | null>(null);

    // if (parentRef.current) {
    //     console.log(parentRef);
    //     console.log(parentRef.current.scrollHeight);
    // }

    useEffect(() => {
        const sHeight: number = Number(parentRef?.current?.scrollHeight);
        setContentParentHeight(sHeight);
    }, [parentRef?.current?.scrollHeight])

    return (
        <Paper className={classes.collapsible}>
            <button
                className={classes.toggle}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
            </button>
            <div
                className={classes["content-parent"]}
                ref={parentRef}
                // style={isOpen ?
                //     { maxHeight: "1000px", marginTop: "20px" } :
                //     { maxHeight: "0px" }}
                // style={isOpen ?
                //     { height: `${contentParentHeight}px`, marginTop: "20px" } :
                //     { height: "0px" }}
                style={isOpen ?
                    { height: "550px", marginTop: "20px" } :
                    { height: "0px" }
                }
            >
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Paper>
    )
}

export default Collapsible