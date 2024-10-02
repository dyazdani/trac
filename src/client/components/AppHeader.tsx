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
    LinkOverlay,
    Flex,
    LinkBox,
    useBreakpointValue, 
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom'
import MessagesMenu from "./MessagesMenu.js";
import { useNavigate } from "react-router";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { resetIsBannerDisplayed } from "../features/bannerSlice.js";
import GitHubButton from "./GitHubButton.js";

export interface AppHeaderProps {
  isBannerDisplayed: boolean | null
  page: "landing" | "dashboard"
}

const AppHeader = ({isBannerDisplayed, page}: AppHeaderProps) => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const label = useBreakpointValue(
    {
      base: "",
      md: "Notifications"
    },
    {ssr: false}
  )
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
      <HStack 
        justifyContent="space-between"
        alignItems="center"
      >
        <LinkBox>
          <LinkOverlay as={ReactRouterLink} to="/">
            <Flex
              gap="0.5rem"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="4xl">trac</Text>
              <Image
                src="/images/trac_logo.png"
                alt="Trac mountain logo"
                h="2.5rem"
              />
            </Flex>
          </LinkOverlay>
        </LinkBox>
        <HStack 
          justifyContent="center"
          alignItems="center"
        >
          {currentUser ? 
          <Box
            ml="1vw"
            mr="1vw"
            display={{
              base: "none",
              md: "block"
            }}
          > 
            <Text>Hi, <Text as='b'>{currentUser?.username}</Text>!
            </Text>
          </Box> : 
          <ChakraLink
            as={ReactRouterLink}
            to="/login"
            display={{
              base: "none",
              md: "block"
            }}
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
            <MessagesMenu 
              label={label} 
            />
          </KnockFeedProvider>
        }
      
        {
          currentUser ?
          <Button
            type="button"
            display={{
              base: "none",
              md: "block"
            }}
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
            display={{
              base: "none",
              md: "block"
            }}
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
        <LinkBox
          height="40px"
          display={{
            base: "none",
            md: "block"
          }}
        >
          <GitHubButton
            isAbsolutePosition={false}
          />
        </LinkBox>
        </HStack> 
      </HStack>
    </Box>
  );
};

export default AppHeader;
