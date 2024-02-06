import HabitCard from "./HabitCard.js";
import { VStack } from "@chakra-ui/react";
import { HabitWithDetails } from "../../types/index.js";

export interface MyHabitsProps {
  toggleBannerDisplayed: () => void
  habits: HabitWithDetails[] | undefined
}

const MyHabits = ({toggleBannerDisplayed, habits}: MyHabitsProps) => {   
  return (
    <VStack
      paddingTop="4rem"
      align="start"
      spacing="20"
    >
      {habits &&
        [...habits].filter(habit => !habit.milestoneId)
        .sort((a, b) =>  
          a.name.localeCompare(b.name, "en", {ignorePunctuation: true}))
        .map((habit) => (
          <HabitCard 
            key={habit.id}
            habit={habit}
            handleClick={toggleBannerDisplayed}
          />
        ))
      }
    </VStack>
  );
};

export default MyHabits;
