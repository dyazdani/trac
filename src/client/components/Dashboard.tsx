import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useSelector } from "react-redux";
import { RootState } from "../app/store.js";
import { DayOfTheWeek } from "@prisma/client";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  let habits;
  if (user) {
    const { data } = useGetHabitsByUserQuery(user.id);
    habits = data?.habits || [];
    {console.log(habits, "I AM A HABIT")}
  }

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
          {habits &&
        habits.map((habit) => (
          <div key={habit.id}>
            
            <p>{habit.name}</p>
            {habit.checkIn && habit.checkIn.dayOfTheWeek && (
            <p>Check in day: {habit.checkIn.dayOfTheWeek}</p>
          )}
          </div>
        ))}
            <RightDrawer />
            <UpdateHabitButton/>
        </Box>
    )
}

export default Dashboard;
