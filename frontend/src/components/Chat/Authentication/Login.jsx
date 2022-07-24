import React, { useState } from 'react'
import {
    VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement,
    Button
}
    from '@chakra-ui/react'

const Login = () => {

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    }
    const handleSubmit = () => {

    }

    return (
        <VStack spacing="15px" color="black">
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



            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={() => {
                    setFormData({ ...formData, email: "guest@example.com", password: "123456" });
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login