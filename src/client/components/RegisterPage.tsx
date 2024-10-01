import { Flex, Show, Spacer } from "@chakra-ui/react"; 
import RegisterForm from "./RegisterForm.js";
import ArtistCredit from "./ArtistCredit.js";
  
  const RegisterPage = () => {
    return (
      <>
        <Flex 
          alignItems={{
            base: "start",
            md: "center"
           }} 
          justifyContent="center"
          w="100%" 
          h="100dvh" 
          minHeight={{
            base: "1100px",
            md: "674px"
          }}
          bgImage="url('/images/landing_page_bg_image.jpg')"
          bgPosition="bottom"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
          <RegisterForm/>
        </Flex>
        <ArtistCredit 
          textColor="blue.50" 
        />
      </>
    );
  };
  
  export default RegisterPage;
  