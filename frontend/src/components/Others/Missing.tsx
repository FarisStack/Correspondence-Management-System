import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
// ------------ React Router Dom -------------------
import { Link, useNavigate } from "react-router-dom"
// ---------------- CSS ---------------------
import NotFoundCSS from "./css/others.module.css"
type Props = {}

const Missing: FC<Props> = (props: Props) => {

    const navigate = useNavigate();
    const goBack = () => navigate(-1); // It will just go back to where you came from

    const StyledDiv = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* width: 400px; */
        /* border: 1px solid #ccc; */
        margin: 50px auto;
    `;
    const StyledH1 = styled.h1`
        color: ${(props) => props.color};
    `;

    return (
        <section className={NotFoundCSS.container}>
            <h1 className={NotFoundCSS.h1}>Oops!</h1>
            <p className={NotFoundCSS.pageNotFound}>404 | Page Not Found 🤕</p>
            <div className={NotFoundCSS.options}>
                <button className={NotFoundCSS.btnGoBack} onClick={goBack}>Go Back</button>
                <button className={NotFoundCSS.btnGoBack}>
                    <Link to="/">Return to Home</Link>
                </button>
            </div>
        </section>
    );
}
export default Missing;