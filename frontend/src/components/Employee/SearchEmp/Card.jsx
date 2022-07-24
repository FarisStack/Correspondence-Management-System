import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
// ------------------ Icons ---------------------
import WcIcon from '@mui/icons-material/Wc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CakeIcon from '@mui/icons-material/Cake';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
// ------------------- End Icons ----------------------------
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from '@mui/material/Tooltip';
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
// import InformationPage from "../UpdateEmpInfo/InfoPage";
import { Link, useNavigate } from "react-router-dom";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function Cards({ data }) {

    const navigate = useNavigate();

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function getAge(bDate) {
        const birthDate = new Date(bDate);
        const birthYear = birthDate.getFullYear();
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();

        let years = currentYear - birthYear;

        const birthMonth = birthDate.getMonth();
        const currentMonth = currentDate.getMonth();

        if (currentMonth < birthMonth && birthYear < currentYear) {
            years = years - 1;
        }
        const months = 12 - Math.abs(birthMonth - currentMonth);
        
        return `${years} years, ${months} months`;
    }

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: data.avatar ? "none" : red[500],
                            height: "80px",
                            width: "80px",
                        }}
                        size="large"
                        aria-label="user-avatar"
                    >
                        {data.avatar ? (
                            <img src={`${process.env.REACT_APP_UPLOADS_URL}avatars/${data.avatar}`} />)
                            : (data.firstName[0] + data.lastName[0])
                        }
                    </Avatar>
                }
                title={data.firstName + " " + data.middleName + " " + data.lastName}
                titleTypographyProps={{
                    fontSize: "1.1rem",
                    fontWeight: "bold"
                }}
                subheader={getAge(data.birthDate)}
                subheaderTypographyProps={{}}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
            />

            <CardContent>
                <Divider />

                {/* <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={data.firstName + " " + data.middleName + " " + data.lastName}
                    />
                </ListItem> */}

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Email" arrow>
                            <Avatar>
                                <EmailIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.email} />
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Phone number" arrow>
                            <Avatar>
                                <LocalPhoneIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.phoneNumber} />
                </ListItem>


                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Gender" arrow>
                            <Avatar>
                                <WcIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.gender} />
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Marital status" arrow>
                            <Avatar>
                                <FavoriteIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.maritalStatus} />
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="City" arrow>
                            <Avatar>
                                <LocationCityIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.city} />
                </ListItem>



                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Hire date" arrow>
                            <Avatar>
                                <CalendarMonthIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.hireDate} secondary={getAge(data.hireDate)}/>
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Date of birth" arrow>
                            <Avatar>
                                <CakeIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.birthDate} secondary={getAge(data.birthDate)}/>
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Status" arrow>
                            <Avatar>
                                <PrivacyTipIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.userStatus} />
                </ListItem>

                <ListItem>
                    <ListItemAvatar>
                        <Tooltip title="Privilege" arrow>
                            <Avatar>
                                <MilitaryTechIcon />
                            </Avatar>
                        </Tooltip>
                    </ListItemAvatar>
                    <ListItemText primary={data.role} />
                </ListItem>

                <Divider />
            </CardContent>

            <CardActions>
                <Button
                    color="primary"
                    variant="text"
                    onClick={() => navigate(`/manage-employee-positions/${data.id}`)}
                >
                    Manage Positions
                </Button>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit></Collapse>
        </Card>
    );
}
