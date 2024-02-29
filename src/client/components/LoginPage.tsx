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
            <Show 
                breakpoint="(max-width: 768px)"
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
                w="100%" 
                h="100vh" 
                bg="#b9eefe"
            >
                <Spacer/>
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
                    <Spacer/>
                    <Spacer/>
                </Hide>
                <LoginForm/>
                <Hide breakpoint="(max-width: 600px)">
                    <Spacer />
                </Hide>
                <Spacer/>
            </Flex>
        </>
    )
}

export default LoginPage;