import { useNavigate } from "react-router-dom";
import { 
    useAppDispatch, 
    useAppSelector 
} from "../app/hooks.js";
import { 
    Box, 
    Button, 
    Flex, 
    Heading, 
    VStack 
} from "@chakra-ui/react";
import AppHeader from "../components/AppHeader.js";
import { logout } from "../features/authSlice.js";
import RegisterPage from "../components/RegisterPage.js";

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  

    return (
        currentUser ?
        <Box
            bgColor="orange.50"
            width="100vw"
            height="100vh"
        >
            <AppHeader isBannerDisplayed={false}/>
            <VStack
                position="absolute"
                top="45vh"
                alignItems="center"
                width="100%"
            >
                <Heading
                    as="h2"
                    size="xl"
                >
                    You are already logged into a registered account.
                </Heading>
                <Flex
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="2vw"
                    gap="5vw"
                >
                    <Button
                        type="button"
                        ml="1vw"
                        mr="1vw"
                        variant="solid"
                        color="#000000"
                        colorScheme="orange"
                        onClick={(e) => {
                        e.preventDefault();
                        dispatch(logout());
                        navigate("/login");
                        }}
                    >
                        Logout 
                    </Button>
                    <Button
                        type="button"
                        ml="1vw"
                        mr="1vw"
                        variant="solid"
                        color="#000000"
                        colorScheme="orange"
                        onClick={(e) => {
                        e.preventDefault();
                        navigate("/goals");
                        }}
                    >
                        View my Goals
                    </Button>
                </Flex>
            </VStack>
        </Box>
         :
        <RegisterPage/>
    )
}

export default Register;