import { Box, HStack } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import { 
    useGetHabitsByUserQuery, 
    useGetHabitByIdQuery 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import ToggleButton from "./ToggleButton.js";


const Dashboard = () => {
  
  // TODO: Will need to remove habit variable when cleaning up code and finalizing dashboard
  let habits;
  let habit
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];
    
    const { data: habitData } = useGetHabitByIdQuery({
        id: 2,
        habitId: 5
    })
    habit = habitData?.habit

    console.log(habit)
  }

  return (
    <>
      <RightDrawer />
      <Box
            as="div"
            h="100vh"
            w="100vw"
        >
          <HStack
              ml="10px"
              mt="50px"
            >
              {/* TODO: these test toggle buttons will need to be removed */}
              <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
          </HStack>
          {habits &&
        habits.map((habit) => (
          <div key={habit.id}>
            
            <p>{habit.name}</p>
            {habit.checkIn && (
            <p>Check in day: {habit.checkIn.dayOfTheWeek}</p>
          )}
          </div>
        ))}
            <RightDrawer />
            <MyHabits />
            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;
