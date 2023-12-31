import React, { useState } from "react";
import { 
    FormControl, 
    Input, 
    FormLabel, 
    Box,
    VStack,
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Heading,
    Text,
    Button,
    Link
} from "@chakra-ui/react";
import { useRegisterMutation } from "../features/api.js";

const RegisterForm = () => {
    const [register, { isLoading, isError, data}] = useRegisterMutation();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <Card
            variant="elevated"
            align="center"
            size="md"  
        >
            <CardHeader>
                <Heading>trac</Heading>
                <Text>Stay on trac by signing up.</Text>
            </CardHeader>
            <CardBody>
                <Box
                    as="form"
                >
                    <VStack
                        as="fieldset"
                    >
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input 
                                type='email' 
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type='username' 
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    required
                                />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={e => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                required
                            />
                        </FormControl>
                        <Button>
                            <Text>Sign Up</Text>
                        </Button> 
                    </VStack>
 
                </Box>    
            </CardBody>
            <CardFooter>
                <Text>Already signed up? <Link>Log In</Link></Text>
            </CardFooter>
        </Card>
    )
}




export default RegisterForm;