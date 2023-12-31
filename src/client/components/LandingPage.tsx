import { 
    Image,
    Flex,
    Spacer,
    Box 
} from "@chakra-ui/react";
import RegisterForm from "./RegisterForm.js";
import mountainClimber from "../../../public/images/mountain-climber.jpg";

const LandingPage = () => {

    return (
        <Flex
            alignItems="center"
            h="100vh"
            w="100vw"
            bg="red"
        >
            <Spacer />
            <Image
                src={mountainClimber}
                alt="mountain climber scaling mountain"
                maxW="50vw"
                maxH="100%"
                h="90vh"
                objectFit="contain"
            />
    
            <Spacer/>
                <RegisterForm />
            <Spacer />            
        </Flex>
        
    )
}

export default LandingPage;