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
    Link,
    InputGroup,
    InputRightElement,
    IconButton
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { useRegisterMutation } from "../features/api.js";

export interface RegisterFormProps {
    handleLinkClick: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({handleLinkClick}) => {
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
                            <FormLabel>Email Address</FormLabel>
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
                                <InputGroup size="md">
                                    <Input
                                        pr="4.5rem" 
                                        type={showPassword ? "text" : "password"}
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                        required
                                    />
                                    <InputRightElement width="2.5rem">
                                        <IconButton 
                                            size="sm"
                                            h="1.75rem"
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword((show) => !show)}
                                            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup size="md">
                                    <Input
                                        pr="4.5rem" 
                                        type={showConfirmPassword ? "text" : "password"}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        required
                                    />
                                    <InputRightElement width="2.5rem">
                                        <IconButton 
                                            size="sm"
                                            h="1.75rem"
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword((show) => !show)}
                                            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                        </FormControl>
                        <Button
                            colorScheme="yellow"    
                        >
                            <Text>Sign Up</Text>
                        </Button> 
                    </VStack>
                </Box>    
            </CardBody>
            <CardFooter>
                <Text> 
                    Already signed up? <Link onClick={handleLinkClick} color="teal">Log in.</Link>
                </Text>
            </CardFooter>
        </Card>
    )
}




export default RegisterForm;