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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useGetAllUsersQuery, useLoginMutation } from "../features/api.js";

export interface LoginFormProps {
  handleLinkClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLinkClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

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

  const handleSubmit = async () => {
    try {
      if (!isError && !isLoading && !isUsersLoading) {
        if (data) {
          const isUnregisteredEmail = data.users.every(element => element.user.email !== email)

          if (isUnregisteredEmail) {
            setIsEmailInvalid(true);
          }

          console.log(isEmailInvalid)
          if (isEmailInvalid) {
            return
          }
        }
        const user = await login({ email, password })
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
              isDisabled={isSuccess}
              isInvalid={isEmailInvalid}
            >
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <FormErrorMessage>An account with that email does not exist</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isDisabled={isSuccess}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
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
            </FormControl>

            <Button
              colorScheme="yellow"
              data-testid="submit-button"
              type="submit"
              isLoading={isLoading}
              isDisabled={isError || isSuccess}
            >
              <Text>Log In</Text>
            </Button>
          </VStack>
        </Box>
      </CardBody>
      <CardFooter>
        <Text>
          Don't have an account?{" "}
          <Link
            data-testid="signup-link"
            onClick={handleLinkClick}
            color="teal"
          >
            Sign Up.
          </Link>
        </Text>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
