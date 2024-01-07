import React from "react";
import { Button } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { useCreateHabitMutation } from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";

import { 
    HStack, 
    Box, 
    Text 
} from "@chakra-ui/react";

// Moving this code to AppHeader to get it out of the way of the MyHabits page
const habitDetails = {
  name: `"THIS IS A TEST"`,
  routineDays: {
      monday: false,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
  },
  checkInDay: DayOfTheWeek.MONDAY
}

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
