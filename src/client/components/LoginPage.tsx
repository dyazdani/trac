import { Flex } from "@chakra-ui/react";
import LoginForm from "./LoginForm.js";
import ArtistCredit from "./ArtistCredit.js";

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
                minHeight="670px"
                bgImage="url('/images/landing_page_bg_image.jpg')"
                bgPosition="bottom"
                bgRepeat="no-repeat"
                bgSize="cover"
            >           
                <LoginForm/>
            </Flex>
            <ArtistCredit 
                textColor="blue.50" 
            />
        </>
    )
}

export default LoginPage;