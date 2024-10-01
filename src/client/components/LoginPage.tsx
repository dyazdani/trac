import { 
    Flex, 
    Text,
    Link,
  } from "@chakra-ui/react";
import LoginForm from "./LoginForm.js";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const LoginPage = () => {
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
                    base: "650px",
                    // md: "675px"
                  }}
                bgImage="url('/images/landing_page_bg_image.jpg')"
                bgPosition="bottom"
                bgRepeat="no-repeat"
                bgSize="cover"
            >           
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