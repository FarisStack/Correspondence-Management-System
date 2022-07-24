import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link, } from 'react-router-dom'
// ------------ React Router Dom -------------------
import { useNavigate } from "react-router-dom"
// ---------------- CSS ---------------------
import UnauthorizedCSS from "./css/others.module.css"
type Props = {}

const Unauthorized: FC<Props> = (props: Props) => {

    const navigate = useNavigate();

    // const StyledDiv = styled.div`
    //     height: 100vh;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    //     align-items: center;
    //     /* width: 400px; */
    //     /* border: 1px solid #ccc; */
    //     /* margin: 50px auto; */
    // `;
    // const StyledH1 = styled.h1`
    //     color: ${(props) => props.color}; //take advantage of props passed to the component
    //     margin-bottom: 10px
    // `;
    // const DivGoBack = styled.div`
    //     /* flex-grow: 1; */
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    // `;
    // const ButtonGradient = styled.button`
    //     background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    //     border: 0;
    //     border-radius: 3;
    //     box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3);
    //     color: white;
    //     height: 48;
    //     padding: 10px 30px;
    //     margin: 10px 0;
    //     cursor: pointer;
    //     border-radius: 4px;
    //     transition: all 2s ease-in-out;
    //     :hover {
    //         width: 80%;
    //         transition: all 2s ease-in-out;
    //     }
    // `;

    const goBack = () => navigate(-1); // It will just go back to where you came from

    return (
        <section className={UnauthorizedCSS.container}>
            <h1 className={UnauthorizedCSS.h1}>Unauthorized Access ❌🔏</h1>
            <p className={UnauthorizedCSS.p}>Access to the requested page requires permissions that you currently don't have</p>
            <div className={UnauthorizedCSS.options}>
                <button className={UnauthorizedCSS.btnGoBack} onClick={goBack}>Go Back</button>
            </div>
        </section>
    );
}
export default Unauthorized;