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
    Checkbox,
    Image
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
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [isEmailTaken, setIsEmailTaken] = useState(false);
    const [isInputAndSubmitDisabled, setIsInputAndSubmitDisabled] = useState(false);
    const [isPermissionCheckboxChecked, setIsPermissionCheckboxChecked] = useState(false)
 
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
          
                navigate("/goals");
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
            bgColor="blue.50"
        >
            <CardHeader>
                <Image
                    src="/images/trac-logo-with-text.png"
                    alt="trac logo"
                />
                <Text>Sign up to keep on Trac.</Text>
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
                                    e.preventDefault();
                                    setUsername(e.target.value);
                                    if (!isUsersLoading && data) {
                                      const isUsernameFree = data.users.every(element => element.user.username !== e.target.value)
                                      if (isUsernameFree) {
                                        console.log("Username not taken")
                                        setIsUsernameTaken(false);
                                      } else {
                                        console.log("Username taken")
                                        setIsUsernameTaken(true);
                                      }
                                    }
                                }}                                
                                value={username}
                            />
                            <FormErrorMessage>Username already exists.</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={password.length && isPasswordInvalid ? getPasswordValidation(password).isTooWeak : false}
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <FormLabel>Password</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        pr="4.5rem" 
                                        type={showPassword ? "text" : "password"}
                                        onChange={e => {
                                            e.preventDefault();
                                            setPassword(e.target.value)
                                            setIsPasswordInvalid(getPasswordValidation(e.target.value).isTooWeak)
                                        }}
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
                                {confirmPassword.length ? <FormErrorMessage>Passwords do not match.</FormErrorMessage> : ""}
                        </FormControl>
                        <FormControl
                            isRequired
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <Checkbox
                                onChange={(e) => {
                                    e.preventDefault();
                                    setIsPermissionCheckboxChecked(!isPermissionCheckboxChecked);
                                }}
                            >
                                I give <Text as="b">Trac</Text> permission to email me notifications.
                            </Checkbox>
                        </FormControl>
                        <Button
                            colorScheme="yellow"
                            data-testid="submit-button"
                            type="submit"    
                            isDisabled={
                                isInputAndSubmitDisabled ||
                                !email.length ||
                                isEmailInvalid ||
                                isEmailTaken ||
                                !username.length ||
                                isUsernameTaken ||
                                !password.length ||
                                isPasswordInvalid ||
                                !confirmPassword.length ||
                                password !== confirmPassword ||
                                !isPermissionCheckboxChecked
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