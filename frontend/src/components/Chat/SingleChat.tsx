import React, { useState, useEffect } from 'react'


// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/index";
import { setSelectedChat, setChats, ChatState } from "../../store/slices/chatSlice";
import { setNotificationsList, NotificationState } from "../../store/slices/notificationSlice";

import useAuth from "../../store/hooks/useAuth";

import {
    ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs,
    Container, Box, Text, Button, ButtonGroup, Tooltip,
    Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar,
    Drawer, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody,
    Input,
    toast,
    Spinner,
    Stack, useToast, IconButton, FormControl
}
    from "@chakra-ui/react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// ----------- Our Components ---------------------------
import SenderProfileModal from './miscellaneous/SenderProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from "./ScrollableChat";
// ---------- LottieFiles (Animations) -------------
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

// ----------- CSS ---------------------------
import "./css/SingleChat.css";
// ---------- Socket.io ---------------
import io, { Socket } from "socket.io-client";

// ----------- Util functions -----------
import { getSender, updateLastSeenMessageId } from "./utils/ChatLogics";

import axiosInstance from "../../api/axios";


type Props = {}

const ENDPOINT = process.env.REACT_APP_SERVER || "ws://localhost:5000/";
let socket: Socket;
let selectedChatCompare: any;

const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
    const authState = useAuth();
    const chatState: ChatState = useSelector((state: RootState) => state.chat);
    // const notificationsList: any[] = useSelector((state: RootState) => state.notification.notificationsList);
    const notificationState: NotificationState = useSelector((state: RootState) => state.notification);

    const dispatch = useDispatch();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [meTyping, setMeTyping] = useState(false);
    const [someoneIsTyping, setSomeoneIsTyping] = useState(false);
    // const [clickedMessageId, setClickedMessageId] = useState(-1);

    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    // The placement of useEffect() functions must be as following:
    useEffect(() => {
        socket = io(ENDPOINT); // initialize the socket variable
        socket.emit("setup", authState?.user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setSomeoneIsTyping(true));
        socket.on("stop typing", () => setSomeoneIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        // 👇 Just to keep a backup of whatever the selected chat state is, so we can compare it and accordingly we can decide whether we are supposed to emit the message or we are supposed to give a notification to the user.
        selectedChatCompare = chatState.selectedChat;
    }, [chatState.selectedChat]);

    useEffect(() => {
        const { selectedChat } = chatState;
        // This useEffect will run every time our state updates.
        // So this is not a normal useEffect that runs one time. 
        socket.on("message received", (newMessageReceived) => {
            const { notificationsList } = notificationState;

            if (!selectedChatCompare ||
                selectedChatCompare["channel.id"] !== newMessageReceived.channelId
            ) {
                // then the received message is for a channel other than the channel which the user currently selecting, so we have to send him a notification.
                // TODO: send notification
                if (!notificationsList?.find(
                    (item: any) => item?.channelId == newMessageReceived.channelId
                )
                ) {
                    // console.log("I will add to notifications list: ");
                    // console.log([...notificationsList, newMessageReceived]);
                    dispatch(
                        setNotificationsList([newMessageReceived, ...notificationsList])
                    );
                    // No we have to update the chatState.chats list, so that when the user
                    // clicks on the notification and navigates him to the chat, he should see the chat updated and the new received message added:
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                // then the channel opened by the user is the same as the channel on which the new message received on, so no need for notification. Just update the UI:
                setMessages([...messages as never, newMessageReceived as never]);
                // You have seen the message. So, update your `lastSeenMessageId`:
                const setIsSeen = async () => {
                    await updateLastSeenMessageId(newMessageReceived.channelId, authState.user.employeeId);
                }
                setIsSeen().catch(console.error);
            }
        });
    });



    const getSenderFull = (chat: any) => {
        const sender = chat?.members?.find(
            (member: any) => member.memberId != authState.user.employeeId
        );
        return sender;
    }

    function isObjectEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    const fetchMessages = async () => {
        // Now after the chat was selected, Fetch all messages of the currently selected chat/channel:
        const { selectedChat } = chatState;

        if (!selectedChat || isObjectEmpty(selectedChat)) return;

        try {
            setLoading(true);
            const { data } = await axiosInstance().get(`message/${selectedChat.channelId}`);
            // console.log("**fetchMessages: ", data.messages);
            setMessages(data.messages);
            setLoading(false);
            // Fire the event "join chat" and pass the selectedChat's ID:
            socket.emit("join chat", selectedChat["channelId"]);
        }
        catch (error) {
            toast({
                title: "Error Occurred!",
                description: `Failed to Load the Messages for chat: ${selectedChat["channel.name"]}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event: any) => {
        const { selectedChat } = chatState;
        if (event.key === "Enter" && newMessage) {
            // don't forget to emit the "stop typing" event:
            socket.emit("stop typing", selectedChat.channelId);
            try {
                setNewMessage(""); //this will not affect the api call below.
                const { data } = await axiosInstance().post(
                    "message",
                    {
                        content: newMessage,
                        chatId: selectedChat["channelId"],
                    });
                socket.emit("new message", {
                    newMessageReceived: data?.message,
                    targetChat: data?.targetChat,
                });
                // console.log("SENT MESSAGE: ", newMessage, selectedChat["channelId"]);
                // console.log(data.message);
                setMessages([...messages as never, data.message as never]);
            }
            catch (error: any) {
                console.log(error);
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e: any) => {
        const { selectedChat } = chatState;
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!meTyping) {
            setMeTyping(true);
            socket.emit("typing", selectedChat.channelId);
        }

        // Once the user stops typing, wait 3 seconds then set the isTyping to false:
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && meTyping) {
                socket.emit("stop typing", selectedChat.channelId);
                setMeTyping(false);
            }
        }, timerLength);
    };


    return (
        <>
            {chatState.selectedChat
                ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            width="100%"
                            d="flex"
                            flexDir="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <IconButton
                                aria-label='back'
                                d={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => dispatch(setSelectedChat({}))}
                            />
                            {
                                !isObjectEmpty(chatState.selectedChat)
                                    && !chatState.selectedChat["channel.isGroup"]
                                    ? (
                                        <>
                                            {getSender(chatState.selectedChat, authState)}
                                            <SenderProfileModal
                                                user={getSenderFull(chatState.selectedChat)}></SenderProfileModal>
                                        </>
                                    ) : (
                                        <>
                                            {chatState.selectedChat["channel.name"]}
                                            <UpdateGroupChatModal
                                                fetchMessages={fetchMessages}
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                            />
                                        </>
                                    )}
                        </Text>
                        {/* messages here 👇 */}
                        <Box
                            d="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <div className="messages">
                                    <ScrollableChat
                                        messages={messages}
                                    // clickedMessageId={clickedMessageId}
                                    // setClickedMessageId={setClickedMessageId}
                                    />
                                </div>
                            )}

                            <FormControl
                                onKeyDown={sendMessage}
                                id="message-content"
                                isRequired
                                mt={3}
                            >
                                {someoneIsTyping ? (
                                    <div>
                                        <Lottie
                                            options={defaultOptions}
                                            // height={50}
                                            width={70}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                )
                : (
                    // to get socket.io on same page
                    <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )}
        </>
    )
}

export default SingleChat