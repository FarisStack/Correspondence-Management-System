import React from 'react'
import { Box, Text, Avatar } from "@chakra-ui/react";


const UserListItem = ({ handleFunction, user }) => {

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            w="100%"
            d="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={`${user.firstName} ${user.lastName}`}
                src={`${process.env.REACT_APP_UPLOADS_URL}avatars/${user.avatar}`}
            />
            <Box>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <Text fontSize="sm">
                    <b>Username: </b>
                    {user.Account.username}
                </Text>
                <Text fontSize="xs">
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
};
export default UserListItem