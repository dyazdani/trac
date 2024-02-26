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
    Link as ChakraLink,
    InputGroup,
    InputRightElement,
    IconButton,
    FormErrorMessage,
    FormHelperText,
    Checkbox
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { 
    ViewIcon, 
    ViewOffIcon 
} from "@chakra-ui/icons"
import { 
    useRegisterMutation, 
    useIdentifyUserMutation, 
    useGetAllUsersQuery 
} from "../features/api.js";
import getPasswordValidation from "../../utils/getPasswordValidation.js";
import { useNavigate } from "react-router";
import { validEmailRegex } from "./LoginForm.js";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = useState(true)
    const [isEmailTaken, setIsEmailTaken] = useState(false);
    const [isInputAndSubmitDisabled, setIsInputAndSubmitDisabled] = useState(false)
 
    const { 
        data, 
        isLoading: isUsersLoading 
    } = useGetAllUsersQuery();

    const [
        register, 
        {
            isError, 
            isLoading, 
            isSuccess
        }] = useRegisterMutation();
        
    const [
        identifyUser, 
        {
            isError: isKnockError, 
            isLoading: isKnockLoading, 
            isSuccess: isKnockSuccess
        }
    ] = useIdentifyUserMutation();


    const handleSubmit = async () => {
        try {
            if (getPasswordValidation(password).isTooWeak) {
                setIsPasswordInvalid(true);
            }
            
            if (!isUsersLoading) {
                if (data) {
                    const isUserEmailTaken = data.users.some(element => element.user.email === email);
                    const isUserUsernameTaken = data.users.some(element => element.user.username === username);

                    if (isUserEmailTaken) {
                        setIsEmailTaken(true);
                    }
                    if (isUserUsernameTaken) {
                        setIsUsernameTaken(true);
                    }

                    if (isUserEmailTaken || isUserUsernameTaken || password !== confirmPassword || getPasswordValidation(password).isTooWeak) {
                        return
                    }
                }

                const response = await register({ email, username, password }).unwrap();

                console.log(response)

                if (response.user) {
                    const knockUser = await identifyUser({id: String(response.user?.id), email, username})
                    console.log(knockUser)
                } 

                if (
                    isSuccess || 
                    isError || 
                    isLoading ||
                    isKnockSuccess ||
                    isKnockError ||
                    isKnockLoading
                    ) {
                    setIsInputAndSubmitDisabled(true);
                  }
          

                setIsPasswordInvalid(false);
                navigate("/goals");
            }
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <Card
            variant="elevated"
            align="center"
            size="md" 
            m="4"
            data-testid="register-form"
        >
            <CardHeader>
                <Heading>trac</Heading>
                <Text>Stay on trac by signing up.</Text>
            </CardHeader>
            <CardBody>
                <Box
                    as="form"
                    onSubmit={(e: React.FormEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        handleSubmit()
                    }}
                >
                    <VStack
                        as="fieldset"
                    >
                        <FormControl
                            isRequired
                            isDisabled={isInputAndSubmitDisabled}
                            isInvalid={isEmailInvalid || isEmailTaken}
                        >
                            <FormLabel>Email Address</FormLabel>
                            <Input 
                                type='email' 
                                onChange={(e) => {
                                    e.preventDefault();
                                    setEmail(e.target.value);
                                    setIsEmailInvalid(!validEmailRegex.test(e.target.value));
                                    if (!isUsersLoading && data) {
                                      const isUnregisteredEmail = data.users.every(element => element.user.email !== e.target.value)
                                      if (isUnregisteredEmail) {
                                        setIsEmailTaken(false);
                                      } else {
                                        setIsEmailTaken(true);
                                      }
                                    }
                                  }}
                                value={email}
                            />
                            {
                                isEmailInvalid ? 
                                <FormErrorMessage>Must enter valid email.</FormErrorMessage> :
                                ""
                            }
                            {
                                !isEmailInvalid && isEmailTaken ? 
                                <FormErrorMessage>An account with this email already exists.</FormErrorMessage> :
                                ""
                            }
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={isUsernameTaken}
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type='username' 
                                onChange={(e) => {
                                    if (isUsernameTaken) {
                                        setIsUsernameTaken(false);
                                    }
                                    setUsername(e.target.value)
                                }}                                
                                value={username}
                            />
                            <FormErrorMessage>Username already exists</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={isPasswordInvalid ? getPasswordValidation(password).isTooWeak : false}
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <FormLabel>Password</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        pr="4.5rem" 
                                        type={showPassword ? "text" : "password"}
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                    />
                                    <InputRightElement width="2.5rem">
                                        <IconButton 
                                            size="sm"
                                            h="1.75rem"
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword((show) => !show)}
                                            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>  e.preventDefault()}
                                            data-testid="password-visibility-button"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {password.length ? <FormHelperText>{getPasswordValidation(password).message}</FormHelperText> : ""}
                                <FormErrorMessage>{getPasswordValidation(password).characterTypeMessage}</FormErrorMessage>
                                <FormErrorMessage>{getPasswordValidation(password).lengthMessage}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={confirmPassword.length ? password !== confirmPassword : false}
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup size="md">
                                    <Input
                                        pr="4.5rem" 
                                        type={showConfirmPassword ? "text" : "password"}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                    />
                                    <InputRightElement width="2.5rem">
                                        <IconButton 
                                            size="sm"
                                            h="1.75rem"
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword((show) => !show)}
                                            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>  e.preventDefault()}
                                            data-testid="confirm-password-visibility-button"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {confirmPassword.length ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : ""}
                        </FormControl>
                        <FormControl
                            isRequired
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <Checkbox>I give trac permission to email me notifications</Checkbox>
                        </FormControl>
                        <Button
                            colorScheme="yellow"
                            data-testid="submit-button"
                            type="submit"    
                            isDisabled={
                                isInputAndSubmitDisabled ||
                                isEmailInvalid ||
                                isEmailTaken
                            }
                        >
                            <Text>Sign Up</Text>
                        </Button> 
                    </VStack>
                </Box>    
            </CardBody>
            <CardFooter>
                <Text> 
                    Already registered?{" "} 
                    <ChakraLink 
                        data-testid="login-link"
                        color="teal" 
                        as={ReactRouterLink}
                        to="/login"
                    >
                        Log in.
                    </ChakraLink>
                </Text>
            </CardFooter>
        </Card>
    )
}




export default RegisterForm;