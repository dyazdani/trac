import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import { 
    useGetHabitsByUserQuery, 
    useGetHabitByIdQuery 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";


const Dashboard = () => {
  
  // TODO: Will need to remove habit variable when cleaning up code and finalizing dshboard
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
        <MyHabits />
        {/* <UpdateHabitButton/> */}
      </Box>
    </>
  );
};

export default Dashboard;
