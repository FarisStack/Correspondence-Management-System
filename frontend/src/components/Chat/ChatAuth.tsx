import React from 'react'
// --------- Chakra-UI Components ------------------
import {
  ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs,
  Container, Box, Text, Button, ButtonGroup
}
  from "@chakra-ui/react";
import ChatPage from "./ChatPage";
// ---------- Components -----------
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
// ---------------- CSS ---------------------
import classes from "./css/ChatHome.module.css";

type Props = {}

const ChatAuth = (props: Props) => {
  return (
    <ChakraProvider>
      <div className={classes.chatHome}>
        <Container maxW="xl" centerContent>
          <Box
            d="flex"
            justifyContent="center"
            p={3}
            bg={"white"}
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
          >
            <Text fontSize="4xl" fontFamily="Work Sans" color="black"
            >
              Talk-A-Tive
            </Text>
          </Box>
          <Box
            bg="white"
            w="100%"
            p={4}
            borderRadius="lg"
            color="black"
            borderWidth="1px"
          >
            <Tabs variant="soft-rounded">
              <TabList mb="1em">
                <Tab width="50%">Login</Tab>
                <Tab width="50%">Signup</Tab>
              </TabList>

              <TabPanels>
                <TabPanel><Login /></TabPanel>
                <TabPanel><Signup /></TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </div>
    </ChakraProvider>
  )
}

export default ChatAuth