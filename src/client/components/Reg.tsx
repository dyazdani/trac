import { 
    Image, 
    Flex, 
    Spacer, 
    Hide, 
    Heading,
    Show
  } from "@chakra-ui/react";
  
  import RegisterForm from "./RegisterForm.js";
  import LandscapeRegisterForm from "./LandscapeRegisterForm.js";
  
  
  const Reg = () => {
    return (
      <>
        <Show 
          below="md"
        >
          <Heading 
            as="h1" 
            size="lg" 
            textAlign="center" 
            backgroundColor="yellow.500"
            padding="1vw"
          >
            Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
        </Heading>
      </Show>
      <Flex 
        alignItems="center" 
        justifyContent="center"
        w="100%" 
        h="100vh" 
        bgImage="url('/images/landing_page_bg_image.jpg')"
        bgPosition="bottom"
        bgRepeat="no-repeat"
      >
        <RegisterForm/>
      </Flex>
      </>
    );
  };
  
  export default Reg;
  