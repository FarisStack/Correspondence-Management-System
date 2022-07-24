import React, { useEffect, useState } from 'react'
import axiosInstance from "../../api/axios";
// import ChatProvider from "./Context/ChatProvider";
// ----------------- Chakra Components -----------------
import {
  ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs,
  Container, Box, Text, Button, ButtonGroup
}
  from "@chakra-ui/react";
// ----------------- Our Components -----------------
import SideDrawer from "./miscellaneous/SideDrawer";
import MyChats from "./MyChats";
import Chatbox from "./ChatBox";
// ---- For the SideDrawer ------------
import { useDisclosure } from "@chakra-ui/hooks";

// ---------------- CSS ---------------------
import classes from "./css/ChatPage.module.css";


// ------------------ Redux ---------------------------
import { IEmployeePositionObj, LoginState, logoutUser } from "../../store/slices/loginSlice";
import { setSnackbar, ISeverity } from "../../store/slices/snackbarSlice";
import { RootState } from "../../store/index";
import { useDispatch, useSelector } from 'react-redux';
// ------------------ My Custom Hook to return the login state: ---------------------------
import useAuth from '../../store/hooks/useAuth';
// ------------------ React-router-dom ---------------------------
import { useNavigate } from "react-router-dom"


type Props = {}

const ChatPage = (props: Props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [fetchAgain, setFetchAgain] = useState(false);


  return (
    <ChakraProvider>
      <div
        className={classes.chatPage}
        // style={{ width: isOpen ? "103%" : "100%" }}
      >
        <SideDrawer
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          <MyChats fetchAgain={fetchAgain} />
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Box>
      </div>
    </ChakraProvider>
  )
}

export default ChatPage