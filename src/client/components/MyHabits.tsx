import React from "react";
import todayImg from "../../../images/trac_today_icon.png";
import checkInDayImg from "../../../images/trac_check_in_day_img.png";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";

import { 
  Heading, 
  Text, 
  Image, 
  HStack, 
  VStack, 
  Box 
} from "@chakra-ui/react";

type MyHabitsProps = {};

const MyHabits = (props: MyHabitsProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);

  let habits;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];
    
    return (
      <>
        <Box
          w={"100vw"}
          h={"100%"}
          pl={10}
          bg={"inherit"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Box
            marginTop={10}
          >
            <Heading as='h1' size='2xl' >My Habits</Heading>
            <HStack>
              <HStack spacing={0}>
                <Image src={todayImg} p={0} />
                <Text>= today</Text>
              </HStack>
              <HStack spacing={0}>
                <Image src={checkInDayImg} />
                <Text>= check-in day</Text>
              </HStack>
            </HStack>
          </Box>

          <VStack
            paddingTop={"4rem"}
            align={"start"}
          >
            {habits &&
              habits.map((habit) => (
                <div key={habit.id}>
                  <p>{habit.name}</p>
                  {habit.checkIn && (
                    <p>Check in day: {habit.checkIn.dayOfTheWeek}</p>
                  )}
                </div>
              ))}
          </VStack>
        </Box>
      </>
    );
  }
};

export default MyHabits;
