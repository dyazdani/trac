import { useState } from "react";
import { 
  Image, 
  Flex, 
  Spacer, 
  Hide 
} from "@chakra-ui/react";

import RegisterForm from "./RegisterForm.js";
import LoginForm from "./LoginForm.js";

const RegisterPage = () => {
  const [isLoginShowing, setIsLoginShowing] = useState(false);

  const handleLinkClick = () => {
    setIsLoginShowing(!isLoginShowing);
  };

  return (
    <Flex 
        alignItems="center" 
        w="100vw" 
        h="100vh" 
        bg="#b9eefe"
    >
      <Spacer />
      <Hide breakpoint="(max-width: 600px)">
        <Image
          src="/images/mountain-climber.jpg"
          alt="mountain climber scaling mountain"
          maxW="50vw"
          maxH="100%"
          h="100vh"
          objectFit="cover"
          borderRadius="50%"
          border="5px"
          bgColor="#564740"
          p="4"
          boxSize="35vw"
        />
        <Spacer />
        <Spacer />
      </Hide>

      {isLoginShowing ? (
        <LoginForm handleLinkClick={handleLinkClick} />
      ) : (
        <RegisterForm handleLinkClick={handleLinkClick} />
      )}
      <Hide breakpoint="(max-width: 600px)">
        <Spacer />
      </Hide>
      <Spacer />
    </Flex>
  );
};

export default RegisterPage;