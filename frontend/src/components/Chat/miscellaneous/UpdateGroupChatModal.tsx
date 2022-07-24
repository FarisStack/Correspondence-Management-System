import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

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
    FormControl,
    Input,
    useToast,
    Box,
    IconButton,
    Spinner,
    Tooltip
} from "@chakra-ui/react";

import axiosInstance from "../../../api/axios";

// ----------------- ConfirmDialog Slice -----------------
import { setConfirmDialog } from "../../../store/slices/confirmDialogSlice";

import { useState } from "react";

// ------------ Components ----------------------
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import ConfirmDialog from "./ConfirmDialog";

// ------------------ Redux ---------------------------
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../store/index";
import { setSelectedChat, setChats } from "../../../store/slices/chatSlice";

import useAuth from "../../../store/hooks/useAuth";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }: any) => {

    const authState = useAuth();
    const chatState = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    // const [userToBeRemoved, setUserToBeRemoved] = useState<any>(null);
    const [callbackFn, setCallbackFn] = useState<Function>(() => console.log("function"));

    const toast = useToast();


    const handleSearch = async (query: any) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]); //if the input field is clear, then clear the list of matching results.
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance().get(`chat-user?search=${search}`);
            setLoading(false);
            setSearchResult(data.result);
            console.log(data.result);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const { data } = await axiosInstance().put(
                `chat/rename`, {
                chatId: chatState.selectedChat["channel.id"],
                chatNewName: groupChatName,
            });

            console.log(data?.chat);
            // update the redux state (chatState.selectedChat):
            dispatch(
                setSelectedChat({ ...chatState.selectedChat, ["channel.name"]: groupChatName })
            );
            setFetchAgain(!fetchAgain); //this will trigger the useEffect in MyChats.tsx which will result in updating the chatState.chats

            setRenameLoading(false);
        } catch (error: any) {
            toast({
                title: "Error Occurred!",
                description: error?.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (userToAdd: any) => {
        if (chatState.selectedChat.members.find((u: any) => u.id === userToAdd.id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (chatState.selectedChat.admin.memberId !== authState.user.employeeId) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await axiosInstance().put(
                `chat/groupadd`,
                {
                    chatId: chatState?.selectedChat["channel.id"],
                    userId: userToAdd.id,
                }
            );
            const { newlyAddedUser } = data;

            // I want to update the redux state chatState.selectedChat to show the new member:
            // ㊗️㊗️㊗️㊗️㊗️㊗️㊗️㊗️

            // update the redux state (chatState.selectedChat):
            let { selectedChat } = chatState;
            dispatch(
                setSelectedChat({
                    ...selectedChat,
                    members: [...selectedChat.members, newlyAddedUser]
                })
            );

            setFetchAgain(!fetchAgain); //this will trigger the useEffect in MyChats.tsx which will result in updating the chatState.chats

            toast({
                title: "Success",
                description: `Added ${newlyAddedUser.fullName}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setLoading(false);
            setSearchResult([]); //clear the searchResult
        } catch (error: any) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (userToBeRemoved: any) => {
        onClose(); //close the modal `UpdateGroupChatModal` and show the confirmDialog

        const { selectedChat } = chatState;
        const myId = authState.user.employeeId;
        const adminId = selectedChat.admin.memberId;
        const userIdToBeRemoved = userToBeRemoved.memberId; //be careful: memberId not id

        if (userIdToBeRemoved == myId) {
            toast({
                title: "You are about to remove yourself!!",
                description: "If you want to leave this group, click leave group button down below",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (adminId !== myId) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        dispatch(
            setConfirmDialog({
                isOpen: true,
                title: "Delete member",
                subtitle: `Are you sure to delete ${userToBeRemoved.fullName}`,
                onConfirm: () => removeMemberConfirmed(userToBeRemoved),
            })
        );
        setGroupChatName("");
    };

    const removeMemberConfirmed = async (userToBeRemoved: any) => {
        console.log("About to remove after confirmation: " + userToBeRemoved?.fullName);
        const { selectedChat } = chatState;
        const userIdToBeRemoved = userToBeRemoved?.memberId; //be careful: memberId not id

        try {
            setLoading(true);
            const { data } = await axiosInstance().put(
                `chat/groupremove`, {
                chatId: selectedChat["channel.id"],
                userId: userIdToBeRemoved,
            });

            // update the redux state (chatState.selectedChat):
            const updatedMembers = selectedChat?.members?.filter(
                (member: any) => member.memberId !== userIdToBeRemoved
            );
            dispatch(
                setSelectedChat({
                    ...selectedChat,
                    members: updatedMembers
                })
            );

            toast({
                title: "Success",
                description: `Removed ${userToBeRemoved?.fullName}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setFetchAgain(!fetchAgain);
            fetchMessages(); //this will refresh the messages in the chat
            setLoading(false);

            dispatch(
                setConfirmDialog({
                    isOpen: false,
                    title: "",
                    subtitle: "",
                    onConfirm: null,
                })
            );
        }
        catch (error: any) {
            console.log(error?.message);
        }
    }

    const leaveGroup = async () => {
        // const confirmed = window.confirm(`Are you sure you want to leave this group: ${groupName}?`);
        onClose(); //close the modal `UpdateGroupChatModal` and show the confirmDialog
        const { selectedChat } = chatState;
        dispatch(
            setConfirmDialog({
                isOpen: true,
                title: "Leave group",
                subtitle: `Are you sure you want to leave ${selectedChat["channel.name"]}`,
                onConfirm: leaveGroupConfirmed,
            })
        );
        setGroupChatName("");
    }

    const leaveGroupConfirmed = async () => {

        const { selectedChat } = chatState;
        const myId = authState.user.employeeId;
        const groupName = selectedChat["channel.name"];
        const adminId = selectedChat.admin.memberId;

        try {
            setLoading(true);
            const { data } = await axiosInstance().put(
                `chat/groupremove`, {
                chatId: selectedChat["channel.id"],
                userId: myId,
            });

            if (myId == adminId) {
                // Then the group has become without admin. So, set a new admin:
                if (selectedChat?.members?.length >= 2) {
                    const newAdmin = selectedChat?.members?.find((m: any) => m.memberId !== myId);

                    console.log("The new AdminId: ", newAdmin.memberId);

                    const res = await axiosInstance().put(
                        `chat/setNewAdmin`, {
                        chatId: selectedChat["channel.id"],
                        userId: newAdmin.memberId,
                    });
                    toast({
                        title: "Success",
                        description: `${newAdmin.fullName} has become the group admin`,
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                }
            }

            // Since have removed myself from the group, I will not be able to see the group from now on:
            dispatch(setSelectedChat({}));

            toast({
                title: "Success",
                description: `You left ${groupName}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setFetchAgain(!fetchAgain);//this will trigger the useEffect in MyChats.tsx which will result in updating the chatState.chats
            fetchMessages();
            setLoading(false);

            dispatch(
                setConfirmDialog({
                    isOpen: false,
                    title: "",
                    subtitle: "",
                    onConfirm: null,
                })
            );
        }
        catch (error: any) {
            console.log(error?.message);
        }
    }


    return (
        <>
            <Tooltip label="edit group" hasArrow placement="bottom-end">
                <IconButton
                    aria-label="Update chat"
                    d={{ base: "flex" }}
                    icon={<EditIcon />}
                    onClick={onOpen}
                />
            </Tooltip>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        d="flex"
                        justifyContent="center"
                    >
                        {chatState?.selectedChat["channel.name"]}
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {chatState?.selectedChat?.members?.map((user: any) => (
                                <UserBadgeItem
                                    key={user.id}
                                    user={user}
                                    // admin={chatState?.selectedChat?.admin}
                                    handleFunction={() => {
                                        handleRemove(user);
                                    }}
                                />
                            ))}
                        </Box>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat's name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e: any) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e: any) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.slice(0, 4).map((user: any) => (
                                <UserListItem
                                    key={user.id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={leaveGroup} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;