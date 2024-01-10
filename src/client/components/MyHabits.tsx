import React, {useState} from "react";
import todayImg from "../../../images/trac_today_icon.png";
import checkInDayImg from "../../../images/trac_check_in_day_img.png";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import HabitCard from "./HabitCard.js";

import { 
  Heading, 
  Text, 
  Image, 
  HStack, 
  VStack, 
  Box 
} from "@chakra-ui/react";
import { HabitWithDetails } from "../../types/index.js";
import compareArrays from "../../utils/compareStringArrays.js";


const MyHabits = () => {
  const [habitNames, setHabitNames] = useState<string[]>([])
  const currentUser = useAppSelector((state) => state.auth.user);

  let habits;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];

    console.log("habitNames: ", habitNames)

    // See if habit names in database update, and if so update array of names in local state
    const habitNamesFromDatabase = habits.map(habit => habit.name)
    console.log("habitNamesFromDatabase: ", habitNamesFromDatabase)
    if (!compareArrays(habitNamesFromDatabase, habitNames)) {
      setHabitNames(habitNamesFromDatabase)
    }
    
    return (
      <>
        <Box
          w="100vw"
          h="100%"
          pl={10}
          bg="inherit"
          display="flex"
          flexDirection="column"
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
          >
            {habits &&
              [...habits].sort((a, b) =>  
                a.name.localeCompare(b.name, "en", {ignorePunctuation: true}))
              .map((habit) => (
                <HabitCard 
                  key={habit.id}
                  habit={habit}
                />
              ))
            }
          </VStack>
        </Box>
      </>
    );
  }
};

export default MyHabits;
