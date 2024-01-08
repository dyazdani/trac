import React from "react";
import todayImg from "../../../images/trac_today_icon.png";
import checkInDayImg from "../../../images/trac_check_in_day_img.png";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import Habit from "./Habit.js";

import { 
  Heading, 
  Text, 
  Image, 
  HStack, 
  VStack, 
  Box
} from "@chakra-ui/react";


const MyHabits = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  let habits;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];
    
    return (
      <>
        <Box
          w="100vw"
          h="100%"
          pl={10}
          bg="tomato"
          display="flex"
          flexDirection="column"
          paddingBottom="50px"
        >
          <Box
            marginTop={10}
          >
            <Heading as='h1' size='2xl' >My Habits</Heading>
            <HStack>
              <HStack spacing={0}>
                <Image src={todayImg} alt="purple circle indicating today" p={0} />
                <Text>= today</Text>
              </HStack>
              <HStack spacing={0}>
                <Image src={checkInDayImg} alt="yellow diamond indicating check-in day" />
                <Text>= check-in day</Text>
              </HStack>
            </HStack>
          </Box>

          <VStack
            paddingTop="4rem"
            align="start"
            spacing="20"
          >
            {habits &&
              habits.map((habit) => (
                <Habit key={habit.id} />
              ))}
          </VStack>
        </Box>
      </>
    );
  }
};

export default MyHabits;
