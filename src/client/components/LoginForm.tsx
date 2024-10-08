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
  Image,
  Flex,
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
} from "@chakra-ui/icons";
import { 
  useGetAllUsersQuery, 
  useGetUserByEmailQuery, 
  useLoginMutation 
} from "../features/api.js";
import { useNavigate } from "react-router";
import DemoUserButton from "./DemoUserButton.js";
import GitHubButton from "./GitHubButton.js";

export const validEmailRegex = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isEmailUnregistered, setIsEmailUnregistered] = useState(false)
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
      if (!isUsersLoading && !isUserLoading && !isLoading) {
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
    >
      <CardHeader
        paddingBottom={0}  
      >
        <Flex
          direction="column"
          alignItems={"center"}
        >
          <Grid
            marginBottom={{
              base: "0",
              md: "1rem"
            }}
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(2, 1fr)"
            minW="100%"
          >
            <GridItem
              colStart={2}
              rowStart={1}
              margin="0 2rem"
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
                      alt="trac mountain logo"
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
              <Text>Log in to stay on Trac.</Text> 
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
        width={{
          base: "90%",
          md: "70%"
        }}
        marginTop={{
          base: "1rem"
        }}
      >
        <Box
          as="form"
          onSubmit={(e: React.FormEvent<HTMLDivElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <VStack 
            as="fieldset"
          >
            <FormControl
              isRequired
              isDisabled={isInputAndSubmitDisabled}
              isInvalid={isEmailInvalid || isEmailUnregistered}
              borderColor={"darkslategray.400"}
            >
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
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
                      setIsEmailUnregistered(true);
                    } else {
                      setIsEmailUnregistered(false);
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
                  <FormErrorMessage mt="0">Must enter valid email.</FormErrorMessage> :
                  ""
                }
                {
                  !isEmailInvalid && isEmailUnregistered ? 
                  <FormErrorMessage mt="0">An account with this email does not exist.</FormErrorMessage> :
                  ""
                }
              </Box>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={isPasswordInvalid}
              isDisabled={isInputAndSubmitDisabled}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup 
                size="md" 
                borderColor={"darkslategray.400"}
              >
                <Input
                  _hover={{
                    borderColor: "darkslategray.600"
                  }}
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
                    backgroundColor="darkslategray.200"
                    _hover={{
                      backgroundColor: "darkslategray.300"
                    }}
                    _active={{
                      backgroundColor: "darkslategray.400"
                    }}
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
                backgroundColor="peach.300"
                color="#353231"
                _hover={{
                  backgroundColor: "peach.500"
                }}
                _active={{
                  backgroundColor: "peach.600",
                  color: "floralwhite.50"
                }}
                marginTop="2vh"
                data-testid="submit-button"
                type="submit"
                isLoading={isLoading}
                isDisabled={isInputAndSubmitDisabled || isPasswordInvalid || isEmailInvalid || isEmailUnregistered || password.length === 0}
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
            color="stormyblue.700"
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
