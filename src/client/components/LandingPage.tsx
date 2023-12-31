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
            bg="#b9eefe"
        >
            <Image
                src={mountainClimber}
                alt="mountain climber scaling mountain"
                maxW="50vw"
                maxH="100%"
                h="100vh"
                objectFit="contain"
            />
    
            <Spacer/>
                <RegisterForm />
            <Spacer />            
        </Flex>
        
    )
}

export default LandingPage;