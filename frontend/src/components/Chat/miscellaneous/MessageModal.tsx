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
    UnorderedList,
    ListItem,
    Box,
    Flex
} from "@chakra-ui/react";

import VisibilityIcon from '@mui/icons-material/Visibility';

// ------------------ Redux ---------------------------
import { LoginState } from "../../../store/slices/loginSlice";

import { getMyCustomDateTime, getShortDateTime} from "../utils/ChatLogics";

import axiosInstance from "../../../api/axios";

type Props = {
    authState: any,
    children?: any
}


const ReaderListItem = ({ seener, message }: any) => {
    const { firstName, middleName, lastName } = seener.member;
    const fullName = `${firstName} ${lastName}`;
    return (
        <ListItem>
            <>
                <Text
                    style={{
                        color: "#3182CE"
                    }}
                >
                    {fullName} <span style={{color: "#A0AEC0"}}>({getShortDateTime(seener.updatedAt)})</span>
                </Text>
            </>
        </ListItem >
    )
}

const headerStyle = {
    color: "#A0AEC0",
    fontWeight: "bold",
    fontSize: "1.5rem"
}

const MessageModal = ({ authState, children, isOpen, onClose, seeners, message }: any) => {

    const [employeeData, setEmployeeData] = useState<any>({});

    useEffect(() => {
        // getWhoSawThisMessage();
    }, [])

    return (
        <>
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        d="flex"
                        justifyContent="center"
                    >
                        Message Info
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        overflowY="auto"
                    >
                        <Flex
                            flexDir="column"
                            style={{gap: "12px"}}
                        // justifyContent="space-between"
                        >
                            <Box>
                                <Text style={headerStyle}>Sender 💁</Text>
                                {message?.fullName}
                            </Box>
                            <Box>
                                <Text style={headerStyle}>Time Sent 🕑</Text>
                                {getMyCustomDateTime(message?.createdAt)}
                            </Box>
                            <Box>
                                <Text style={headerStyle}>Seen By 👀</Text>
                                <UnorderedList>
                                    {seeners?.map((seener: any) => (
                                        <ListItem key={seener.memberId}>
                                            <ReaderListItem seener={seener} />
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        </Flex>
                        {/* <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={`${employeeData?.avatar !== null && `${process.env.REACT_APP_UPLOADS_URL}avatars/${employeeData.avatar}`}`}
                            alt={authState.user.fullName}
                        />
                        <Text
                            fontSize={{ base: "1rem", md: "1.5rem" }}
                        >
                            Email: {employeeData.email}
                        </Text> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MessageModal;