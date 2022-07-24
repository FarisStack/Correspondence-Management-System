import React, { useState } from "react";
import classes from "../css/PersonalPage.module.css";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';

// -------------- Our Components: --------------------
import InformationPage from "./InfoPage";
import ChangePassword from "./ChangePassword";
import TableOfEmpPositions from "./TableOfEmpPositions";
// -------------- End Our Components -------------------

import axiosInstance from "../../../api/axios";

// ---------- Redux Toolkit My Store -----------
import useAuth from '../../../store/hooks/useAuth';

// ----- This is the Component for the Image (Avatar) Upload -----------
const ImgUpload = ({ uploadPhoto, src, updateModeEnabled }) => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label
            htmlFor="photo-upload"
            className={`${classes["custom-file-upload"]} fas`}
        >
            <div
                className={`${classes["img-wrap"]} ${classes["img-upload"]} fa  fa-upload`}
            >
                <img src={src} />
            </div>
            <input
                id="photo-upload"
                type="file"
                onChange={uploadPhoto}
                disabled={!updateModeEnabled}
            />
        </label>
    </div>
);


const PersonalPage = () => {

    const authState = useAuth(); //returns `state.login` from our redux store

    const [updateModeEnabled, setUpdateModeEnabled] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    // -------- States for the <ImgUpload /> Component:
    const [newAvatarFile, setNewAvatarFile] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState(
        "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
    );

    const uploadPhoto = (e) => {
        e.preventDefault();

        const reader = new FileReader();
        const tempFile = e.target.files[0];
        setNewAvatarFile(tempFile);

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(tempFile);

        // We will not upload the avatar to the server now. 
        // The avatar is uploaded when the user clicks the "update" button.
        // This gives him the opportunity to only preview the new image without uploading it.
    };
    const closeChangePasswordPage = () => {
        setModalIsOpen(false);
    };
    const openChangePasswordPage = () => {
        setModalIsOpen(true);
    };

    return (
        <div className={classes.card}>
            <ImgUpload
                uploadPhoto={uploadPhoto}
                src={imagePreviewUrl}
                updateModeEnabled={updateModeEnabled}
            />
            <InformationPage
                imagePreviewUr={imagePreviewUrl}
                setImagePreviewUrl={setImagePreviewUrl}
                updateModeEnabled={updateModeEnabled}
                setUpdateModeEnabled={setUpdateModeEnabled}
                newAvatarFile={newAvatarFile}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                className={classes["info-page"]}
            />

            <Divider sx={{margin: "20px 0px"}}/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button
                    color="primary"
                    variant="contained"
                    // className={classes.button}
                    onClick={openChangePasswordPage}
                >
                    Change password
                </Button>
            </div>
            <Divider sx={{margin: "20px 0px"}}/>
            {modalIsOpen && (
                <ChangePassword
                    onClose={closeChangePasswordPage}
                    getPassword={"123456789"}
                />
            )}

            <h2 style={{textAlign: "center"}}>My Current Assigned Positions</h2>

            <TableOfEmpPositions
                // updateModeEnabled={updateModeEnabled}
                employeeId={authState?.user?.employeeId}
                isAdmin={authState?.user?.role == "admin"}
            />
        </div>
    );
};
export default PersonalPage;
