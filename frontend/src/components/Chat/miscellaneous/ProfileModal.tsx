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
    authState: any,
    children?: any
}

const ProfileModal = ({ authState, children }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                        {authState.user.fullName}
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
                            src={`${employeeData?.avatar !== null && `${process.env.REACT_APP_UPLOADS_URL}avatars/${employeeData.avatar}`}`}
                            alt={authState.user.fullName}
                        />
                        <Text
                            fontSize={{ base: "1rem", md: "1.5rem" }}
                        >
                            Email: {employeeData.email}
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

export default ProfileModal;