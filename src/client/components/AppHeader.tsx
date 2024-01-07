import React from "react";
import { Button } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { useCreateHabitMutation } from "../features/api.js";

import { 
    HStack, 
    Box, 
    Text 
} from "@chakra-ui/react";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
  const [createHabit, {data, isLoading, error}] = useCreateHabitMutation();

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
