import { useState } from "react";
import { Image, Flex, Spacer, Hide } from "@chakra-ui/react";
import RegisterForm from "./RegisterForm.js";
import LoginForm from "./LoginForm.js";
import mountainClimber from "../../../images/mountain-climber.jpg";

const LandingPage = () => {
  const [isLoginShowing, setIsLoginShowing] = useState(false);

  const handleLinkClick = () => {
    setIsLoginShowing(!isLoginShowing);
  };

  // Placeholder function until work on form submit begins
  const handleSubmit = () => {
    console.log("form submitted");
  };

  // To be used to toggle password visibility
  const handleOnMouseDown = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  return (
    <Flex alignItems="center" w="100vw" h="100vh" bg="#b9eefe">
      <Spacer />
      <Hide breakpoint="(max-width: 600px)">
        <Image
          src={mountainClimber}
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
        <LoginForm
          handleLinkClick={handleLinkClick}
          handleSubmit={handleSubmit}
          handleOnMouseDown={handleOnMouseDown}
        />
      ) : (
        <RegisterForm
          handleLinkClick={handleLinkClick}
          handleSubmit={handleSubmit}
          handleOnMouseDown={handleOnMouseDown}
        />
      )}
      <Hide breakpoint="(max-width: 600px)">
        <Spacer />
      </Hide>
      <Spacer />
    </Flex>
  );
};

export default LandingPage;
