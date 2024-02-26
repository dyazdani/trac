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
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useGetAllUsersQuery, useGetUserByEmailQuery, useLoginMutation } from "../features/api.js";
import { useNavigate } from "react-router";

const validEmailRegex = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(true);
  const [isEmailUnregistered, setIsEmailUnregistered] = useState(true)
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isInputAndSubmitDisabled, setIsInputAndSubmitDisabled] = useState(false);

  const navigate = useNavigate();

  const [
    login, 
    { 
      isLoading, 
      isError, 
      isSuccess
    }] = useLoginMutation();

    const { 
      data,
      isLoading: isUsersLoading 
  } = useGetAllUsersQuery();

  const { 
    isLoading: isUserLoading
  } = useGetUserByEmailQuery(email);

  const handleSubmit = async () => {
    try {
      if (!isUsersLoading && !isUserLoading) {
        if (data) {
          const isUnregisteredEmail = data.users.every(element => element.user.email !== email)
          if (isUnregisteredEmail) {
            setIsEmailInvalid(true);
          }

          if (isUnregisteredEmail) {
            return;
          }
        }

        const user = await login({ email, password }).unwrap();
        if (user.name === "IncorrectPassword") {
          setIsPasswordInvalid(true);
          return
        }
        
        if (isSuccess || isError || isLoading) {
          setIsInputAndSubmitDisabled(true);
        }

        navigate("/goals")
      }
    } catch (e) {
      console.error(e);    
    }
  };

  return (
    <Card variant="elevated" align="center" size="md" m="4">
      <CardHeader>
        <Heading>trac</Heading>
        <Text>Stay on trac by logging in.</Text>
      </CardHeader>
      <CardBody>
        <Box
          as="form"
          onSubmit={(e: React.FormEvent<HTMLDivElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <VStack as="fieldset">
            <FormControl
              isRequired
              isDisabled={isInputAndSubmitDisabled}
              isInvalid={isEmailInvalid || isEmailUnregistered}
            >
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                  setIsEmailInvalid(!validEmailRegex.test(e.target.value));
                  if (!isUsersLoading && data) {
                    const isUnregisteredEmail = data.users.every(element => element.user.email !== e.target.value)
                    if (isUnregisteredEmail) {
                      setIsEmailUnregistered(true);
                    } else {
                      setIsEmailUnregistered(false);
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
                !isEmailInvalid && isEmailUnregistered ? 
                <FormErrorMessage>An account with this email does not exist.</FormErrorMessage> :
                ""
              }
            </FormControl>

            <FormControl
              isRequired
              isInvalid={isPasswordInvalid}
              isDisabled={isInputAndSubmitDisabled}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    if (isPasswordInvalid) {
                      setIsPasswordInvalid(false);
                    }
                    setPassword(e.target.value)
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
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.preventDefault()
                    }
                    data-testid="password-visibility-button"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>Incorrect password</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="yellow"
              data-testid="submit-button"
              type="submit"
              isLoading={isLoading}
              isDisabled={isInputAndSubmitDisabled || isPasswordInvalid || isEmailInvalid || isEmailUnregistered}
            >
              <Text>Log In</Text>
            </Button>
          </VStack>
        </Box>
      </CardBody>
      <CardFooter>
        <Text>
          Don't have an account?{" "}
          <ChakraLink
            data-testid="signup-link"
            color="teal"
            as={ReactRouterLink}
            to="/register"
          >
            Sign Up.
          </ChakraLink>
        </Text>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
