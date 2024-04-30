import { 
    Flex, 
    Hide, 
    Show,
    Heading,
    Text,
    Link,
    Box
  } from "@chakra-ui/react";
import LoginForm from "./LoginForm.js";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import GitHubButton from "./GitHubButton.js";

const LoginPage = () => {
    return (
        <>  
            <Hide below="md">
                <Show breakpoint="(max-height: 517px)">
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
                h="100%" 
                minHeight="100vh"
                bgImage="url('/images/landing_page_bg_image.jpg')"
                bgPosition="bottom"
                bgRepeat="no-repeat"
                bgSize="cover"
            >           
                <GitHubButton
                    isAbsolutePosition={true}
                /> 
                <LoginForm/>
            </Flex>
            <Text fontSize="sm" justifyContent="center" position="absolute" bottom="0" left="5px" color="blue.50">
                <Link href="https://thenounproject.com/icon/mountain-120042/" isExternal>Mountain<ExternalLinkIcon mr=".5em" boxSize=".9em" /></Link>
                by <Link href="https://thenounproject.com/bravo/" isExternal>Juan Pablo Bravo<ExternalLinkIcon mr=".3em" boxSize="1em"/></Link> 
                is licensed under <Link href="https://creativecommons.org/licenses/by/2.0/" isExternal>CC BY 2.0<ExternalLinkIcon mr=".5em" boxSize="1em"/></Link>
            </Text>
        </>
    )
}

export default LoginPage;