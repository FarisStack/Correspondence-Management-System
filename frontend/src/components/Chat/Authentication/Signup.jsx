import React, { useState } from 'react'

import {
    VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement,
    Button
}
    from '@chakra-ui/react'


const Signup = () => {

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    }
    const postDetails = (pics) => {

    }
    const handleSubmit = () => {

    }

    return (
        <VStack spacing="15px" color="black">
            {/* ----------- Name ------------- */}
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    name="name"
                    value={formData.name}
                    placeholder="Enter your name"
                    onChange={handleChange}
                />
            </FormControl>
            {/* ----------- Email ------------- */}
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                />
            </FormControl>
            {/* ----------- Password ------------- */}
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShow((prevShow) => !prevShow)}
                        >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            {/* ----------- Confirm Password ------------- */}
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder="confirm Password"
                        onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShow((prevShow) => !prevShow)}
                        >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            {/* ----------- Upload Picture ------------- */}
            <FormControl id="password" isRequired>
                <FormLabel>Upload your avatar</FormLabel>
                <InputGroup>
                    <Input
                        variant="filled"
                        type="file"
                        p={1.5}
                        name="avatar"
                        accept="image/*"
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup