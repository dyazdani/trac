import { 
    Flex, 
    Hide, 
    Heading,
    Show,
  } from "@chakra-ui/react"; 
import LandscapeRegisterForm from "./RegisterForm.js";
import ArtistCredit from "./ArtistCredit.js";
import GitHubButton from "./GitHubButton.js";
  
  
  const RegisterPage = () => {
    return (
      <>
        <Hide below="md">
          <Show breakpoint="(max-height: 660px)">
            <Heading 
              as="h1" 
              size="lg" 
              textAlign="center" 
              backgroundColor="gold.400"
              padding="1vw"
              position="sticky"
              top="0"
              zIndex={2}
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
            size="lg" 
            textAlign="center" 
            backgroundColor="gold.400"
            padding="1vw"
            position="sticky"
            top="0"
            zIndex={2}
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
          <GitHubButton
            isAbsolutePosition={true}
          /> 
          <LandscapeRegisterForm/>
        </Flex>
        <ArtistCredit 
          textColor="blue.50" 
        />
      </>
    );
  };
  
  export default RegisterPage;
  