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

export interface MyHabitsProps {
  toggleBannerDisplayed: () => void
}

const MyHabits = ({toggleBannerDisplayed}: MyHabitsProps) => {
  const [habitNames, setHabitNames] = useState<string[]>([])
  const currentUser = useAppSelector((state) => state.auth.user);
  const [statusReportCount, setStatusReportCount] = useState(0)

  console.log("statusReoprtCount: ", statusReportCount)

  let habits: HabitWithDetails[];
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];

    // See if habit names in database update, and if so update array of names in local state
    const habitNamesFromDatabase = habits.map(habit => habit.name)
    if (!compareArrays(habitNamesFromDatabase, habitNames)) {
      setHabitNames(habitNamesFromDatabase)
    }
    
    const addToStatusReportCount = () => {
      setStatusReportCount(statusReportCount + 1)
    }
    return (
      <>
        <Box
          w="100vw"
          h="100%"
          pl={10}
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
              [...habits].sort((a, b) =>  
                a.name.localeCompare(b.name, "en", {ignorePunctuation: true}))
              .map((habit) => (
                <HabitCard 
                  key={habit.id}
                  habit={habit}
                  handleClick={toggleBannerDisplayed}
                  addToStatusReportCount={addToStatusReportCount}
                  statusReportCount={statusReportCount}
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
