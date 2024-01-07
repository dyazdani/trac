import React from "react";
import { Button, Spacer } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";

import { 
    HStack, 
    Box, 
    Text 
} from "@chakra-ui/react";
import ToggleButton from "./ToggleButton.js";
import DiamondToggleButton from "./DiamondImage.js";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
    const dispatch = useAppDispatch()
  return (
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
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
