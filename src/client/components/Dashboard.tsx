import { Box, HStack } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import ToggleButton from "./ToggleButton.js";

const Dashboard = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  let habits;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    habits = data?.habits || [];
  }

    return (
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
              <ToggleButton date={new Date("2024-01-04")} isCheckInDay={true}/>
              <ToggleButton date={new Date("2024-01-05")} isCheckInDay={false}/>
              <ToggleButton date={new Date(Date.now())} isCheckInDay={false}/>
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
            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;
