import React from "react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer
} from "@chakra-ui/react";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {

    const dispatch = useAppDispatch()
  return (
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
        minHeight="70px"
        position={"sticky"}
        top={"0px"}
        >
        <HStack>
          <Text fontSize='2xl'>trac</Text>
            <Spacer/>
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
