import React from "react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { useCreateScheduleMutation } from "../features/api.js";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer
} from "@chakra-ui/react";
import { DaysOfWeek } from "@knocklabs/node";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
  const [createSchedule] = useCreateScheduleMutation();
  const dispatch = useAppDispatch()

  // TODO: Delete this handClick and the button it's in in a future branch
  const handleClick = async () => {
    const schedules = await createSchedule({
      userId: "1",
      habitName: "Workout",
      days: [DaysOfWeek.Mon, DaysOfWeek.Sun],
      workflowKey: "check-in-day"
    })
    console.log(schedules)
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
            >Create Knock Schedule</Button>
            
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
