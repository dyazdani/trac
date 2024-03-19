import { 
  useAppDispatch, 
  useAppSelector 
} from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { KnockFeedProvider } from "@knocklabs/react-notification-feed";
import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer,
    Heading,
    Image,
    Link as ChakraLink,
    LinkBox,
    LinkOverlay,
    Flex, 
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom'
import MessagesMenu from "./MessagesMenu.js";
import { useNavigate } from "react-router";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { resetIsBannerDisplayed } from "../features/bannerSlice.js";

export interface AppHeaderProps {
  isBannerDisplayed: boolean | null
}

const AppHeader = ({isBannerDisplayed}: AppHeaderProps) => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

  return (
    <Box 
      bg="turquoise.100"
      w="100vw"
      maxWidth="100%" 
      p="1rem"
      minHeight="70px"
      position={"sticky"}
      top={
        isBannerDisplayed ? 
        "92px" : 
        "0px"}
      zIndex={100}
    >
      <HStack>
        <Spacer/>
        <LinkBox>
          <LinkOverlay as={ReactRouterLink} to="/">
            <Flex
              gap="0.5rem"
              alignItems="center"
              justifyContent="center"
            >
              <Heading>trac</Heading>
              <Image
                src="/images/trac_logo.png"
                alt="trac mountain logo"
                h="2.5rem"
              />
            </Flex>
          </LinkOverlay>
        </LinkBox>
        <Spacer/>
        <Spacer/>
        <Spacer/>
        <Spacer/>
        <Spacer/>
        <Spacer/>
        <Spacer/>


        {
          currentUser ? 
          <Box
            ml="1vw"
            mr="1vw"
          > 
            <Text>Hi, <Text as='b'>{currentUser?.username}</Text>!
            </Text>
          </Box> : 
          <ChakraLink
            as={ReactRouterLink}
            to="/login"
          >
            Log In
          </ChakraLink>
        }

        {
          process.env.KNOCK_FEED_CHANNEL_ID && 
          process.env.KNOCK_PUBLIC_API_KEY && 
          currentUser &&
          <KnockFeedProvider
            apiKey={process.env.KNOCK_PUBLIC_API_KEY}
            feedId={process.env.KNOCK_FEED_CHANNEL_ID}
            userId={currentUser?.id.toString()}
          >
            <MessagesMenu />
          </KnockFeedProvider>
        }
      
        {
          currentUser ?
          <Button
            type="button"
            ml="1vw"
            mr="1vw"
            variant="solid"
            backgroundColor="skyblue.600"     
            color="floralwhite.50"    
            _hover={{
                backgroundColor: "skyblue.700"
            }}
            _active={{
                backgroundColor: "skyblue.800",
            }} 
            onClick={(e) => {
              e.preventDefault();
              dispatch(resetIsBannerDisplayed())
              dispatch(logout());
              navigate("/login");
            }}
          >
            Logout 
          </Button> :
          <Button
            rightIcon={<ChevronRightIcon/>}
            backgroundColor="peach.300"
            color="#353231"
            _hover={{
              backgroundColor: "peach.500"
            }}
            _active={{
              backgroundColor: "peach.600",
              color: "floralwhite.50"
            }}
            ml="1vw"
            mr="1vw"
            variant="solid"
            type="button"
            minW="fit-content"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Get Started
          </Button>
        }
        <Spacer/>
      </HStack>
    </Box>
  );
};

export default AppHeader;
