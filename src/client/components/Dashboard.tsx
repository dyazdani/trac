import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import HabitCard from "./HabitCard.js";
import { 
    useGetHabitsByUserQuery, 
    useGetHabitByIdQuery 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";


const Dashboard = () => {
  return (
    <>
      <RightDrawer />
      <Box as="div" 
      w="100vw"
      >
        <MyHabits />
      </Box>
    </>
  );
};

export default Dashboard;
