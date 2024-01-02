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
    IconButton,
    ButtonGroup
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
// import { useRegisterMutation } from "../features/api.js";

export interface LoginFormProps {
    handleLinkClick: () => void
    handleSubmit: () => void
    handleOnMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const LoginForm: React.FC<LoginFormProps> = ({
    handleLinkClick, 
    handleSubmit,
    handleOnMouseDown
}) => {
    // const [register, { isLoading, isError, data}] = useRegisterMutation();

    const [email, setEmail] = useState("");
    // const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <Card
            variant="elevated"
            align="center"
            size="lg" 
            m="4"
        >
            <CardHeader>
                <Heading>trac</Heading>
                <Text>Stay on trac by logging in.</Text>
            </CardHeader>
            <CardBody>
                <Box
                    as="form"
                    onSubmit={handleSubmit}
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
                        {/* <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type='username' 
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </FormControl> */}
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
                                            onMouseDown={handleOnMouseDown}
                                            data-testid="password-visibility-button"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                        </FormControl>
                        {/* <FormControl>
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
                                            onMouseDown={handleOnMouseDown}
                                            data-testid="confirm-password-visibility-button"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                        </FormControl> */}
                        <ButtonGroup>
                            <Button
                                colorScheme="yellow"
                                data-testid="submit-button"
                                type="submit"    
                            >
                                <Text>Log In</Text>
                            </Button> 
                            <Button
                                colorScheme="yellow"
                                variant='outline'
                                data-testid="submit-button"
                                type="submit"    
                            >
                                <Text>Log In With Demo User</Text>
                            </Button> 
                        </ButtonGroup>
                    </VStack>
                </Box>    
            </CardBody>
            <CardFooter>
                <Text> 
                    Don't have an account? <Link data-testid="signup-link" onClick={handleLinkClick} color="teal">Sign Up.</Link>
                </Text>
            </CardFooter>
        </Card>
    )
}




export default LoginForm;