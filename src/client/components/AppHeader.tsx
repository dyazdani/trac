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
} from "@chakra-ui/react";
import MessagesMenu from "./MessagesMenu.js";
import { useNavigate } from "react-router";

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
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
        minHeight="70px"
        position={"sticky"}
        top={isBannerDisplayed ? "54px" : "0px"}
        zIndex={100}
        >
        <HStack>
          <Heading>trac</Heading>
            <Spacer/>
            {process.env.KNOCK_FEED_CHANNEL_ID && 
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
            <Text>{`Welcome back, `}<Text as='b'>{currentUser?.username}</Text>
            </Text>

            <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(logout());
                  navigate("/");
                }}
            >
                Logout
            </Button>
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
