import { 
    Flex, 
    Hide, 
    Heading,
    Show,
    Link,
    Text
  } from "@chakra-ui/react"; 
import LandscapeRegisterForm from "./RegisterForm.js";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ArtistCredit from "./ArtistCredit.js";
  
  
  const RegisterPage = () => {
    return (
      <>
        <Hide below="md">
          <Show breakpoint="(max-height: 680px)">
            <Heading 
              as="h1" 
              size="md" 
              textAlign="center" 
              backgroundColor="yellow.500"
              padding="1vw"
            >
              Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
            </Heading>
          </Show>
        </Hide>
        <Show 
          below="md"
        >
          <Heading 
            as="h1" 
            size="md" 
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
          bgSize="cover"
        >
          <LandscapeRegisterForm/>
        </Flex>
        <ArtistCredit textColor="blue.50" position="left"/>
      </>
    );
  };
  
  export default RegisterPage;
  