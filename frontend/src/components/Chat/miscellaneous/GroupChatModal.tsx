import React, { useState } from 'react'

// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../store/index";
import { setSelectedChat, setChats } from "../../../store/slices/chatSlice";

import useAuth from "../../../store/hooks/useAuth";
// ------------- Components ---------------
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
    useToast,
    FormControl,
    Input,
    Box
} from "@chakra-ui/react";

import axiosInstance from "../../../api/axios";


type Props = {}

const GroupChatModal = ({ children }: any) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const chatState = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();


    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGroup = (userToAdd: any) => {
        if (selectedUsers.includes(userToAdd as never)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers as never, userToAdd as never]);
        // console.log([...selectedUsers, userToAdd]);
    };



    const handleDelete = (delUser: any) => {
        setSelectedUsers(selectedUsers.filter((sel: any) => sel.id !== delUser.id));
    };

    const handleSearch = async (query: any) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance().get(`chat-user?search=${search}`);
            setLoading(false);
            setSearchResult(data.result);
            // console.log(data.result);
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
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const { data } = await axiosInstance().post(
                `chat/group`,{
                    name: groupChatName,
                    // users: JSON.stringify(selectedUsers.map((u) => u._id)),
                    membersIDs: selectedUsers.map((user: any) => user.id),
                }
            );
            const myNewGroupChannel = data.myNewGroupChannel;
            dispatch(setChats([myNewGroupChannel, ...chatState.chats]));
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } 
        catch (error: any) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        d="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat's name"
                                mb={3}
                                onChange={(e: any) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: Faris, Ahmad, Sondos"
                                mb={1}
                                onChange={(e: any) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((user: any) => (
                                <UserBadgeItem
                                    key={user.id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user: any) => (
                                    <UserListItem
                                        key={user.id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal