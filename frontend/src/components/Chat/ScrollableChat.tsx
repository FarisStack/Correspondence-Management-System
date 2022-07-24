import { useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { Box, useDisclosure } from "@chakra-ui/react";

import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "./utils/ChatLogics";
import { getMyCustomTime, getMyCustomDate, getMyCustomDateTime } from "../Workflow/utils/helpers";

import MessageModal from "./miscellaneous/MessageModal";
import axiosInstance from "../../api/axios";


// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/index";
import { setSelectedChat, setChats } from "../../store/slices/chatSlice";

import useAuth from "../../store/hooks/useAuth";



const ScrollableChat = ({ messages }: any) => {

    const authState = useAuth();
    const myId = authState.user.employeeId;
    const chatState = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure(); //for the MessageModal


    // ----- States for thr MessageModal -----
    const [seeners, setSeeners] = useState<any[]>([]);
    const [clickedMessage, setClickedMessage] = useState<any>({});


    const getTime = (message: any) => {
        const d = new Date(message);
        return d?.getHours();
    }

    const getWhoSawThisMessage = (msgId: number) => {
        const { selectedChat } = chatState; // redux state

        console.log("**channelId: ", selectedChat.channelId);
        console.log("**messageId: ", msgId);

        axiosInstance().get(
            `chat-user/seenBy?channelId=${selectedChat.channelId}&messageId=${msgId}`
        ).then((response) => {
            const seeners: any = response.data.seeners;
            setSeeners(seeners);
            console.log("SEENERS: ", seeners);
        }).catch((error) => console.log(error));
    }

    return (
        <>
            <MessageModal
                authState={authState}
                isOpen={isOpen}
                onClose={onClose}
                seeners={seeners}
                message={clickedMessage}
            />
            <ScrollableFeed>
                {messages &&
                    messages.map((m: any, i: number) => (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: isSameUser(messages, m, i) ? 7 : 30,
                                marginBottom: i === messages.length - 1 ? 12 : 0,
                                marginRight: m.senderId == myId ? 2 : 0
                            }}
                            key={m.messageId}
                        >
                            {(isSameSender(messages, m, i, myId) ||
                                isLastMessage(messages, i, myId)) && (
                                    <Tooltip label={m.fullName} placement="bottom-start" hasArrow>
                                        <Avatar
                                            // mt="7px"
                                            mr={1}
                                            size="sm"
                                            cursor="pointer"
                                            name={m.fullName}
                                            src={`${process.env.REACT_APP_UPLOADS_URL}avatars/${m.avatar}`}
                                        />
                                    </Tooltip>
                                )}
                            <Box
                                style={{
                                    backgroundColor: `${m.senderId === myId ? "#BEE3F8" : "#B9F5D0"}`,
                                    marginLeft: isSameSenderMargin(messages, m, i, myId),
                                    // marginTop: isSameUser(messages, m, i) ? 1 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                                    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    getWhoSawThisMessage(m.messageId);
                                    setClickedMessage(m);
                                    onOpen();
                                }}
                            >
                                {/* <Tooltip
                                    label={`${getMyCustomDateTime(m.createdAt)}`}
                                    placement="bottom" hasArrow
                                > */}
                                    {m.content}
                                {/* </Tooltip> */}
                            </Box>
                        </div>
                    ))}
            </ScrollableFeed>
        </>
    );
};

export default ScrollableChat;