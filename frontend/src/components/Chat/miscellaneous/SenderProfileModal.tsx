import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

import VisibilityIcon from '@mui/icons-material/Visibility';

// ------------------ Redux ---------------------------
import { LoginState } from "../../../store/slices/loginSlice";

import axiosInstance from "../../../api/axios";

type Props = {
    user: any,
    children?: any
}

const SenderProfileModal = ({ user, children }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    aria-label="view profile"
                    d={{ base: "flex" }}
                    icon={<VisibilityIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        d="flex"
                        justifyContent="center"
                    >
                        {user.fullName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.avatar
                                ? `${process.env.REACT_APP_UPLOADS_URL}avatars/${user.avatar}`
                                : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                            }
                            alt={user.fullName}
                        />
                        <Text
                            fontSize={{ base: "1rem", md: "1.5rem" }}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SenderProfileModal;