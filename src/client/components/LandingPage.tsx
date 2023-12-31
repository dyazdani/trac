import { useState } from 'react'
import { 
    Image,
    Flex,
    Spacer,
    Box 
} from "@chakra-ui/react";
import RegisterForm from "./RegisterForm.js";
import mountainClimber from "../../../public/images/mountain-climber.jpg";

const LandingPage = () => {
    const [isLoginShowing, setIsLoginShowing] = useState(false)

    const handleLinkClick = () => {
        setIsLoginShowing(!isLoginShowing)
    }

    return (
        <Flex
            alignItems="center"
            h="100vh"
            w="100vw"
            bg="#b9eefe"
        >
            <Spacer />
            <Image
                src={mountainClimber}
                alt="mountain climber scaling mountain"
                maxW="50vw"
                maxH="100%"
                h="100vh"
                objectFit="cover"
                borderRadius="50%"
                border="5px"
                bgColor="#564740"
                p="4"
                boxSize="45vw"
            />
    
            <Spacer />
            <Spacer />
            <RegisterForm 
                handleLinkClick={handleLinkClick}    
            />
            {/* The following commented out code will replace the line above once a LoginForm is created. */}
            {/* {isLoginShowing ? 
            <LoginForm
                handleLinkClick={handleLinkClick}
            /> :  
            <RegisterForm 
                handleLinkClick={handleLinkClick}
            />} */}
            <Spacer />    
            <Spacer />
        
        </Flex>
        
    )
}

export default LandingPage;