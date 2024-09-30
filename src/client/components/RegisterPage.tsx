import { 
    Flex, 
    Hide, 
    Heading,
    Show,
  } from "@chakra-ui/react"; 
import RegisterForm from "./RegisterForm.js";
import ArtistCredit from "./ArtistCredit.js";
import GitHubButton from "./GitHubButton.js";
  
  
  const RegisterPage = () => {
    return (
      <>
        <Flex 
          alignItems="center" 
          justifyContent="center"
          w="100%" 
          h="100vh" 
          bgImage="url('/images/landing_page_bg_image.jpg')"
          bgPosition="bottom"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
          <GitHubButton
            isAbsolutePosition={true}
          /> 
          <RegisterForm/>
        </Flex>
        <ArtistCredit 
          textColor="blue.50" 
        />
      </>
    );
  };
  
  export default RegisterPage;
  