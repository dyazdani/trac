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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export interface LoginFormProps {
  handleLinkClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLinkClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Placeholder function until work on form submit begins
  const handleSubmit = () => {
    console.log("form submitted");
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
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
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
