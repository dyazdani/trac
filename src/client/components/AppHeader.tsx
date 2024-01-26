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
    Spacer
} from "@chakra-ui/react";
import MessagesMenu from "./MessagesMenu.js";

type AppHeaderProps = {
  isBannerDisplayed: boolean | undefined
};

const AppHeader = ({isBannerDisplayed}: AppHeaderProps) => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.user);
  
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
          <Text fontSize='2xl'>trac</Text>
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
            <Button
                type="button"
                onClick={() => {dispatch(logout())}}
            >
                Logout
            </Button>
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
