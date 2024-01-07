import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import UpdateHabitButton from "./UpdateHabitButton.js";

const Dashboard = () => {

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
