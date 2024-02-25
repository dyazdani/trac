import { 
    Image, 
    Flex, 
    Spacer, 
    Hide 
  } from "@chakra-ui/react";
import LoginForm from "./LoginForm.js";

const LoginPage = () => {
    return (
        <Flex 
            alignItems="center" 
            w="100vw" 
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
    )
}

export default LoginPage;