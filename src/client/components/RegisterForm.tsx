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
    FormErrorMessage,
    FormHelperText
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { useRegisterMutation, useIdentifyUserMutation } from "../features/api.js";
import getPasswordValidation from "../../utils/getPasswordValidation.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { Prisma } from "@prisma/client";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface RegisterFormProps {
    handleLinkClick: () => void
}


const RegisterForm: React.FC<RegisterFormProps> = ({handleLinkClick}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
 
    const [register, {error, isError, isLoading, isSuccess}] = useRegisterMutation();
    const [
        identifyUser, 
        {
            error: knockError, 
            isError: isKnockError, 
            isLoading: isKnockLoading, 
            isSuccess: isKnockSuccess
        }
    ] = useIdentifyUserMutation();


    const handleSubmit = async () => {
        try {
            if (getPasswordValidation(password).isTooWeak) {
                setIsPasswordInvalid(true);
                return;
            }

            if (password !== confirmPassword) {
                return;
            }

            const user = await register({ email, username, password });
            console.log(user)
            if ('data' in user) {
                const knockUser = await identifyUser({id: String(user.data.user.id), email, username})
                console.log(knockUser)
            }
            setIsPasswordInvalid(false);
        } catch (e) {
            console.error(e);
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
                            isDisabled={
                                isLoading ||
                                isKnockLoading ||
                                isSuccess ||
                                isKnockSuccess
                            }
                        >
                            <FormLabel>Email Address</FormLabel>
                            <Input 
                                type='email' 
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </FormControl>
                        <FormControl
                            isRequired
                            isDisabled={
                                isLoading ||
                                isKnockLoading ||
                                isSuccess ||
                                isKnockSuccess
                            }
                        >
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type='username' 
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </FormControl>
                        <FormControl
                            isRequired
                            isInvalid={isPasswordInvalid}
                            isDisabled={
                                isLoading ||
                                isKnockLoading ||
                                isSuccess ||
                                isKnockSuccess
                            }
                        >
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
                            isDisabled={
                                isLoading ||
                                isKnockLoading ||
                                isSuccess ||
                                isKnockSuccess
                            }
                        >
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
                                            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>  e.preventDefault()}
                                            data-testid="confirm-password-visibility-button"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {confirmPassword.length ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : ""}
                        </FormControl>
                        <Button
                            colorScheme="yellow"
                            data-testid="submit-button"
                            type="submit"    
                            isDisabled={
                                isLoading ||
                                isKnockLoading ||
                                isSuccess ||
                                isKnockSuccess
                            }
                        >
                            <Text>Sign Up</Text>
                        </Button> 
                    </VStack>
                </Box>    
            </CardBody>
            <CardFooter>
                <Text> 
                    Already registered? <Link data-testid="login-link" onClick={handleLinkClick} color="teal">Log in.</Link>
                </Text>
            </CardFooter>
        </Card>
    )
}




export default RegisterForm;