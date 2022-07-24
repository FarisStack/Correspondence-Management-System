import {
    Button, useDisclosure, AlertDialogOverlay, AlertDialog,
    AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogContent
} from '@chakra-ui/react'

import React from 'react'


const ConfirmDialog = ({
    isConfirmOpen, setIsConfirmOpen, callbackFn
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
        <>
            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsConfirmOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Member
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this member?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                setIsConfirmOpen(false);
                            }}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='red'
                                onClick={() => {
                                    callbackFn();
                                    setIsConfirmOpen(false);
                                }}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ConfirmDialog