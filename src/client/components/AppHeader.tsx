import React from "react";
import { 
  useAppDispatch, 
  useAppSelector 
} from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import {
  KnockFeedProvider
} from "@knocklabs/react-notification-feed";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer
} from "@chakra-ui/react";
import MessagesMenu from "./MessagesMenu.js";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.user);

  console.log(process.env, "Node environment object")
  console.log(process.env.ACCESS_TOKEN_SECRET, "ACCESS TOKEN")
  console.log(process.env.KNOCK_API_KEY, "KNOCK API KEY")
  
  return (
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
        minHeight="70px"
        position={"sticky"}
        top={"0px"}
        zIndex={100}
        >
        <HStack>
          <Text fontSize='2xl'>trac</Text>
            <Spacer/>
            {process.env.KNOCK_API_KEY && 
            process.env.KNOCK_PUBLIC_API_KEY && 
            currentUser &&
              <KnockFeedProvider
                apiKey={process.env.KNOCK_PUBLIC_API_KEY}
                feedId={process.env.KNOCK_API_KEY}
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
