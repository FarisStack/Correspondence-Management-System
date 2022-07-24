import React from 'react'
import { Box, Text, Avatar } from "@chakra-ui/react";


const ChannelListItem = ({ channel, handleFunction }) => {


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
                name={channel["channel.name"]}
            />
            <Box>
                <Text>{channel["channel.name"]}</Text>
                <Text fontSize="sm">
                    <b>Admin: </b>
                    {channel.admin.fullName}
                </Text>
                {/* <Text fontSize="xs">
                    <b>Email: </b>
                    {user.email}
                </Text> */}
            </Box>
        </Box>
    );
};
export default ChannelListItem