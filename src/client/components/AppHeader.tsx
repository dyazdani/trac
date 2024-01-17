import React from "react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { useSendStatusReportMutation } from "../features/api.js";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer
} from "@chakra-ui/react";
import { DaysOfWeek } from "@knocklabs/node";
import { DragHandleIcon } from "@chakra-ui/icons";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
  const [sendStatusReport] = useSendStatusReportMutation();
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    const response = await sendStatusReport({
      id: 4,
      habitId: 27,
      user: "Bob",
      habitName: "Not a Good Habit",
      emails: ["darayazdani@yahoo.com", "trac_app@yahoo.com"],
      message: "This is a test of the sendStatusReport mutation"
    })
    console.log(response)
  } 

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
            <Button
                type="button"
                onClick={() => {dispatch(logout())}}
            >
                Logout
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleClick()
              }}
            >Send Status Report</Button>
            
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
