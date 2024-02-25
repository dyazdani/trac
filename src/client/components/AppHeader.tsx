import { 
  useAppDispatch, 
  useAppSelector 
} from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import {
  KnockFeedProvider
} from "@knocklabs/react-notification-feed";

import { useCreateScheduleMutation } from "../features/api.js";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer,
    Heading,
    VStack,
    Image
} from "@chakra-ui/react";
import MessagesMenu from "./MessagesMenu.js";
import { useNavigate } from "react-router";
import { ChevronRightIcon } from "@chakra-ui/icons";

type AppHeaderProps = {
  isBannerDisplayed: boolean | undefined
};

const AppHeader = ({isBannerDisplayed}: AppHeaderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

  return (
    <Box 
      bg="#b9eefe" 
      w="100vw"
      maxWidth="100%" 
      p="1vw"
      minHeight="70px"
      position={"sticky"}
      // TODO: Uncomment the following lines when done with testing
      top={
        // isBannerDisplayed ? 
        // "54px" : 
        "0px"}
      zIndex={100}
    >
      <HStack>
        <Heading>trac</Heading>
        <Image
          src="/images/trac_logo.png"
          alt="trac mountain logo"
          h="2.5rem"
        />
        <Spacer/>

        {
          currentUser ? 
          <Box
            ml="1vw"
            mr="1vw"
          > 
            <Text>{`Welcome back, `}<Text as='b'>{currentUser?.username}</Text>
            </Text>
          </Box> : 
          ""
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
            color="#000000"
            colorScheme="orange"
            onClick={(e) => {
              e.preventDefault();
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout 
          </Button> :
          <Button
            rightIcon={<ChevronRightIcon/>}
            colorScheme="orange"
            color="#000000"
          >
            Get Started
          </Button>
        }
        
      </HStack>
    </Box>
  );
};

export default AppHeader;
