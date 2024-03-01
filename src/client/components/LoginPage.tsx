import { 
    Image, 
    Flex, 
    Spacer, 
    Hide, 
    Show,
    Heading
  } from "@chakra-ui/react";
import LoginForm from "./LoginForm.js";

const LoginPage = () => {
    return (
        <>  
            <Hide below="md">
                <Show breakpoint="(max-height: 565px)">
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
        >
          <LoginForm/>
        </Flex>
        </>
    )
}

export default LoginPage;