import React, { useState, useEffect } from 'react'

import {
    ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs,
    Container, Box, Text, Button, ButtonGroup, Tooltip,
    Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar,
    Drawer, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody,
    Input,
    toast,
    Spinner,
    Flex
}
    from "@chakra-ui/react";

// import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/toast";

// ----- MUI Icons ---------------
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// --------- Our Components: ----------------
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from '../UserAvatar/UserListItem';
import ChannelListItem from '../UserAvatar/ChannelListItem';

// React Notification Badge 
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

// ------------------ Redux ---------------------------
import { LoginState } from "../../../store/slices/loginSlice";
import { ChatState, setSelectedChat, setChats } from "../../../store/slices/chatSlice";
import { NotificationState, setNotificationsList } from "../../../store/slices/notificationSlice";
import { RootState } from "../../../store/index";
import { useDispatch, useSelector } from 'react-redux';
// ------------------ My Custom Hook to return the login state: ---------------------------
import useAuth from '../../../store/hooks/useAuth';

import axiosInstance from "../../../api/axios";
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import { updateLastSeenMessageId, getMyCustomTime } from "../utils/ChatLogics";


type Props = {
    isOpen: any,
    onOpen: any,
    onClose: any
}

const SideDrawer = ({ isOpen, onOpen, onClose }: Props) => {

    const authState: LoginState = useAuth(); //returns `state.login` from our redux store
    const dispatch = useDispatch(); // for updating redux state `selectedChat`

    const chatState: ChatState = useSelector((state: RootState) => state.chat);
    const { notificationsList }: any = useSelector((state: RootState) => state.notification);

    // const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();


    const [search, setSearch] = useState("");

    const [usersSearchResult, setUsersSearchResult] = useState([]);
    const [channelsSearchResult, setChannelsSearchResult] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const [employeeData, setEmployeeData] = useState<any>({});

    const getEmployeeRecord = () => {
        axiosInstance().get("employee").then((response) => {
            const { email, avatar } = response.data.employeeRecord;
            setEmployeeData({ ...employeeData, email, avatar });
            console.log(email, avatar);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        getEmployeeRecord();
    }, [])

    const handleSearch = async () => {
        const { chats } = chatState;
        if (!search) {
            toast({
                title: "Please Enter something in search field",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);
            // ------ Now search for all users satisfying the query string ----
            const { data } = await axiosInstance().get(`chat-user?search=${search}`);
            setUsersSearchResult(data.result);
            // ----- Now search for channels satisfying the query string ----
            const matchingChats = chats.filter(
                (ch: any) => {
                    const queryChannel = search.toLowerCase();
                    const currentChannel = ch["channel.name"].toLowerCase();
                    if (ch["channel.isGroup"] && currentChannel.indexOf(queryChannel) !== -1)
                        return ch;
                }
            )
            setChannelsSearchResult(matchingChats);
            setLoading(false);
            console.log(data.result);
            console.log(matchingChats);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    const createOrAccessDirectChannel = async (userId: any) => {
        const { selectedChat, chats } = chatState;

        try {
            console.log("userId: " + userId);
            setLoadingChat(true);
            const { data } = await axiosInstance().post(`chat`, {
                userId
            });
            const theChosenChat = data.selectedChat;
            console.log("theChosenChat: ", theChosenChat);

            // --- Only add the new chat if it is not already in my chats list --------
            if (!chats?.find((c: any) => c["channel.id"] == theChosenChat.channelId)) {
                // then there was no direct messages between me and the clicked person:
                // console.log(chatState?.chats);
                // Create a new chat/channel between me and him, then append it to the chats state:
                dispatch(setChats([...chats, theChosenChat]));
            }
            // -------------------------------------
            dispatch(setSelectedChat(theChosenChat));
            // ---- For me, set the `lastSeenMessageId` 👀 to the latestMessageId on this chat: 
            // await axiosInstance().patch(`message/setIsSeen`, {
            //     channelId: theChosenChat.channelId,
            //     memberId: authState.user.employeeId
            // });
            await updateLastSeenMessageId(theChosenChat.channelId, authState.user.employeeId);
            setLoadingChat(false);
            // onClose(); //close the SideDrawer
        }
        catch (error: any) {
            toast({
                title: "Error fetching the chat!",
                description: error.message,
                status: "error",
                duration: 15000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessGroupChannel = async (channelId: any) => {
        const { selectedChat, chats } = chatState;

        try {
            console.log("channelId: " + channelId);
            setLoadingChat(true);
            const theChosenChat = chats?.find((myChat: any) => myChat.channelId === channelId)
            dispatch(setSelectedChat(theChosenChat));
            // ---- For me, set the `lastSeenMessageId` 👀 to the latestMessageId on this chat: 
            // await axiosInstance().patch(`message/setIsSeen`, {
            //     channelId: theChosenChat.channelId,
            //     memberId: authState.user.employeeId
            // });
            await updateLastSeenMessageId(theChosenChat.channelId, authState.user.employeeId);
            setLoadingChat(false);
        }
        catch (error: any) {
            toast({
                title: "Error fetching the group chat!",
                description: error.message,
                status: "error",
                duration: 15000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }


    // --------------- Functions Components for Rendering ---------------
    const ShowUsersSearchResult = (): any => {
        return (
            usersSearchResult?.map((user: any) => {
                return (
                    <UserListItem
                        key={user.id}
                        user={user}
                        handleFunction={() => createOrAccessDirectChannel(user.id)}
                    />
                )
            })
        )
    }

    const ShowChannelsSearchResult = (): any => {
        return (
            channelsSearchResult?.map((ch: any, index: number) => {
                return (
                    <ChannelListItem
                        key={ch.channelId}
                        channel={ch}
                        handleFunction={() => accessGroupChannel(ch.channelId)}
                    />
                )
            })
        )
    }
    // --------------- End Functions Components for Rendering ---------------

    const handleNotificationItemClick = async (notif: any) => {
        // Go to the chat:
        const matchingChat: any = chatState.chats.find(
            (ch: any) => ch.channelId == notif.channelId
        );
        dispatch(
            setSelectedChat(matchingChat)
        );
        // Update my `lastSeenMessageId` to indicate that I have seen all new messages on the chat to which I am about to navigate:
        await updateLastSeenMessageId(notif?.channelId, authState?.user?.employeeId);
        // Remove the notification from the list:
        const updatedList = notificationsList.filter(
            (n: any) => n !== notif
        );
        dispatch(
            setNotificationsList(updatedList)
        );
    }

    // ----- Function Component for rendering ------------
    const NotifItem = ({ notif }: any) => {
        return (
            <>
                <Text fontSize='sm' style={{ color: "#A0AEC0" }}>
                    {getMyCustomTime(notif.createdAt)}
                </Text>
                {notif.isGroup
                    ? (
                        <Text>
                            new message in <strong>{notif.name}</strong>
                        </Text>
                    )
                    : (
                        <Text>
                            new message from <strong>{notif.fullName}</strong>
                        </Text>
                    )}
            </>
        )
    }

    return (
        <>
            {/* ------ This Box contains the Navbar 👇 ------ */}
            <Box
                d="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Box>
                    <Tooltip label="Search users or groups to chat with" hasArrow placement="bottom-end">
                        <Button variant="ghost" onClick={onOpen}>
                            {/* When clicked, the Drawer will be opened */}
                            <SearchIcon />
                            <Text d={{ base: "none", md: "flex" }} px="4">
                                Find User or Group
                            </Text>
                        </Button>
                    </Tooltip>
                </Box>

                <Text fontSize="2xl">
                    Flawless Chat
                </Text>


                <Box
                    d="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{gap: "10px"}}
                >
                    {/* Dropdown Menu for Notifications 👇 */}
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notificationsList?.length}
                                effect={Effect.SCALE}
                            />
                            <NotificationsIcon sx={{ fontSize: "1.5rem", m: 1 }} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notificationsList.length && "No New Messages"}
                            {notificationsList?.map((notif: any) => (
                                <>
                                    <MenuItem
                                        key={notif.messageId}
                                        onClick={() => handleNotificationItemClick(notif)}
                                    >
                                        <Flex flexDir="column" style={{ gap: "1px" }}>
                                            <NotifItem notif={notif} />
                                        </Flex>
                                    </MenuItem>
                                    <MenuDivider />
                                </>
                            ))}
                        </MenuList>
                    </Menu>


                    {/* Dropdown Menu for options 👇 */}
                    <Menu>
                        <MenuButton as={Button} rightIcon={<KeyboardArrowDownIcon />}>
                            {/* <Avatar
                            size="sm"
                            cursor="pointer"
                            name={authState.user.fullName}
                            src={`${employeeData?.avatar !== null && `${process.env.REACT_APP_UPLOADS_URL}avatars/${employeeData.avatar}`}`}
                            alt={authState.user.fullName}
                        /> */}
                        </MenuButton>
                        <MenuList>
                            <ProfileModal authState={authState}>
                                <MenuItem>My profile</MenuItem>
                            </ProfileModal>
                            {/* <MenuDivider /> */}
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            {/* -------- Drawer for "Search User" ---------------- */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Find Users or Groups
                    </DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" pb={2}>
                            <Input
                                placeholder="name, username, or email"
                                mr={2}
                                value={search}
                                onChange={(e: any) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) :
                            usersSearchResult?.length === 0
                                && channelsSearchResult?.length === 0
                                ? (
                                    <span>No matching results</span>
                                ) :
                                (
                                    // usersSearchResult?.map((user: any) => {
                                    //     return (
                                    //         <UserListItem
                                    //             key={user.id}
                                    //             user={user}
                                    //             handleFunction={() => createOrAccessDirectChannel(user.id)}
                                    //         />
                                    //     )
                                    // })
                                    <>
                                        <ShowUsersSearchResult />
                                        <ShowChannelsSearchResult />
                                    </>
                                )
                        }
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer