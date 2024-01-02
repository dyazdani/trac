import { useState } from 'react'
import { 
    Image,
    Flex,
    Spacer,
    Hide,
} from "@chakra-ui/react";

import RegisterForm from "./RegisterForm.js";
import mountainClimber from "../../../images/mountain-climber.jpg";


const LandingPage = () => {
    const [isLoginShowing, setIsLoginShowing] = useState(false)

    const handleLinkClick = () => {
        setIsLoginShowing(!isLoginShowing)
    }
    
    return (
        <Flex
            alignItems="center"
            w="100vw"
            h="100vh"
            bg="#b9eefe"
        >
            <Spacer />
            <Hide
                breakpoint='(max-width: 600px)'
            >
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
                    boxSize="35vw"
                />
                <Spacer /> 
                <Spacer />
            </Hide>
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
            <Hide
                breakpoint='(max-width: 600px)'
            >
                <Spacer />    
            </Hide>
            <Spacer /> 
        </Flex>
    )
}

export default LandingPage;