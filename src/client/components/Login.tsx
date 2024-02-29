import { 
    Box,
    Button,
    Flex, 
    Heading, 
    Spacer, 
    VStack 
} from "@chakra-ui/react"
import { useAppSelector } from "../app/hooks.js"
import AppHeader from "./AppHeader.js"
import LoginPage from "./LoginPage.js"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../features/authSlice.js"


const Login = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (

        currentUser ? 
        <Box
            bgColor="orange.50"
            width="100vw"
            height="100vh"
        >
            <AppHeader isBannerDisplayed={false}/>
            <VStack
                width="100%"
                alignItems="center"
                position="absolute"
                top="50vh"
            >
                <Heading 
                    as="h2" 
                    size="xl"
                >
                    You are already logged in.
                </Heading>
                <Spacer/>
                <Flex>
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
                        navigate("/");
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
                        onClick={e => {
                            e.preventDefault();
                            navigate('/goals')
                        }}
                    >
                        View my Goals
                    </Button>
                </Flex>
            </VStack>
        </Box> :
        <LoginPage/> 
    )
}

export default Login;