import React from 'react'
import { Box } from "@chakra-ui/layout";
import { useToast } from '@chakra-ui/react';

// import "./css/styles.css";
import SingleChat from "./SingleChat";


// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/index";
import { setSelectedChat, setChats } from "../../store/slices/chatSlice";

import useAuth from "../../store/hooks/useAuth";

// ----------- Util functions -----------
import { isObjectEmpty } from "./utils/ChatLogics";

const ChatBox = ({ fetchAgain, setFetchAgain }: any) => {

  const toast = useToast();
  const chatState = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  return (
    <Box
      // d={{ base: chatState.selectedChat ? "flex" : "none", md: "flex" }}
      d={{ base: isObjectEmpty(chatState.selectedChat) ? "none" : "flex", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox