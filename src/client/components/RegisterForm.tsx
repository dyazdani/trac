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
    Text,
    Button,
    Link as ChakraLink,
    InputGroup,
    InputRightElement,
    IconButton,
    FormErrorMessage,
    FormHelperText,
    Checkbox,
    Flex,
    Image,
    Grid,
    GridItem,
    LinkBox,
    LinkOverlay,
    Show,
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
import DemoUserButton from "./DemoUserButton.js";
import GitHubButton from "./GitHubButton.js";

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
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await register({ email, username, password }).unwrap();

            console.log(response)

            if (response.user) {
                const knockUser = await identifyUser({id: String(response.user?.id), email, username, timezone})
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
          
            if (!isLoading && !isKnockLoading) {
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
            margin={{
                base: "1.5rem",
                md: "2rem"
            }}
            bgColor="#C9E5F6"
            maxHeight="90%"
            data-testid="landscape-register-form"
        >
            <CardHeader
                paddingBottom={0}
                minW="100%"
            >
                <Flex
                    direction="column"
                    alignItems={"center"}
                >
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        templateRows="repeat(2, 1fr)"
                        minW="100%"
                    >
                        <GridItem
                            colStart={2}
                            rowStart={1}
                        >
                            <LinkBox>
                                <LinkOverlay as={ReactRouterLink} to="/">
                                    <Flex
                                        gap="0.5rem"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Text fontSize="4xl">trac</Text>
                                        <Image
                                            src="/images/trac_logo.png"
                                            alt="Trac mountain logo"
                                            h="2.5rem"
                                        />
                                    </Flex>
                                </LinkOverlay>
                            </LinkBox>
                        </GridItem>
                        <Show
                            above="md"
                        >
                            <GridItem
                                colStart={1}
                                rowStart={1}
                            >
                            <DemoUserButton/> 
                            </GridItem> 
                        </Show>
                        <Show
                            above="md"
                        >
                            <GridItem
                                colStart={3}
                                rowStart={1}
                                justifySelf="end"
                            >
                                <LinkBox>
                                    <GitHubButton
                                        isAbsolutePosition={false}
                                    /> 
                                </LinkBox>
                            </GridItem>
                        </Show>
                        <GridItem
                            gridColumn="1 / 4"
                            rowStart={2}
                            justifySelf="center"
                        >
                        <Text>Sign up to stay on Trac.</Text> 
                        </GridItem>
                    </Grid>
                    <Show
                        below="md"
                    >
                        <LinkBox>
                            <GitHubButton
                                isAbsolutePosition={false}
                            /> 
                        </LinkBox>
                        <DemoUserButton/>
                    </Show>
                </Flex>          
            </CardHeader>
            <CardBody
                as="form"
                onSubmit={(e: React.FormEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    handleSubmit()
                }}
            >
                <VStack
                    as="fieldset"
                >
                    <Flex
                        flexFlow={{
                            base: "column",
                            md: "row"
                        }}
                        alignItems="center"
                        width={{
                            base: "90%",
                            md: "100%"
                        }}
                        gap="1vw"
                    >
                        <FormControl
                            isRequired
                            isDisabled={isInputAndSubmitDisabled}
                            isInvalid={isEmailInvalid || isEmailTaken}
                            borderColor={"darkslategray.400"}
                        >
                            <FormLabel>Email Address</FormLabel>
                            <Input 
                                type='email' 
                                _hover={{
                                    borderColor: "darkslategray.600"
                                }}
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
                            <Box
                                height="1em"
                                marginTop=".3em"
                            >
                            {
                                isEmailInvalid ? 
                                <FormErrorMessage marginTop="0">Must enter valid email.</FormErrorMessage> :
                                ""
                            }
                            {
                                !isEmailInvalid && isEmailTaken ? 
                                <FormErrorMessage marginTop="0">An account with this email already exists.</FormErrorMessage> :
                                ""
                            }
                            </Box>
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={isUsernameTaken}
                            isDisabled={isInputAndSubmitDisabled}
                            borderColor={"darkslategray.400"}
                        >
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type='username'
                                _hover={{
                                    borderColor: "darkslategray.600"
                                }} 
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
                            <Box
                                height="1em"
                                marginTop=".3em"
                            >
                                <FormErrorMessage marginTop="0">Username already exists.</FormErrorMessage>
                            </Box>
                        </FormControl>
                    </Flex>
                    <Flex
                        flexFlow={{
                            base: "column",
                            md: "row"
                        }}
                        alignItems="center"
                        width={{
                            base: "90%",
                            md: "100%"
                        }}
                        gap="1vw"
                    >
                        <FormControl
                            isRequired
                            isInvalid={password.length && isPasswordInvalid ? getPasswordValidation(password).isTooWeak : false}
                            isDisabled={isInputAndSubmitDisabled}
                        >
                            <FormLabel>Password</FormLabel>
                                <InputGroup 
                                    borderColor={"darkslategray.400"}
                                    size="md"
                                >
                                    <Input
                                        _hover={{
                                            borderColor: "darkslategray.600"
                                        }}
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
                                            backgroundColor="darkslategray.200"
                                            _hover={{
                                                backgroundColor: "darkslategray.300"
                                            }}
                                            _active={{
                                                backgroundColor: "darkslategray.400"
                                            }}
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
                                <Flex
                                    height="5em"
                                    direction="column"
                                    width="263px"
                                    mt=".3em"
                                >
                                    {
                                        password.length ? 
                                        <FormHelperText 
                                            mt="0" 
                                            color="darkslategray.600"
                                        >
                                            {getPasswordValidation(password).message}
                                        </FormHelperText> : 
                                        ""
                                        }
                                    <FormErrorMessage>{getPasswordValidation(password).characterTypeMessage}</FormErrorMessage>
                                    <FormErrorMessage>{getPasswordValidation(password).lengthMessage}</FormErrorMessage>
                                </Flex>
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={confirmPassword.length ? password !== confirmPassword : false}
                            isDisabled={isInputAndSubmitDisabled}
                            marginTop={{
                                base: "1rem",
                                md: "0"
                            }}
                        >
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup 
                                borderColor={"darkslategray.400"}
                                size="md"
                            >
                                <Input
                                        _hover={{
                                        borderColor: "darkslategray.600"
                                    }}
                                    pr="4.5rem" 
                                    type={showConfirmPassword ? "text" : "password"}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                                <InputRightElement width="2.5rem">
                                    <IconButton 
                                        backgroundColor="darkslategray.200"
                                        _hover={{
                                            backgroundColor: "darkslategray.300"
                                        }}
                                        _active={{
                                            backgroundColor: "darkslategray.400"
                                        }}
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
                                <Box
                                    height="5em"
                                    mt=".3em"
                                >
                                    {confirmPassword.length ? <FormErrorMessage mt="0">Passwords do not match.</FormErrorMessage> : ""}
                                </Box>
                        </FormControl>
                    </Flex>
                    <FormControl
                        isRequired
                        isDisabled={isInputAndSubmitDisabled}
                        mt="1em"
                        width={{
                            base: "90%",
                            md: "100%"
                        }}
                    >
                        <Checkbox
                            borderColor={"darkslategray.400"}
                            colorScheme="skyblue"
                            onChange={(e) => {
                                e.preventDefault();
                                setIsPermissionCheckboxChecked(!isPermissionCheckboxChecked);
                            }}
                        >
                            I give <Text as="b">Trac</Text> permission to email me notifications.
                        </Checkbox>
                    </FormControl>
                    <Flex
                        mt="2vh"
                        justifyContent={"space-evenly"}
                        alignItems={"center"}
                        width="100%"
                    >
                        <Button
                            backgroundColor="peach.300"
                            color="#353231"
                            _hover={{
                                backgroundColor: "peach.500"
                            }}
                            _active={{
                                backgroundColor: "peach.600",
                                color: "floralwhite.50"
                            }}
                            data-testid="submit-button"
                            type="submit"    
                            isLoading={isLoading || isKnockLoading}
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
                    </Flex>
                </VStack>   
            </CardBody>
            <CardFooter>
                <Text> 
                    Already registered?{" "} 
                    <ChakraLink 
                        data-testid="login-link"
                        color="stormyblue.700" 
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