import React from 'react'
// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/index";
import { setSelectedChat, setChats, ChatState } from "../../store/slices/chatSlice";
import { LoginState } from "../../store/slices/loginSlice";

import useAuth from "../../store/hooks/useAuth";


import axiosInstance from "../../api/axios";
// -------------- CSS ----------
import "./css/MyChat.css";

import {
  ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs,
  Container, Box, Text, Button, ButtonGroup, Tooltip,
  Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar,
  Drawer, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody,
  Input,
  toast,
  Spinner,
  Stack, useToast
}
  from "@chakra-ui/react";

import AddIcon from '@mui/icons-material/Add';

import ChatLoading from "./miscellaneous/ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

// ----------- Util functions -----------
import { isObjectEmpty, getSender, updateLastSeenMessageId } from "./utils/ChatLogics";

const MyChats = ({ fetchAgain }: any) => {

  const authState: LoginState = useAuth();
  const chatState: ChatState = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const toast = useToast();


  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance().get("chat");
      dispatch(setChats(data.myChannels));
      console.log(data.myChannels);
    }
    catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load your chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  React.useEffect(() => {
    fetchChats();
  }, [fetchAgain]);



  return (
    <Box
      d={{ base: isObjectEmpty(chatState.selectedChat) ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "22px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatState.chats ? (
          <Stack overflowY="auto">
            {
              chatState.chats.map((chat: any) => (
                <Box
                  onClick={async () => {
                    dispatch(setSelectedChat(chat));
                    await updateLastSeenMessageId(chat.channelId, authState.user.employeeId);
                  }}
                  cursor="pointer"
                  bg={chatState?.selectedChat["channelId"] == chat["channel.id"] ? "#38B2AC" : "#E8E8E8"}
                  color={chatState?.selectedChat["channelId"] == chat["channel.id"] ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat["channel.id"]}
                >
                  <Text>
                    {chat["channel.isGroup"] == false
                      ? getSender(chat, authState)
                      : chat["channel.name"]
                    }
                  </Text>
                </Box>
              ))
            }
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats